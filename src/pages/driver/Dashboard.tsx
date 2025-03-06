
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CarFront, Clock, Calendar, User, Star, Plus, Check, X } from 'lucide-react';
import { toast } from 'sonner';

// Types pour les réservations
interface Booking {
  id: string;
  ride_id: string;
  passenger_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  seats: number;
  created_at: string;
  passenger: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

// Types pour les trajets
interface Ride {
  id: string;
  departure: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  price: number;
  description: string;
  status: string;
  created_at: string;
  bookings: Booking[];
}

const DriverDashboard = () => {
  const { user, profile, isLoading, isDriver } = useAuth();
  const navigate = useNavigate();
  
  const [rides, setRides] = useState<Ride[]>([]);
  const [fetchingRides, setFetchingRides] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetchingBookings, setFetchingBookings] = useState(true);
  
  // Rediriger si ce n'est pas un conducteur
  useEffect(() => {
    if (!isLoading && user) {
      if (!isDriver()) {
        toast.error("Accès non autorisé. Vous devez être un conducteur pour accéder à cette page.");
        navigate('/');
      }
    } else if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, isDriver, navigate]);
  
  // Charger les trajets du conducteur
  useEffect(() => {
    const fetchRides = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('rides')
          .select('*')
          .eq('driver_id', user.id)
          .order('departure_time', { ascending: true });
          
        if (error) throw error;
        
        setRides(data || []);
      } catch (error: any) {
        console.error('Erreur lors du chargement des trajets:', error);
        toast.error('Erreur lors du chargement des trajets');
      } finally {
        setFetchingRides(false);
      }
    };
    
    if (user && isDriver()) {
      fetchRides();
    }
  }, [user, isDriver]);
  
  // Charger les réservations pour les trajets du conducteur
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || rides.length === 0) return;
      
      try {
        const rideIds = rides.map(ride => ride.id);
        
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            passenger:passenger_id (
              first_name,
              last_name,
              phone
            )
          `)
          .in('ride_id', rideIds)
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
    
    if (user && isDriver() && rides.length > 0) {
      fetchBookings();
    } else {
      setFetchingBookings(false);
    }
  }, [user, isDriver, rides]);
  
  const handleUpdateBookingStatus = async (bookingId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Mettre à jour l'état local
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );
      
      toast.success(`Réservation ${status === 'accepted' ? 'acceptée' : 'rejetée'} avec succès`);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
      toast.error('Erreur lors de la mise à jour de la réservation');
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
  
  if (!user || !isDriver()) {
    return null; // Will redirect in useEffect
  }
  
  // Filtrer les réservations en attente
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord conducteur</h1>
          <p className="text-muted-foreground mb-8">
            Gérez vos trajets et vos réservations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Trajets proposés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{rides.length}</div>
              </CardContent>
            </Card>
            
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
                <CardTitle className="text-lg font-medium">Réservations acceptées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {bookings.filter(b => b.status === 'accepted').length}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end mb-6">
            <Button asChild className="bg-carpu-gradient hover:opacity-90">
              <a href="/driver/offer">
                <Plus className="mr-2 h-4 w-4" />
                Proposer un nouveau trajet
              </a>
            </Button>
          </div>
          
          <Tabs defaultValue="rides">
            <TabsList className="mb-6">
              <TabsTrigger value="rides">Mes trajets</TabsTrigger>
              <TabsTrigger value="bookings">Demandes de réservation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rides">
              {fetchingRides ? (
                <p>Chargement des trajets...</p>
              ) : rides.length > 0 ? (
                <div className="space-y-4">
                  {rides.map((ride) => (
                    <Card key={ride.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center mb-2">
                              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                              <span>{formatDate(ride.departure_time)}</span>
                              <Clock className="h-5 w-5 ml-4 mr-2 text-muted-foreground" />
                              <span>{formatTime(ride.departure_time)}</span>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2">
                              {ride.departure} → {ride.destination}
                            </h3>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {ride.available_seats} place(s)
                              </div>
                              <div>Prix: {ride.price}€ par passager</div>
                            </div>
                            
                            {ride.description && (
                              <p className="text-sm mt-2">{ride.description}</p>
                            )}
                          </div>
                          
                          <div className="flex flex-col justify-between">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={`/driver/rides/${ride.id}`}>
                                  Détails
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={`/driver/rides/${ride.id}/edit`}>
                                  Modifier
                                </a>
                              </Button>
                            </div>
                            
                            <div className="text-sm text-muted-foreground text-right mt-4">
                              {bookings.filter(b => b.ride_id === ride.id && b.status === 'accepted').length} réservation(s) confirmée(s)
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
                    <CardTitle>Aucun trajet proposé</CardTitle>
                    <CardDescription>
                      Vous n'avez pas encore proposé de trajet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Cliquez sur "Proposer un nouveau trajet" pour commencer à proposer des trajets aux passagers.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="bg-carpu-gradient hover:opacity-90">
                      <a href="/driver/offer">
                        <Plus className="mr-2 h-4 w-4" />
                        Proposer un trajet
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="bookings">
              {fetchingBookings ? (
                <p>Chargement des réservations...</p>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const ride = rides.find(r => r.id === booking.ride_id);
                    if (!ride) return null;
                    
                    return (
                      <Card key={booking.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <div className="flex items-center mb-2">
                                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                                <span>{formatDate(ride.departure_time)}</span>
                                <span className="mx-2">•</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                  booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.status === 'pending' ? 'En attente' :
                                   booking.status === 'accepted' ? 'Acceptée' :
                                   booking.status === 'rejected' ? 'Rejetée' :
                                   booking.status === 'cancelled' ? 'Annulée' : booking.status}
                                </span>
                              </div>
                              
                              <h3 className="text-xl font-bold mb-2">
                                {ride.departure} → {ride.destination}
                              </h3>
                              
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 mr-2" />
                                <span className="font-medium">
                                  {booking.passenger.first_name} {booking.passenger.last_name}
                                </span>
                                <span className="mx-2">•</span>
                                <span>{booking.passenger.phone}</span>
                              </div>
                              
                              <div className="mt-2 text-sm">
                                <span className="font-medium">{booking.seats}</span> place(s) réservée(s)
                              </div>
                            </div>
                            
                            <div className="flex flex-col justify-between">
                              {booking.status === 'pending' ? (
                                <div className="flex space-x-2">
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleUpdateBookingStatus(booking.id, 'accepted')}
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Accepter
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                    onClick={() => handleUpdateBookingStatus(booking.id, 'rejected')}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Refuser
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">
                                  {booking.status === 'accepted' ? 'Réservation acceptée' :
                                   booking.status === 'rejected' ? 'Réservation refusée' :
                                   booking.status === 'cancelled' ? 'Réservation annulée par le passager' : 
                                   booking.status}
                                </div>
                              )}
                              
                              <div className="text-sm text-muted-foreground text-right mt-4">
                                Demande effectuée le {formatDate(booking.created_at)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Aucune réservation</CardTitle>
                    <CardDescription>
                      Vous n'avez pas encore reçu de demandes de réservation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Une fois que vous aurez proposé des trajets, les passagers pourront faire des demandes de réservation.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DriverDashboard;
