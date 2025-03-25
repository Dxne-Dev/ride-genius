
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Star, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Booking {
  id: string;
  ride_id: string;
  passenger_id: string;
  seats: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  ride: Ride;
  driver: UserProfile;
}

interface Ride {
  id: string;
  driver_id: string;
  departure: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  price: number;
  status: string;
  description?: string;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
}

const PassengerDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          ride:rides(*),
          driver:rides(driver_id(id, first_name, last_name, phone))
        `)
        .eq('passenger_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      console.log('Bookings data:', data);
      setBookings(data as any);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement de vos réservations');
      toast.error('Erreur de chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('passenger_id', user?.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Réservation annulée avec succès');
      fetchBookings(); // Refresh bookings
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      toast.error(err.message || 'Une erreur est survenue lors de l\'annulation de la réservation');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: fr });
    } catch (e) {
      return '';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Annulé</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Terminé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Tableau de bord passager</h1>
          <p className="text-muted-foreground">
            Consultez et gérez vos réservations de trajets
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="past">Passés</TabsTrigger>
            <TabsTrigger value="all">Tous</TabsTrigger>
          </TabsList>
          
          {loading ? (
            <Card>
              <CardContent className="py-10 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-muted-foreground">Chargement de vos réservations...</p>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-10">
                <div className="flex flex-col items-center gap-2 text-red-600">
                  <AlertCircle className="h-8 w-8" />
                  <p>{error}</p>
                  <Button 
                    onClick={fetchBookings} 
                    variant="outline" 
                    className="mt-2"
                  >
                    Réessayer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-muted-foreground">Vous n'avez pas encore de réservations</p>
                  <Button 
                    onClick={() => navigate('/search')}
                    className="mt-4 bg-carpu-gradient"
                  >
                    Rechercher un trajet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <TabsContent value="upcoming" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Réservations à venir</CardTitle>
                    <CardDescription>
                      Vos trajets réservés qui n'ont pas encore eu lieu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Trajet</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Places</TableHead>
                          <TableHead>Prix</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings
                          .filter(booking => 
                            booking.status !== 'cancelled' && 
                            booking.status !== 'completed' && 
                            new Date(booking.ride.departure_time) > new Date()
                          )
                          .map(booking => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <div className="font-medium">{booking.ride.departure} → {booking.ride.destination}</div>
                                <div className="text-sm text-muted-foreground">
                                  Conducteur: {booking.driver?.first_name} {booking.driver?.last_name}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {formatDate(booking.ride.departure_time)}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="mr-2 h-3 w-3" />
                                  {formatTime(booking.ride.departure_time)}
                                </div>
                              </TableCell>
                              <TableCell>{booking.seats}</TableCell>
                              <TableCell>{(booking.ride.price * booking.seats).toFixed(2)} €</TableCell>
                              <TableCell>{getStatusBadge(booking.status)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => navigate(`/ride/${booking.ride_id}`)}
                                >
                                  Détails
                                </Button>
                                {booking.status === 'pending' || booking.status === 'confirmed' ? (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => cancelBooking(booking.id)}
                                  >
                                    Annuler
                                  </Button>
                                ) : null}
                              </TableCell>
                            </TableRow>
                          ))}
                        {bookings.filter(booking => 
                          booking.status !== 'cancelled' && 
                          booking.status !== 'completed' && 
                          new Date(booking.ride.departure_time) > new Date()
                        ).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6">
                              <p className="text-muted-foreground">Vous n'avez pas de réservations à venir</p>
                              <Button 
                                onClick={() => navigate('/search')}
                                variant="outline"
                                className="mt-2"
                              >
                                Rechercher un trajet
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="past" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Réservations passées</CardTitle>
                    <CardDescription>
                      Vos trajets réservés qui ont déjà eu lieu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Trajet</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Places</TableHead>
                          <TableHead>Prix</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings
                          .filter(booking => 
                            booking.status === 'completed' || 
                            (booking.status !== 'cancelled' && new Date(booking.ride.departure_time) <= new Date())
                          )
                          .map(booking => (
                            <TableRow key={booking.id}>
                              <TableCell>
                                <div className="font-medium">{booking.ride.departure} → {booking.ride.destination}</div>
                                <div className="text-sm text-muted-foreground">
                                  Conducteur: {booking.driver?.first_name} {booking.driver?.last_name}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {formatDate(booking.ride.departure_time)}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="mr-2 h-3 w-3" />
                                  {formatTime(booking.ride.departure_time)}
                                </div>
                              </TableCell>
                              <TableCell>{booking.seats}</TableCell>
                              <TableCell>{(booking.ride.price * booking.seats).toFixed(2)} €</TableCell>
                              <TableCell>{getStatusBadge(booking.status)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/ride/${booking.ride_id}`)}
                                >
                                  Détails
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        {bookings.filter(booking => 
                          booking.status === 'completed' || 
                          (booking.status !== 'cancelled' && new Date(booking.ride.departure_time) <= new Date())
                        ).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6">
                              <p className="text-muted-foreground">Vous n'avez pas de réservations passées</p>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Toutes les réservations</CardTitle>
                    <CardDescription>
                      Historique complet de vos réservations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Trajet</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Places</TableHead>
                          <TableHead>Prix</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map(booking => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <div className="font-medium">{booking.ride.departure} → {booking.ride.destination}</div>
                              <div className="text-sm text-muted-foreground">
                                Conducteur: {booking.driver?.first_name} {booking.driver?.last_name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                {formatDate(booking.ride.departure_time)}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-2 h-3 w-3" />
                                {formatTime(booking.ride.departure_time)}
                              </div>
                            </TableCell>
                            <TableCell>{booking.seats}</TableCell>
                            <TableCell>{(booking.ride.price * booking.seats).toFixed(2)} €</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => navigate(`/ride/${booking.ride_id}`)}
                              >
                                Détails
                              </Button>
                              {(booking.status === 'pending' || booking.status === 'confirmed') && 
                               new Date(booking.ride.departure_time) > new Date() && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => cancelBooking(booking.id)}
                                >
                                  Annuler
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default PassengerDashboard;
