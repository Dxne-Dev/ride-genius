
import React from 'react';
import Layout from '@/components/Layout';

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="lead mb-6">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Collecte des informations</h2>
            <p>
              Nous collectons des informations lorsque vous vous inscrivez sur notre site, lorsque vous vous connectez, 
              créez ou modifiez votre profil, participez à des sondages, et/ou lorsque vous utilisez certaines fonctionnalités du site.
              Les informations collectées incluent votre nom, adresse e-mail, numéro de téléphone, photo de profil, 
              informations de paiement et préférences de voyage.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Utilisation des informations</h2>
            <p>
              Nous utilisons les informations que nous collectons pour :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Fournir, exploiter et maintenir notre service</li>
              <li>Améliorer, personnaliser et développer notre service</li>
              <li>Comprendre et analyser comment vous utilisez notre service</li>
              <li>Développer de nouveaux produits, services et fonctionnalités</li>
              <li>Communiquer avec vous, soit directement, soit par l'intermédiaire de l'un de nos partenaires</li>
              <li>Traiter vos transactions</li>
              <li>Prévenir et traiter les fraudes, les utilisations non autorisées, les violations de nos conditions</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Protection des informations</h2>
            <p>
              Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. 
              Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Cookies</h2>
            <p>
              Nous utilisons des cookies pour améliorer l'expérience des utilisateurs et analyser les tendances du site. 
              Pour plus d'informations sur notre utilisation des cookies, veuillez consulter notre politique en matière de cookies.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Divulgation à des tiers</h2>
            <p>
              Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles identifiables à des tiers. 
              Cela n'inclut pas les tiers de confiance qui nous aident à exploiter notre site web ou à mener nos activités, 
              tant que ces parties conviennent de garder ces informations confidentielles.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. Vos droits</h2>
            <p>
              Vous avez le droit d'accéder à vos données personnelles, de les rectifier, de les supprimer ou d'en limiter le traitement. 
              Vous pouvez également vous opposer au traitement de vos données personnelles et vous avez le droit à la portabilité des données.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Modifications de notre politique de confidentialité</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les changements et clarifications 
              prendront effet immédiatement après leur publication sur le site web.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact</h2>
            <p>
              Si vous avez des questions concernant cette politique de confidentialité, vous pouvez nous contacter à privacy@ridegenius.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
