import requests
import json
import time
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class OverpassAPI:
    """
    Class to handle OpenStreetMap data retrieval via Overpass API
    Focused on Palmela, Portugal region
    """
    
    def __init__(self, cache_dir="osm_cache"):
        """Initialize the Overpass API handler with caching"""
        # Primary and backup endpoints
        self.endpoints = [
            "https://overpass-api.de/api/interpreter",
            "https://overpass.kumi.systems/api/interpreter",
            "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
        ]
        self.current_endpoint = 0  # Index of the current endpoint
        
        # Create cache directory
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
    
    def _get_endpoint(self):
        """Get the current working endpoint with fallback"""
        return self.endpoints[self.current_endpoint]
    
    def _switch_endpoint(self):
        """Switch to the next endpoint if the current one fails"""
        self.current_endpoint = (self.current_endpoint + 1) % len(self.endpoints)
        logger.info(f"Switching to endpoint: {self._get_endpoint()}")
    
    def _cache_filename(self, query_type):
        """Generate a cache filename based on query type"""
        return self.cache_dir / f"palmela_{query_type}.json"
    
    def _save_to_cache(self, data, query_type):
        """Save data to cache file"""
        cache_file = self._cache_filename(query_type)
        with open(cache_file, 'w', encoding='utf-8') as f:
            json.dump(data, f)
        logger.info(f"Saved data to cache: {cache_file}")
    
    def _load_from_cache(self, query_type, max_age_hours=24):
        """Load data from cache if available and not too old"""
        cache_file = self._cache_filename(query_type)
        
        if not cache_file.exists():
            return None
        
        # Check file age
        file_age_hours = (time.time() - cache_file.stat().st_mtime) / 3600
        if file_age_hours > max_age_hours:
            logger.info(f"Cache too old ({file_age_hours:.1f} hours)")
            return None
        
        try:
            with open(cache_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            logger.info(f"Loaded data from cache: {cache_file}")
            return data
        except Exception as e:
            logger.error(f"Error loading cache: {e}")
            return None
    
    def query_overpass(self, query, query_type, force_refresh=False):
        """
        Query the Overpass API with retry and caching logic
        
        Args:
            query (str): The Overpass QL query
            query_type (str): Type of query for caching (e.g., "schools", "parks")
            force_refresh (bool): Whether to force a refresh from the API
            
        Returns:
            dict: The JSON response from Overpass
        """
        # Try to load from cache first
        if not force_refresh:
            cached_data = self._load_from_cache(query_type)
            if cached_data:
                return cached_data
        
        # Prepare the request
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'PalmelaThematicMapsApp/1.0'
        }
        payload = {'data': query}
        
        # Try each endpoint with retries
        max_retries = 3
        retry_delay = 2  # Initial delay in seconds
        
        for attempt in range(max_retries * len(self.endpoints)):
            try:
                endpoint = self._get_endpoint()
                logger.info(f"Querying {endpoint} for {query_type} data")
                
                response = requests.post(
                    endpoint,
                    headers=headers,
                    data=payload,
                    timeout=30  # 30 seconds timeout
                )
                
                if response.status_code == 200:
                    data = response.json()
                    # Cache the successful response
                    self._save_to_cache(data, query_type)
                    return data
                elif response.status_code == 429:  # Too Many Requests
                    logger.warning("Rate limited, waiting longer before retry")
                    time.sleep(retry_delay * 5)  # Wait longer for rate limits
                else:
                    logger.warning(f"HTTP error: {response.status_code}")
            
            except requests.exceptions.RequestException as e:
                logger.error(f"Request failed: {e}")
            
            # Switch endpoint or increase delay
            if (attempt + 1) % len(self.endpoints) == 0:
                retry_delay *= 2  # Exponential backoff
            self._switch_endpoint()
            time.sleep(retry_delay)
        
        logger.error("All API endpoints failed after multiple retries")
        return {"error": "Failed to fetch data from Overpass API"}
    
    def get_schools(self):
        """Get all schools in Palmela"""
        query = """
        [out:json];
        area["name"="Palmela"]["admin_level"="8"]->.palmelaArea;
        (
          node["amenity"="school"](area.palmelaArea);
          way["amenity"="school"](area.palmelaArea);
          relation["amenity"="school"](area.palmelaArea);
        );
        out body;
        >;
        out skel qt;
        """
        return self.query_overpass(query, "schools")
    
    def get_historical_sites(self):
        """Get historical sites in Palmela"""
        query = """
        [out:json];
        area["name"="Palmela"]["admin_level"="8"]->.palmelaArea;
        (
          node["historic"](area.palmelaArea);
          way["historic"](area.palmelaArea);
          relation["historic"](area.palmelaArea);
          
          node["tourism"="museum"](area.palmelaArea);
          way["tourism"="museum"](area.palmelaArea);
          
          node["heritage"](area.palmelaArea);
          way["heritage"](area.palmelaArea);
          relation["heritage"](area.palmelaArea);
        );
        out body;
        >;
        out skel qt;
        """
        return self.query_overpass(query, "historical_sites")
    
    def get_environmental_features(self):
        """Get environmental features in Palmela"""
        query = """
        [out:json];
        area["name"="Palmela"]["admin_level"="8"]->.palmelaArea;
        (
          // Parks and green spaces
          node["leisure"="park"](area.palmelaArea);
          way["leisure"="park"](area.palmelaArea);
          relation["leisure"="park"](area.palmelaArea);
          
          // Nature reserves
          node["leisure"="nature_reserve"](area.palmelaArea);
          way["leisure"="nature_reserve"](area.palmelaArea);
          relation["leisure"="nature_reserve"](area.palmelaArea);
          
          // Forest areas
          way["landuse"="forest"](area.palmelaArea);
          relation["landuse"="forest"](area.palmelaArea);
          
          // Water features
          way["natural"="water"](area.palmelaArea);
          relation["natural"="water"](area.palmelaArea);
        );
        out body;
        >;
        out skel qt;
        """
        return self.query_overpass(query, "environmental_features")
    
    def get_urban_elements(self):
        """Get urban planning elements in Palmela"""
        query = """
        [out:json];
        area["name"="Palmela"]["admin_level"="8"]->.palmelaArea;
        (
          // Land use
          way["landuse"](area.palmelaArea);
          relation["landuse"](area.palmelaArea);
          
          // Buildings
          way["building"](area.palmelaArea);
          
          // Roads
          way["highway"](area.palmelaArea);
        );
        out body;
        >;
        out skel qt;
        """
        return self.query_overpass(query, "urban_elements")
    
    def get_by_bounding_box(self, feature_types, south=38.54, west=-8.92, north=38.64, east=-8.58):
        """
        Query features within a bounding box instead of administrative boundary
        
        Args:
            feature_types (list): List of OSM feature types to query, e.g. ["amenity=restaurant"]
            south, west, north, east: Coordinates of bounding box
        """
        bbox = f"{south},{west},{north},{east}"
        
        # Build the query from feature types
        feature_queries = []
        for feature in feature_types:
            if "=" in feature:
                key, value = feature.split("=")
                feature_queries.append(f'node["{key}"="{value}"]({bbox});')
                feature_queries.append(f'way["{key}"="{value}"]({bbox});')
                feature_queries.append(f'relation["{key}"="{value}"]({bbox});')
            else:
                feature_queries.append(f'node["{feature}"]({bbox});')
                feature_queries.append(f'way["{feature}"]({bbox});')
                feature_queries.append(f'relation["{feature}"]({bbox});')
        
        query = f"""
        [out:json];
        (
          {' '.join(feature_queries)}
        );
        out body;
        >;
        out skel qt;
        """
        
        query_type = f"bbox_{'-'.join(feature_types).replace('=', '_')}"
        return self.query_overpass(query, query_type)


