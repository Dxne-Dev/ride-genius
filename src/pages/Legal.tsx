
import React from 'react';
import Layout from '@/components/Layout';

const Legal = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="lead mb-6">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Éditeur du site</h2>
            <p>
              <strong>RideGenius SAS</strong><br />
              Société par actions simplifiée au capital de 10 000 €<br />
              RCS Paris B 123 456 789<br />
              Siège social : 123 Rue du Covoiturage, 75001 Paris, France<br />
              Numéro de TVA intracommunautaire : FR 12 345 678 901<br />
              Directeur de la publication : Jean Dupont, Président
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Hébergement</h2>
            <p>
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis<br />
              https://vercel.com
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site, y compris, mais sans s'y limiter, les graphiques, images, textes, vidéos, logos, 
              et icônes sont la propriété exclusive de RideGenius, à l'exception des marques, logos ou contenus appartenant à 
              d'autres sociétés partenaires ou auteurs.
            </p>
            <p>
              Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces 
              différents éléments est strictement interdite sans l'accord express par écrit de RideGenius.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Données personnelles</h2>
            <p>
              Conformément aux dispositions du Règlement Général sur la Protection des Données (RGPD) et de la loi Informatique et 
              Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles 
              vous concernant.
            </p>
            <p>
              Pour exercer ces droits, vous pouvez nous contacter par email à l'adresse privacy@ridegenius.com ou par courrier à 
              RideGenius - Service DPO, 123 Rue du Covoiturage, 75001 Paris, France.
            </p>
            <p>
              Pour plus d'informations sur la façon dont nous traitons vos données, veuillez consulter notre Politique de confidentialité.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Loi applicable et juridiction</h2>
            <p>
              Les présentes mentions légales sont régies par la loi française. En cas de différend et à défaut d'accord amiable, 
              le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à legal@ridegenius.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Legal;
