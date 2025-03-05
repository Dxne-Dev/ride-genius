
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { CarFront, Clock, MapPin, Calendar, Car } from 'lucide-react';

// Types pour les réservations
interface Reservation {
  id: string;
  date: string;
  departure: {
    city: string;
    time: string;
  };
  destination: {
    city: string; 
    time: string;
  };
  driver: {
    name: string;
    car: string;
  };
  price: number;
  status: 'confirmed' | 'pending' | 'completed';
}

const Rides = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Rediriger vers login si non connecté
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
  // Données fictives de réservations pour démonstration
  const mockReservations: Reservation[] = [
    {
      id: '1',
      date: '15 mars 2025',
      departure: {
        city: 'Paris',
        time: '08:00'
      },
      destination: {
        city: 'Lyon',
        time: '12:30'
      },
      driver: {
        name: 'Pierre Dupont',
        car: 'Peugeot 3008'
      },
      price: 35,
      status: 'confirmed'
    },
    {
      id: '2',
      date: '22 mars 2025',
      departure: {
        city: 'Lyon',
        time: '16:00'
      },
      destination: {
        city: 'Paris',
        time: '20:30'
      },
      driver: {
        name: 'Marie Lambert',
        car: 'Renault Clio'
      },
      price: 32,
      status: 'pending'
    }
  ];
  
  // Texte et couleur pour les statuts
  const statusText = {
    confirmed: 'Confirmé',
    pending: 'En attente',
    completed: 'Terminé'
  };
  
  const statusColor = {
    confirmed: 'text-green-600 bg-green-100',
    pending: 'text-amber-600 bg-amber-100',
    completed: 'text-blue-600 bg-blue-100'
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[80vh]">
          <p>Chargement...</p>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return null; // Sera redirigé dans useEffect
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Mes réservations</h1>
          <p className="text-muted-foreground mb-8">
            Consultez vos trajets réservés et leur statut
          </p>
          
          {mockReservations.length > 0 ? (
            <div className="space-y-6">
              {mockReservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="font-medium">{reservation.date}</span>
                          <span className={`ml-4 text-xs px-2 py-1 rounded-full ${statusColor[reservation.status]}`}>
                            {statusText[reservation.status]}
                          </span>
                        </div>
                        
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold">{reservation.departure.time}</div>
                            <div className="h-10 w-px bg-border mx-auto my-1"></div>
                            <div className="text-lg font-semibold">{reservation.destination.time}</div>
                          </div>
                          
                          <div>
                            <div className="mb-4">
                              <div className="font-semibold">{reservation.departure.city}</div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                Point de rendez-vous
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-semibold">{reservation.destination.city}</div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                Point d'arrivée
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t md:border-t-0 md:border-l border-border md:pl-6 pt-4 md:pt-0 mt-4 md:mt-0">
                        <div className="flex flex-col items-start md:items-end space-y-2">
                          <div className="text-xl font-bold text-carpu-purple">{reservation.price}€</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Car className="mr-1 h-3 w-3" />
                            <span>{reservation.driver.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {reservation.driver.car}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Aucune réservation</CardTitle>
                <CardDescription>
                  Vous n'avez pas encore effectué de réservation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Utilisez la page de recherche pour trouver des trajets et effectuer une réservation.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Rides;
