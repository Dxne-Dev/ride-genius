
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types';
import { Car, Search } from 'lucide-react';
import { toast } from 'sonner';
import BookingCard from '@/components/bookings/BookingCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PassengerBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            ride:rides(*)
          `)
          .eq('passenger_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;

        // Cast the data to ensure type safety
        const typedBookings = data.map(booking => ({
          ...booking,
          status: booking.status as "pending" | "accepted" | "rejected" | "cancelled" | "completed",
          ride: booking.ride ? {
            ...booking.ride,
            status: booking.ride.status as "active" | "completed" | "cancelled"
          } : undefined
        }));
        
        setBookings(typedBookings as Booking[]);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Erreur lors du chargement des réservations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);
  
  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => 
      (booking.status === 'pending' || booking.status === 'accepted') && 
      booking.ride && 
      new Date(booking.ride.departure_time) > now
    );
  };
  
  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => 
      booking.status === 'completed' || 
      (booking.status === 'accepted' && booking.ride && new Date(booking.ride.departure_time) < now)
    );
  };
  
  const getCancelledBookings = () => {
    return bookings.filter(booking => 
      booking.status === 'cancelled' || booking.status === 'rejected'
    );
  };
  
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const } 
          : booking
      ));
      
      toast.success('Réservation annulée');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Erreur lors de l\'annulation de la réservation');
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Mes réservations</h1>
            <Button
              onClick={() => navigate('/search')}
              className="bg-carpu-gradient hover:opacity-90"
            >
              <Search className="mr-2 h-4 w-4" />
              Rechercher un trajet
            </Button>
          </div>
          
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="upcoming">À venir</TabsTrigger>
                <TabsTrigger value="past">Passées</TabsTrigger>
                <TabsTrigger value="cancelled">Annulées</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>Réservations à venir</CardTitle>
                  <CardDescription>
                    Vos prochains trajets réservés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-center py-8">Chargement...</p>
                  ) : getUpcomingBookings().length > 0 ? (
                    <div className="space-y-4">
                      {getUpcomingBookings().map(booking => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          actions={
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Annuler
                            </Button>
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Vous n'avez pas de réservations à venir
                      </p>
                      <Button
                        onClick={() => navigate('/search')}
                        className="bg-carpu-gradient hover:opacity-90"
                      >
                        <Car className="mr-2 h-4 w-4" />
                        Trouver un trajet
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="past">
              <Card>
                <CardHeader>
                  <CardTitle>Réservations passées</CardTitle>
                  <CardDescription>
                    Historique de vos trajets effectués
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-center py-8">Chargement...</p>
                  ) : getPastBookings().length > 0 ? (
                    <div className="space-y-4">
                      {getPastBookings().map(booking => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      Vous n'avez pas encore effectué de trajets
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cancelled">
              <Card>
                <CardHeader>
                  <CardTitle>Réservations annulées</CardTitle>
                  <CardDescription>
                    Réservations que vous avez annulées ou qui ont été refusées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-center py-8">Chargement...</p>
                  ) : getCancelledBookings().length > 0 ? (
                    <div className="space-y-4">
                      {getCancelledBookings().map(booking => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      Vous n'avez pas de réservations annulées
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default PassengerBookings;
