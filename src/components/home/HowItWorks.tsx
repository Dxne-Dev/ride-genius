
import React from 'react';
import { SearchIcon, CarIcon, MessageCircleIcon, StarIcon } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <SearchIcon className="h-6 w-6" />,
      title: "Recherchez un trajet",
      description: "Entrez votre point de départ, votre destination et la date souhaitée pour trouver des conducteurs disponibles."
    },
    {
      icon: <CarIcon className="h-6 w-6" />,
      title: "Réservez votre place",
      description: "Choisissez le trajet qui vous convient et réservez votre place en quelques clics."
    },
    {
      icon: <MessageCircleIcon className="h-6 w-6" />,
      title: "Communiquez",
      description: "Échangez avec le conducteur pour confirmer les détails du trajet et organiser le lieu de rendez-vous."
    },
    {
      icon: <StarIcon className="h-6 w-6" />,
      title: "Voyagez et évaluez",
      description: "Profitez de votre trajet et laissez un avis pour aider la communauté."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-carpu-purple/10 text-carpu-purple text-sm font-medium mb-4">
            Guide d'utilisation
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça <span className="text-gradient">fonctionne</span> ?</h2>
          <p className="text-muted-foreground">
            Voyager n'a jamais été aussi simple. Suivez ces étapes pour trouver et réserver votre prochain covoiturage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(100%-8px)] w-full h-0.5 bg-gradient-to-r from-carpu-purple to-carpu-mint"></div>
              )}
              
              <div className="text-center relative">
                <div className="w-20 h-20 bg-carpu-gradient rounded-full flex items-center justify-center text-white mx-auto mb-6 relative">
                  <span className="absolute inset-0 rounded-full bg-carpu-gradient opacity-30 animate-pulse"></span>
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-carpu-purple flex items-center justify-center text-carpu-purple font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
