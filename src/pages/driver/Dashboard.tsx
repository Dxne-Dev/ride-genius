
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowRight, CalendarIcon, Check, MapPin, UserPlus, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Ride, Booking } from '@/types/models';

const DriverDashboard = () => {
  const { user, profile } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (!user) return;
    
    const fetchRides = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('rides')
          .select('*')
          .eq('driver_id', user.id)
          .order('departure_time', { ascending: true });
          
        if (error) throw error;
        
        // Convert string prices to numbers if needed
        const formattedRides = data.map(ride => ({
          ...ride,
          price: typeof ride.price === 'string' ? parseFloat(ride.price) : ride.price
        }));
        
        setRides(formattedRides);
        
        // Fetch bookings for all rides
        const rideIds = formattedRides.map(ride => ride.id);
        if (rideIds.length > 0) {
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select('*, profiles:passenger_id(*)')
            .in('ride_id', rideIds);
            
          if (bookingsError) throw bookingsError;
          setBookings(bookingsData);
        }
      } catch (error) {
        console.error('Error fetching rides:', error);
        toast.error('Erreur lors du chargement des trajets');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRides();
  }, [user]);

  const updateBookingStatus = async (bookingId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );
      
      toast.success(`Réservation ${status === 'accepted' ? 'acceptée' : 'refusée'}`);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error("Erreur lors de la mise à jour de la réservation");
    }
  };

  const getBookingsForRide = (rideId: string) => {
    return bookings.filter(booking => booking.ride_id === rideId);
  };
  
  const getFilteredRides = () => {
    if (activeTab === 'active') {
      return rides.filter(ride => ride.status === 'active' && new Date(ride.departure_time) > new Date());
    } else if (activeTab === 'past') {
      return rides.filter(ride => ride.status === 'completed' || new Date(ride.departure_time) < new Date());
    }
    return rides;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord conducteur</h1>
        <Link to="/driver/offer">
          <Button>Proposer un trajet</Button>
        </Link>
      </div>
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">Trajets actifs</TabsTrigger>
          <TabsTrigger value="past">Trajets passés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : getFilteredRides().length > 0 ? (
            getFilteredRides().map(ride => (
              <Card key={ride.id} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {ride.departure} <ArrowRight className="inline mx-2" /> {ride.destination}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-2">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {format(new Date(ride.departure_time), 'PPPp', { locale: fr })}
                        </div>
                        <div className="flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-2" />
                          Départ: {ride.departure}
                        </div>
                      </CardDescription>
                    </div>
                    <div>
                      <Badge>{ride.price} €</Badge>
                      <Badge className="ml-2">{ride.available_seats} places</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h3 className="font-medium mb-2">Réservations</h3>
                    {getBookingsForRide(ride.id).length > 0 ? (
                      <div className="space-y-3">
                        {getBookingsForRide(ride.id).map(booking => (
                          <div key={booking.id} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{booking.passenger?.first_name} {booking.passenger?.last_name}</p>
                              <p className="text-sm text-gray-500">{booking.seats} place(s)</p>
                            </div>
                            <div className="flex items-center">
                              {booking.status === 'pending' ? (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="mr-2"
                                    onClick={() => updateBookingStatus(booking.id, 'accepted')}
                                  >
                                    <Check className="w-4 h-4 mr-1" /> Accepter
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => updateBookingStatus(booking.id, 'rejected')}
                                  >
                                    <X className="w-4 h-4 mr-1" /> Refuser
                                  </Button>
                                </>
                              ) : (
                                <Badge className={
                                  booking.status === 'accepted' ? 'bg-green-500' : 
                                  booking.status === 'rejected' ? 'bg-red-500' : 
                                  'bg-gray-500'
                                }>
                                  {booking.status === 'accepted' ? 'Acceptée' : 
                                   booking.status === 'rejected' ? 'Refusée' : 
                                   booking.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Aucune réservation pour le moment
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">
                    {getBookingsForRide(ride.id).filter(b => b.status === 'accepted').length} réservation(s) acceptée(s)
                  </p>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="mb-4">Vous n'avez pas encore de trajet actif</p>
              <Link to="/driver/offer">
                <Button>Proposer un trajet</Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : getFilteredRides().length > 0 ? (
            getFilteredRides().map(ride => (
              <Card key={ride.id} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {ride.departure} <ArrowRight className="inline mx-2" /> {ride.destination}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-2">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {format(new Date(ride.departure_time), 'PPPp', { locale: fr })}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{ride.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-sm text-gray-500">
                      {getBookingsForRide(ride.id).filter(b => b.status === 'accepted').length} passagers
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p>Vous n'avez pas encore de trajet passé</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverDashboard;
