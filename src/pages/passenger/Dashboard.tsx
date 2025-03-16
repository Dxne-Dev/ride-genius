
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowRight, CalendarIcon, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Booking } from '@/types/models';

const PassengerDashboard = () => {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (!user) return;
    
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            ride:ride_id (
              *,
              driver:driver_id (
                *
              )
            )
          `)
          .eq('passenger_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Ensure correct typing
        const typedBookings = data.map(booking => ({
          ...booking,
          status: booking.status as 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed',
          ride: booking.ride ? {
            ...booking.ride,
            status: booking.ride.status as 'active' | 'completed' | 'cancelled'
          } : undefined
        })) as Booking[];
        
        setBookings(typedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Erreur lors du chargement des réservations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
      
      toast.success('Réservation annulée');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
    }
  };
  
  const getFilteredBookings = () => {
    if (activeTab === 'upcoming') {
      return bookings.filter(booking => 
        booking.status !== 'cancelled' && 
        booking.status !== 'rejected' && 
        booking.ride && 
        new Date(booking.ride.departure_time) > new Date()
      );
    } else if (activeTab === 'past') {
      return bookings.filter(booking => 
        booking.ride && 
        (new Date(booking.ride.departure_time) < new Date() || 
         booking.status === 'cancelled' || 
         booking.status === 'rejected')
      );
    }
    return bookings;
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Acceptée</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Refusée</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Annulée</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Terminée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes trajets</h1>
        <Link to="/search">
          <Button>Rechercher un trajet</Button>
        </Link>
      </div>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Trajets à venir</TabsTrigger>
          <TabsTrigger value="past">Trajets passés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : getFilteredBookings().length > 0 ? (
            getFilteredBookings().map(booking => (
              <Card key={booking.id} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {booking.ride?.departure} <ArrowRight className="inline mx-2" /> {booking.ride?.destination}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-2">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {booking.ride && format(new Date(booking.ride.departure_time), 'PPPp', { locale: fr })}
                        </div>
                      </CardDescription>
                    </div>
                    <div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>Conducteur: {booking.ride?.driver?.first_name} {booking.ride?.driver?.last_name}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Prix: {booking.ride?.price} € • {booking.seats} place(s)
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {booking.status === 'pending' || booking.status === 'accepted' ? (
                    <Button 
                      variant="outline" 
                      className="text-red-500 border-red-500 hover:bg-red-50"
                      onClick={() => cancelBooking(booking.id)}
                    >
                      Annuler ma réservation
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="mb-4">Vous n'avez pas de trajet à venir</p>
              <Link to="/search">
                <Button>Rechercher un trajet</Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : getFilteredBookings().length > 0 ? (
            getFilteredBookings().map(booking => (
              <Card key={booking.id} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {booking.ride?.departure} <ArrowRight className="inline mx-2" /> {booking.ride?.destination}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-2">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {booking.ride && format(new Date(booking.ride.departure_time), 'PPPp', { locale: fr })}
                        </div>
                      </CardDescription>
                    </div>
                    <div>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>Conducteur: {booking.ride?.driver?.first_name} {booking.ride?.driver?.last_name}</span>
                  </div>
                </CardContent>
                {booking.status === 'completed' && (
                  <CardFooter>
                    <Link to={`/reviews/add/${booking.id}`}>
                      <Button variant="outline">Laisser un avis</Button>
                    </Link>
                  </CardFooter>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p>Vous n'avez pas encore de trajets passés</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PassengerDashboard;
