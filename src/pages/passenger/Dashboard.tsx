
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CarFront, Clock, Calendar, User, Star, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';

// Types pour les réservations
interface Booking {
  id: string;
  ride_id: string;
  passenger_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  seats: number;
  created_at: string;
  ride: {
    id: string;
    departure: string;
    destination: string;
    departure_time: string;
    price: number;
    driver_id: string;
    driver: {
      first_name: string;
      last_name: string;
      phone: string;
    };
  };
}

const PassengerDashboard = () => {
  const { user, profile, isLoading, isPassenger } = useAuth();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetchingBookings, setFetchingBookings] = useState(true);
  
  // Rediriger si ce n'est pas un passager
  useEffect(() => {
    if (!isLoading && user) {
      if (!isPassenger()) {
        // Si l'utilisateur est conducteur ou admin, rediriger vers le tableau de bord approprié
        if (profile?.role === 'conducteur') {
          navigate('/driver/dashboard');
        } else if (profile?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          toast.error("Une erreur s'est produite avec votre profil.");
          navigate('/');
        }
      }
    } else if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, profile, isPassenger, navigate]);
  
  // Charger les réservations du passager
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            ride:ride_id (
              id,
              departure,
              destination,
              departure_time,
              price,
              driver_id,
              driver:driver_id (
                first_name,
                last_name,
                phone
              )
            )
          `)
          .eq('passenger_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setBookings(data as Booking[] || []);
      } catch (error: any) {
        console.error('Erreur lors du chargement des réservations:', error);
        toast.error('Erreur lors du chargement des réservations');
      } finally {
        setFetchingBookings(false);
      }
    };
    
    if (user && isPassenger()) {
      fetchBookings();
    }
  }, [user, isPassenger]);
  
  // Annuler une réservation
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('passenger_id', user?.id);
        
      if (error) throw error;
      
      // Mettre à jour l'état local
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
      
      toast.success('Réservation annulée avec succès');
    } catch (error: any) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
      toast.error('Erreur lors de l\'annulation de la réservation');
    }
  };
  
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Formater l'heure pour l'affichage
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
  
  if (!user || !isPassenger()) {
    return null; // Will redirect in useEffect
  }
  
  // Filtrer les réservations par statut
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const acceptedBookings = bookings.filter(b => b.status === 'accepted');
  const otherBookings = bookings.filter(b => !['pending', 'accepted'].includes(b.status));
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord passager</h1>
          <p className="text-muted-foreground mb-8">
            Gérez vos réservations et vos trajets
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Réservations en attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingBookings.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Réservations confirmées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{acceptedBookings.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total des réservations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{bookings.length}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end mb-6">
            <Button asChild className="bg-carpu-gradient hover:opacity-90">
              <a href="/search">
                <CarFront className="mr-2 h-4 w-4" />
                Rechercher un trajet
              </a>
            </Button>
          </div>
          
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Trajets à venir</TabsTrigger>
              <TabsTrigger value="past">Historique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {fetchingBookings ? (
                <p>Chargement des réservations...</p>
              ) : [...pendingBookings, ...acceptedBookings].length > 0 ? (
                <div className="space-y-4">
                  {[...pendingBookings, ...acceptedBookings].map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center mb-2">
                              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                              <span>{formatDate(booking.ride.departure_time)}</span>
                              <Clock className="h-5 w-5 ml-4 mr-2 text-muted-foreground" />
                              <span>{formatTime(booking.ride.departure_time)}</span>
                              <span className="ml-4 px-2 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }">
                                {booking.status === 'pending' ? 'En attente' :
                                booking.status === 'accepted' ? 'Confirmé' :
                                booking.status === 'rejected' ? 'Refusé' :
                                booking.status === 'cancelled' ? 'Annulé' : booking.status}
                              </span>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2">
                              {booking.ride.departure} → {booking.ride.destination}
                            </h3>
                            
                            <div className="flex items-center text-sm mb-2">
                              <User className="h-4 w-4 mr-2" />
                              <span className="font-medium">
                                {booking.ride.driver.first_name} {booking.ride.driver.last_name}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{booking.ride.driver.phone}</span>
                            </div>
                            
                            <div className="text-sm">
                              <span className="font-medium">{booking.seats}</span> place(s) réservée(s) - Total: <span className="font-medium">{booking.seats * booking.ride.price}€</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-between">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={`/rides/${booking.ride_id}`}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Détails
                                </a>
                              </Button>
                              
                              {booking.status === 'pending' || booking.status === 'accepted' ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Annuler
                                </Button>
                              ) : null}
                            </div>
                            
                            {booking.status === 'accepted' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                              >
                                Contact conducteur
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Aucun trajet à venir</CardTitle>
                    <CardDescription>
                      Vous n'avez pas de réservations en cours ou confirmées.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Utilisez la recherche pour trouver et réserver des trajets.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="bg-carpu-gradient hover:opacity-90">
                      <a href="/search">
                        Rechercher un trajet
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {fetchingBookings ? (
                <p>Chargement de l'historique...</p>
              ) : otherBookings.length > 0 ? (
                <div className="space-y-4">
                  {otherBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center mb-2">
                              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                              <span>{formatDate(booking.ride.departure_time)}</span>
                              <span className="ml-4 px-2 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                'bg-blue-100 text-blue-800'
                              }">
                                {booking.status === 'rejected' ? 'Refusé' :
                                booking.status === 'cancelled' ? 'Annulé' : 
                                booking.status === 'completed' ? 'Terminé' : booking.status}
                              </span>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2">
                              {booking.ride.departure} → {booking.ride.destination}
                            </h3>
                            
                            <div className="flex items-center text-sm mb-2">
                              <User className="h-4 w-4 mr-2" />
                              <span>
                                {booking.ride.driver.first_name} {booking.ride.driver.last_name}
                              </span>
                            </div>
                            
                            <div className="text-sm">
                              <span>{booking.seats}</span> place(s) - <span>{booking.seats * booking.ride.price}€</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={`/rides/${booking.ride_id}`}>
                                Détails
                              </a>
                            </Button>
                            
                            {booking.status === 'completed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                asChild
                              >
                                <a href={`/reviews/add/${booking.id}`}>
                                  <Star className="mr-2 h-4 w-4" />
                                  Laisser un avis
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Aucun trajet passé</CardTitle>
                    <CardDescription>
                      Vous n'avez pas encore d'historique de trajets.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default PassengerDashboard;
