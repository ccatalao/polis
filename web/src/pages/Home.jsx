import React from 'react';
import { Link } from 'react-router-dom';

// Import placeholder images for development
const placeholderImageUrl = 'https://via.placeholder.com/400x300';

// Feature Card Component
const FeatureCard = ({ title, description, imageUrl, linkTo }) => {
  return (
    <div className="feature-card">
      <img 
        src={imageUrl || placeholderImageUrl} 
        alt={title}
        className="feature-image"
      />
      <div className="feature-content">
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
        <Link to={linkTo} className="feature-button">
          Ver mais
        </Link>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div>
      <div className="hero">
        <div className="container">
          <h1>Planeamento Urbano Informado</h1>
          <p>
            Um guia para políticas de desenvolvimento local mais eficazes e sustentáveis
          </p>
        </div>
      </div>

      <div className="features-grid">
        <FeatureCard
          title="Serviços Municipais"
          description="Aceda aos serviços e recursos municipais em matéria de urbanismo, ordenamento do território e habitação."
          imageUrl="/polis/images/home/municipio.webp"
          linkTo="/municipio"
        />

        <FeatureCard
          title="Projetos europeus"
          description="Explore oportunidades de financiamento e colaboração em projetos europeus de desenvolvimento urbano."
          imageUrl="/polis/images/home/projects.webp"
          linkTo="/projects"
        />

        <FeatureCard
          title="Financiamento"
          description="Descubra fontes de financiamento disponíveis para projetos de desenvolvimento urbano sustentável."
          imageUrl="/polis/images/home/funding.webp"
          linkTo="/funding"
        />

        <FeatureCard
          title="Publicações de acesso aberto"
          description="Aceda a revistas científicas e recursos académicos sobre urbanismo e ordenamento do território."
          imageUrl="/polis/images/home/publicacoes.webp"
          linkTo="/chapters"
        />
      </div>
    </div>
  );
};

export default Home; 