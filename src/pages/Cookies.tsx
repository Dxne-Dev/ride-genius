
import React from 'react';
import Layout from '@/components/Layout';

const Cookies = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Politique de cookies</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="lead mb-6">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. 
              Les cookies sont largement utilisés pour faire fonctionner les sites web ou les faire fonctionner plus efficacement, 
              ainsi que pour fournir des informations aux propriétaires du site.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Comment utilisons-nous les cookies ?</h2>
            <p>
              Nous utilisons des cookies pour plusieurs raisons détaillées ci-dessous. Malheureusement, dans la plupart des cas, 
              il n'existe pas d'options standard de l'industrie pour désactiver les cookies sans désactiver complètement les 
              fonctionnalités et caractéristiques qu'ils ajoutent à ce site. Il est recommandé de laisser tous les cookies si 
              vous n'êtes pas sûr d'en avoir besoin ou non dans le cas où ils seraient utilisés pour fournir un service que vous utilisez.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Types de cookies que nous utilisons</h2>
            <ul className="list-disc pl-6 my-4">
              <li>
                <strong>Cookies essentiels</strong> - Ces cookies sont nécessaires au fonctionnement du site web et ne peuvent 
                pas être désactivés dans nos systèmes. Ils sont généralement établis en réponse à des actions que vous effectuez 
                et qui constituent une demande de services, telles que la définition de vos préférences de confidentialité, 
                la connexion ou le remplissage de formulaires.
              </li>
              <li>
                <strong>Cookies de performance</strong> - Ces cookies nous permettent de compter les visites et les sources de 
                trafic afin que nous puissions mesurer et améliorer les performances de notre site. Ils nous aident à savoir 
                quelles pages sont les plus et les moins populaires et à voir comment les visiteurs se déplacent sur le site.
              </li>
              <li>
                <strong>Cookies de fonctionnalité</strong> - Ces cookies permettent au site web de fournir une fonctionnalité 
                et une personnalisation améliorées. Ils peuvent être établis par nous ou par des fournisseurs tiers dont nous 
                avons ajouté les services à nos pages.
              </li>
              <li>
                <strong>Cookies de ciblage</strong> - Ces cookies peuvent être établis par nos partenaires publicitaires via 
                notre site. Ils peuvent être utilisés par ces entreprises pour établir un profil de vos intérêts et vous 
                montrer des publicités pertinentes sur d'autres sites.
              </li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Comment gérer les cookies</h2>
            <p>
              Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour indiquer quand un cookie est envoyé. 
              Cependant, si vous n'acceptez pas les cookies, certaines fonctionnalités de notre site peuvent ne pas fonctionner correctement.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. Plus d'informations</h2>
            <p>
              Nous espérons que cela a clarifié les choses pour vous. Comme mentionné précédemment, si vous n'êtes pas sûr de 
              vouloir ou non des cookies, il est généralement plus sûr de laisser les cookies activés au cas où ils interagiraient 
              avec l'une des fonctionnalités que vous utilisez sur notre site. Cependant, si vous recherchez toujours plus 
              d'informations, vous pouvez nous contacter à cookies@ridegenius.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cookies;
