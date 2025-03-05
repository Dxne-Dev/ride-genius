
import React from 'react';
import Layout from '@/components/Layout';

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Conditions d'utilisation</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="lead mb-6">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptation des conditions</h2>
            <p>
              En accédant ou en utilisant le service RideGenius, vous acceptez d'être lié par ces conditions. 
              Si vous n'acceptez pas ces conditions, vous ne devez pas accéder ou utiliser le service.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Description du service</h2>
            <p>
              RideGenius est une plateforme de covoiturage qui permet aux utilisateurs de proposer et de réserver des trajets.
              Le service est fourni "tel quel" et nous ne garantissons pas qu'il sera ininterrompu ou exempt d'erreurs.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Comptes utilisateurs</h2>
            <p>
              Pour utiliser certaines fonctionnalités du service, vous devez créer un compte. Vous êtes responsable de maintenir 
              la confidentialité de vos informations de compte et de toutes les activités qui se produisent sous votre compte.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Comportement des utilisateurs</h2>
            <p>
              Vous acceptez de ne pas utiliser le service pour des activités illégales ou interdites et d'agir de manière 
              respectueuse envers les autres utilisateurs. RideGenius se réserve le droit de suspendre ou de résilier votre 
              compte en cas de violation de ces conditions.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Paiements et frais</h2>
            <p>
              Les frais de service sont communiqués avant la confirmation de la réservation. En effectuant un paiement, 
              vous autorisez RideGenius à débiter votre moyen de paiement choisi pour le montant spécifié.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Annulations et remboursements</h2>
            <p>
              Les conditions d'annulation et de remboursement sont détaillées dans notre politique d'annulation, 
              accessible sur notre site web.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitation de responsabilité</h2>
            <p>
              RideGenius n'est pas responsable des actions, contenus, informations ou données des utilisateurs tiers. 
              Dans toute la mesure permise par la loi, RideGenius ne sera pas responsable des dommages indirects, 
              accessoires, spéciaux, consécutifs ou punitifs.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">8. Modifications des conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront effectives 
              dès leur publication sur le service. Votre utilisation continue du service après la publication de modifications 
              constitue votre acceptation de ces modifications.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact</h2>
            <p>
              Si vous avez des questions concernant ces conditions, veuillez nous contacter à contact@ridegenius.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
