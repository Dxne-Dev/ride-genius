
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mail, MessageSquare, HelpCircle } from 'lucide-react';

const Help = () => {
  const faqCategories = [
    {
      id: 'general',
      name: 'Général',
      items: [
        {
          question: "Qu'est-ce que RideGenius ?",
          answer: "RideGenius est une plateforme de covoiturage qui met en relation des conducteurs ayant des places disponibles dans leur véhicule avec des passagers allant dans la même direction. Notre objectif est de rendre les déplacements plus économiques, écologiques et conviviaux."
        },
        {
          question: "Comment fonctionne RideGenius ?",
          answer: "C'est simple ! Les conducteurs publient leurs trajets en indiquant leur point de départ, leur destination, la date et l'heure. Les passagers peuvent rechercher et réserver un trajet qui correspond à leurs besoins. Le paiement s'effectue en ligne, et les deux parties peuvent communiquer via notre messagerie intégrée."
        },
        {
          question: "RideGenius est-il disponible dans ma région ?",
          answer: "RideGenius est disponible dans toute la France métropolitaine et dans certains pays européens. Nous travaillons constamment à étendre notre couverture. Vérifiez la disponibilité en effectuant une recherche pour votre trajet."
        }
      ]
    },
    {
      id: 'account',
      name: 'Compte',
      items: [
        {
          question: "Comment créer un compte ?",
          answer: "Pour créer un compte, cliquez sur 'S'inscrire' en haut à droite de la page d'accueil. Vous pouvez vous inscrire avec votre e-mail ou via votre compte Google ou Facebook. Remplissez ensuite les informations requises et validez votre adresse e-mail."
        },
        {
          question: "Comment modifier mes informations personnelles ?",
          answer: "Connectez-vous à votre compte, cliquez sur votre profil en haut à droite, puis sur 'Paramètres du compte'. Vous pourrez modifier vos informations personnelles, votre photo de profil, vos préférences de voyage et vos informations de paiement."
        },
        {
          question: "J'ai oublié mon mot de passe, que faire ?",
          answer: "Sur la page de connexion, cliquez sur 'Mot de passe oublié'. Saisissez l'adresse e-mail associée à votre compte et suivez les instructions envoyées par e-mail pour réinitialiser votre mot de passe."
        }
      ]
    },
    {
      id: 'booking',
      name: 'Réservation',
      items: [
        {
          question: "Comment réserver un trajet ?",
          answer: "Utilisez la barre de recherche pour saisir votre point de départ, votre destination et la date souhaitée. Parcourez les résultats et cliquez sur 'Réserver' pour le trajet qui vous convient. Confirmez les détails et procédez au paiement pour finaliser votre réservation."
        },
        {
          question: "Puis-je annuler ma réservation ?",
          answer: "Oui, vous pouvez annuler votre réservation dans la section 'Mes trajets' de votre profil. Les conditions de remboursement dépendent du délai d'annulation avant le départ. Consultez notre politique d'annulation pour plus de détails."
        },
        {
          question: "Comment contacter le conducteur ?",
          answer: "Une fois votre réservation confirmée, vous pouvez contacter le conducteur via notre messagerie intégrée. Accédez à 'Mes trajets', sélectionnez le trajet concerné et cliquez sur 'Contacter le conducteur'."
        }
      ]
    },
    {
      id: 'payment',
      name: 'Paiement',
      items: [
        {
          question: "Quels moyens de paiement sont acceptés ?",
          answer: "Nous acceptons les cartes de crédit/débit (Visa, Mastercard, American Express), PayPal, et dans certains pays, des moyens de paiement locaux comme Apple Pay ou Google Pay."
        },
        {
          question: "Quand le conducteur reçoit-il son paiement ?",
          answer: "Le paiement est réservé au moment de la réservation mais n'est transféré au conducteur qu'après la réalisation du trajet. Cela garantit la sécurité de la transaction pour les deux parties."
        },
        {
          question: "Comment obtenir une facture ?",
          answer: "Vous pouvez générer et télécharger vos factures dans la section 'Historique de paiements' de votre profil. Les factures sont également envoyées automatiquement par e-mail après chaque transaction."
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Centre d'aide</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trouvez des réponses à vos questions et obtenez l'aide dont vous avez besoin pour profiter pleinement de RideGenius.
            </p>
            
            <div className="relative max-w-xl mx-auto mt-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Rechercher une question..." className="pl-10" />
            </div>
          </div>
          
          <Tabs defaultValue="faq">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat en direct
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-2">
                  <div className="font-medium text-lg mb-4">Catégories</div>
                  <ul className="space-y-1">
                    {faqCategories.map((category) => (
                      <li key={category.id}>
                        <a href={`#${category.id}`} className="text-muted-foreground hover:text-foreground block p-2 rounded-md hover:bg-accent transition-colors">
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="md:col-span-3">
                  {faqCategories.map((category) => (
                    <div key={category.id} id={category.id} className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.items.map((item, index) => (
                          <AccordionItem key={index} value={`item-${category.id}-${index}`} className="border border-border rounded-lg px-4">
                            <AccordionTrigger className="text-left">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-muted-foreground">{item.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact">
              <div className="max-w-2xl mx-auto bg-white border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Contactez-nous</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Nom</label>
                      <Input id="name" placeholder="Votre nom" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input id="email" type="email" placeholder="votre@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Sujet</label>
                    <Input id="subject" placeholder="Sujet de votre message" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <textarea 
                      id="message" 
                      rows={5} 
                      placeholder="Détaillez votre question ou problème..."
                      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full md:w-auto bg-carpu-gradient hover:opacity-90 transition-opacity">
                    Envoyer le message
                  </Button>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="chat">
              <div className="text-center py-12 px-4">
                <div className="max-w-md mx-auto">
                  <div className="mb-4">
                    <MessageSquare className="h-12 w-12 text-carpu-purple mx-auto" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Chat en direct avec notre équipe</h2>
                  <p className="text-muted-foreground mb-6">
                    Notre équipe de support est disponible du lundi au vendredi de 9h à 18h pour répondre à vos questions en temps réel.
                  </p>
                  <Button className="bg-carpu-gradient hover:opacity-90 transition-opacity">
                    Démarrer un chat
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