def convert_to_geojson(overpass_data):
    """
    Convert Overpass API data to GeoJSON format
    
    Args:
        overpass_data (dict): Data from Overpass API
        
    Returns:
        dict: GeoJSON FeatureCollection
    """
    # Create basic GeoJSON structure
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }
    
    if not overpass_data or "elements" not in overpass_data:
        return geojson
    
    # First, collect all nodes for way geometry reconstruction
    nodes = {}
    for element in overpass_data["elements"]:
        if element["type"] == "node":
            nodes[element["id"]] = {
                "lat": element["lat"],
                "lon": element["lon"]
            }
    
    # Process each element
    for element in overpass_data["elements"]:
        # Only process elements with tags
        if "tags" not in element:
            continue
            
        if element["type"] == "node" and "lat" in element and "lon" in element:
            # Process point features
            geojson["features"].append({
                "type": "Feature",
                "id": f"node/{element['id']}",
                "properties": {
                    **element.get("tags", {}),
                    "osm_type": "node",
                    "osm_id": element["id"]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [element["lon"], element["lat"]]
                }
            })
            
        elif element["type"] == "way" and "nodes" in element:
            # Try to construct way geometry
            coordinates = []
            for node_id in element["nodes"]:
                if node_id in nodes:
                    coordinates.append([nodes[node_id]["lon"], nodes[node_id]["lat"]])
            
            if coordinates:
                # Check if it's a closed way (polygon)
                if len(coordinates) > 3 and element["nodes"][0] == element["nodes"][-1]:
                    geojson["features"].append({
                        "type": "Feature",
                        "id": f"way/{element['id']}",
                        "properties": {
                            **element.get("tags", {}),
                            "osm_type": "way",
                            "osm_id": element["id"]
                        },
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [coordinates]
                        }
                    })
                else:
                    geojson["features"].append({
                        "type": "Feature",
                        "id": f"way/{element['id']}",
                        "properties": {
                            **element.get("tags", {}),
                            "osm_type": "way",
                            "osm_id": element["id"]
                        },
                        "geometry": {
                            "type": "LineString",
                            "coordinates": coordinates
                        }
                    })
            
        # Relations are complex and would need more processing
    
    return geojson


def save_geojson(geojson_data, filename):
    """Save GeoJSON data to file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(geojson_data, f)
    logger.info(f"Saved GeoJSON to {filename}")


# Example usage
if __name__ == "__main__":
    # Initialize the API handler
    api = OverpassAPI()
    
    # Get different types of data
    print("Fetching schools in Palmela...")
    schools_data = api.get_schools()
    print(f"Found {len(schools_data.get('elements', []))} school elements")
    
    # Convert to GeoJSON
    schools_geojson = convert_to_geojson(schools_data)
    save_geojson(schools_geojson, "palmela_schools.geojson")
    
    # Get historical sites
    print("Fetching historical sites in Palmela...")
    historical_data = api.get_historical_sites()
    historical_geojson = convert_to_geojson(historical_data)
    save_geojson(historical_geojson, "palmela_historical.geojson")
    
    # Get environmental features
    print("Fetching environmental features in Palmela...")
    env_data = api.get_environmental_features()
    env_geojson = convert_to_geojson(env_data)
    save_geojson(env_geojson, "palmela_environmental.geojson")
    
    # Get custom features by bounding box
    print("Fetching wineries in the Palmela region...")
    wineries = api.get_by_bounding_box(["craft=winery", "amenity=winery"])
    wineries_geojson = convert_to_geojson(wineries)
    save_geojson(wineries_geojson, "palmela_wineries.geojson")