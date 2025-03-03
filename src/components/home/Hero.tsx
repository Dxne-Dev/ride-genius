
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SearchIcon, MapIcon, CreditCardIcon } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-32">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-carpu-gradient opacity-10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-carpu-mint opacity-10 blur-[120px] rounded-full -z-10" />
      
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
          {/* Left content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-4 animate-fade-up">
              <span className="inline-block py-1.5 px-4 rounded-full bg-carpu-purple/10 text-carpu-purple text-sm font-medium">
                Voyagez malin, voyagez ensemble
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Partagez vos trajets, <span className="text-gradient">réduisez vos coûts</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Trouvez facilement des covoiturages pour vos déplacements quotidiens ou vos voyages. Économisez de l'argent et réduisez votre empreinte carbone.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="bg-carpu-gradient hover:opacity-90 transition-opacity">
                <Link to="/search">
                  <SearchIcon className="mr-2 h-5 w-5" />
                  Trouver un trajet
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/offer">
                  <MapIcon className="mr-2 h-5 w-5" />
                  Proposer un trajet
                </Link>
              </Button>
            </div>
            
            <div className="pt-4 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="text-center">
                <p className="text-2xl font-bold text-carpu-purple">500K+</p>
                <p className="text-sm text-muted-foreground">Utilisateurs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-carpu-purple">10M+</p>
                <p className="text-sm text-muted-foreground">Trajets réalisés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-carpu-purple">20T+</p>
                <p className="text-sm text-muted-foreground">CO₂ économisé</p>
              </div>
            </div>
          </div>
          
          {/* Right content - Image */}
          <div className="flex-1 relative animate-fade-in">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute inset-0 bg-carpu-gradient opacity-10 blur-[60px] rounded-full -z-10"></div>
              <img 
                src="/lovable-uploads/1443033f-3cee-4b8f-8269-0bdf1fe399e8.png" 
                alt="RideGenius App Interface" 
                className="w-full h-auto object-contain rounded-2xl shadow-card"
              />
              
              {/* Floating elements */}
              <div className="absolute -right-10 top-1/4 glass-effect rounded-xl p-4 animate-pulse-slow">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-carpu-mint rounded-full flex items-center justify-center text-white">
                    <CreditCardIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Économisez</p>
                    <p className="text-xs text-muted-foreground">jusqu'à 50% sur vos trajets</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-10 top-2/3 glass-effect rounded-xl p-4 animate-pulse-slow" style={{ animationDelay: "1s" }}>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-carpu-purple rounded-full flex items-center justify-center text-white">
                    <MapIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">+5000 trajets</p>
                    <p className="text-xs text-muted-foreground">disponibles chaque jour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
