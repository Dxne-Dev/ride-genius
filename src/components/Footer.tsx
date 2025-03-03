
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-border/40 py-12 mt-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold text-gradient">RideGenius</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Voyagez ensemble, partagez les frais et protégez la planète avec notre plateforme de covoiturage intuitive.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-carpu-purple transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-carpu-purple transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-carpu-purple transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Rechercher un trajet
                </Link>
              </li>
              <li>
                <Link to="/offer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Proposer un trajet
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Centre d'aide
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Politique de cookies
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                Email: contact@ridegenius.com
              </li>
              <li className="text-sm text-muted-foreground">
                Téléphone: +33 1 23 45 67 89
              </li>
              <li className="text-sm text-muted-foreground">
                Adresse: 123 Rue du Covoiturage, Paris
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-10 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RideGenius. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
