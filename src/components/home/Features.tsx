
import React from 'react';
import { 
  SearchIcon, 
  MapPinIcon, 
  CreditCardIcon, 
  MessageCircleIcon, 
  ShieldCheckIcon, 
  MapIcon 
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="glass-card p-6 hover:translate-y-[-5px]">
      <div className="h-12 w-12 rounded-xl bg-carpu-gradient flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <SearchIcon className="h-6 w-6" />,
      title: "Recherche intelligente",
      description: "Trouvez rapidement des trajets correspondant à vos besoins grâce à nos filtres avancés."
    },
    {
      icon: <MapPinIcon className="h-6 w-6" />,
      title: "Suivi en temps réel",
      description: "Suivez l'itinéraire de votre conducteur en temps réel et partagez votre position avec vos proches."
    },
    {
      icon: <CreditCardIcon className="h-6 w-6" />,
      title: "Paiement sécurisé",
      description: "Réglez vos trajets en ligne de manière sécurisée et sans transaction en espèces."
    },
    {
      icon: <MessageCircleIcon className="h-6 w-6" />,
      title: "Communication facile",
      description: "Échangez avec les autres utilisateurs via notre messagerie intégrée avant et pendant le trajet."
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      title: "Confiance et sécurité",
      description: "Profils vérifiés, avis et évaluations pour voyager l'esprit tranquille."
    },
    {
      icon: <MapIcon className="h-6 w-6" />,
      title: "Navigation optimisée",
      description: "Itinéraires optimisés et calcul automatique du temps de trajet pour une expérience sans stress."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute top-1/2 left-0 w-1/3 h-1/2 bg-carpu-mint opacity-10 blur-[100px] rounded-full -z-10" />
      <div className="absolute top-1/3 right-0 w-1/2 h-1/2 bg-carpu-purple opacity-10 blur-[150px] rounded-full -z-10" />
      
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-carpu-mint/10 text-carpu-mint text-sm font-medium mb-4">
            Pourquoi nous choisir
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Une expérience de covoiturage <span className="text-gradient">optimale</span></h2>
          <p className="text-muted-foreground">
            Découvrez les fonctionnalités qui rendent notre plateforme unique et simple d'utilisation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
