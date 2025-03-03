
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-carpu-gradient p-10 md:p-16">
          {/* Glassmorphism circles for decoration */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-white max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à rejoindre notre communauté ?</h2>
              <p className="text-white/80 mb-6">
                Inscrivez-vous gratuitement et commencez à voyager plus intelligemment, 
                économiquement et écologiquement dès aujourd'hui !
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-carpu-purple hover:bg-white/90 transition-colors">
                  <Link to="/signup">
                    Créer un compte
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link to="/search">Trouver un trajet</Link>
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-sm mx-auto">
                <div className="text-white text-center">
                  <div className="text-5xl font-bold mb-2">5000+</div>
                  <p className="text-white/80 mb-4">nouveaux trajets chaque jour</p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold mb-1">2M+</div>
                      <p className="text-white/80 text-sm">utilisateurs</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold mb-1">50k+</div>
                      <p className="text-white/80 text-sm">avis positifs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
