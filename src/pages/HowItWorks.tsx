
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Car, MessageCircle, CreditCard, Star, MapPin, Shield, User } from 'lucide-react';

const HowItWorks = () => {
  return (
    <Layout>
      <div className="pt-28 pb-20">
        <div className="container px-4 mx-auto">
          {/* Header */}
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Comment fonctionne <span className="text-gradient">RideGenius</span> ?</h1>
            <p className="text-xl text-muted-foreground">
              RideGenius rend le covoiturage simple, sécurisé et économique. Voici comment notre plateforme transforme vos trajets.
            </p>
          </div>
          
          {/* For Passengers */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-block py-1.5 px-4 rounded-full bg-carpu-purple/10 text-carpu-purple text-sm font-medium mb-2">
                Pour les passagers
              </span>
              <h2 className="text-3xl font-bold">Trouvez facilement votre trajet idéal</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Search className="h-6 w-6" />,
                  title: "Recherchez",
                  description: "Indiquez votre point de départ, votre destination, la date et le nombre de passagers."
                },
                {
                  icon: <Car className="h-6 w-6" />,
                  title: "Choisissez",
                  description: "Parcourez les trajets disponibles et sélectionnez celui qui correspond le mieux à vos besoins."
                },
                {
                  icon: <CreditCard className="h-6 w-6" />,
                  title: "Réservez",
                  description: "Payez en ligne de manière sécurisée et recevez une confirmation instantanée."
                },
                {
                  icon: <Star className="h-6 w-6" />,
                  title: "Voyagez",
                  description: "Profitez de votre trajet et n'oubliez pas d'évaluer votre conducteur à la fin."
                }
              ].map((step, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-carpu-gradient rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild size="lg" className="bg-carpu-gradient hover:opacity-90 transition-opacity">
                <Link to="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher un trajet
                </Link>
              </Button>
            </div>
          </div>
          
          {/* For Drivers */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <span className="inline-block py-1.5 px-4 rounded-full bg-carpu-mint/10 text-carpu-mint text-sm font-medium mb-2">
                Pour les conducteurs
              </span>
              <h2 className="text-3xl font-bold">Proposez vos trajets et économisez</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <MapPin className="h-6 w-6" />,
                  title: "Publiez",
                  description: "Indiquez votre itinéraire, la date, l'heure, le nombre de places et le tarif."
                },
                {
                  icon: <MessageCircle className="h-6 w-6" />,
                  title: "Acceptez",
                  description: "Recevez des demandes de réservation et acceptez les passagers qui vous conviennent."
                },
                {
                  icon: <Car className="h-6 w-6" />,
                  title: "Voyagez",
                  description: "Partagez votre trajet et vos frais avec vos passagers."
                },
                {
                  icon: <CreditCard className="h-6 w-6" />,
                  title: "Recevez",
                  description: "L'argent est automatiquement transféré sur votre compte après le trajet."
                }
              ].map((step, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-carpu-gradient rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild size="lg" className="bg-carpu-gradient hover:opacity-90 transition-opacity">
                <Link to="/offer">
                  <Car className="mr-2 h-5 w-5" />
                  Proposer un trajet
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Features */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Les avantages de RideGenius</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-10 w-10" />,
                  title: "Sécurité maximale",
                  description: "Profils vérifiés, avis et évaluations, suivi des trajets en temps réel et partage de position."
                },
                {
                  icon: <CreditCard className="h-10 w-10" />,
                  title: "Économies garanties",
                  description: "Réduisez vos frais de transport jusqu'à 75% en partageant les coûts avec d'autres voyageurs."
                },
                {
                  icon: <User className="h-10 w-10" />,
                  title: "Communauté bienveillante",
                  description: "Rejoignez une communauté de plus de 500 000 utilisateurs partageant les mêmes valeurs."
                }
              ].map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-8">
                    <div className="mb-6 h-16 w-16 bg-carpu-gradient rounded-xl flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* FAQ */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Questions fréquentes</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  question: "Comment sont calculés les prix des trajets ?",
                  answer: "Les prix sont fixés par les conducteurs, mais nous recommandons un tarif équitable basé sur la distance, la consommation de carburant et les péages. Notre plateforme garantit des prix raisonnables."
                },
                {
                  question: "Comment fonctionne le paiement ?",
                  answer: "Le paiement s'effectue en ligne lors de la réservation. L'argent est sécurisé et transféré au conducteur 24h après la fin du trajet, une fois que le passager a confirmé que tout s'est bien passé."
                },
                {
                  question: "Que se passe-t-il en cas d'annulation ?",
                  answer: "Si vous annulez plus de 24h avant le départ, vous êtes intégralement remboursé. Entre 24h et 1h avant le départ, des frais peuvent s'appliquer. Si le conducteur annule, vous êtes toujours intégralement remboursé."
                },
                {
                  question: "Comment être sûr de la fiabilité des utilisateurs ?",
                  answer: "Tous les utilisateurs sont vérifiés via leur pièce d'identité, email et numéro de téléphone. Le système d'avis et de notation permet également d'identifier les utilisateurs fiables."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
