
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { Ride, Booking } from '@/types';
import { toast } from 'sonner';
import { Calendar, Clock, MapPin, User, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const RideDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isDriver, isPassenger } = useAuth();
  const navigate = useNavigate();
  
  const [ride, setRide] = useState<Ride | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [seats, setSeats] = useState(1);
  const [hasBooked, setHasBooked] = useState(false);
  
  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch ride details
        const { data: rideData, error: rideError } = await supabase
          .from('rides')
          .select(`
            *,
            driver:profiles(*)
          `)
          .eq('id', id)
          .single();
          
        if (rideError) throw rideError;
        
        // Fetch bookings for this ride
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            passenger:profiles(*)
          `)
          .eq('ride_id', id);
          
        if (bookingsError) throw bookingsError;
        
        setRide(rideData as Ride);
        setBookings(bookingsData as Booking[]);
        
        // Check if user has already booked this ride
        if (user) {
          const userBooking = bookingsData.find(
            (booking) => booking.passenger_id === user.id && 
            (booking.status === 'pending' || booking.status === 'accepted')
          );
          setHasBooked(!!userBooking);
        }
      } catch (error) {
        console.error('Error fetching ride details:', error);
        toast.error('Erreur lors du chargement des détails du trajet');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRideDetails();
  }, [id, user]);
  
  const handleBookRide = async () => {
    if (!user || !ride) return;
    
    try {
      // Check if user has sufficient seats
      if (seats > ride.available_seats) {
        toast.error('Pas assez de places disponibles');
        return;
      }
      
      // Create booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ride_id: ride.id,
          passenger_id: user.id,
          seats: seats,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success('Demande de réservation envoyée');
      setHasBooked(true);
      
      // Update local state
      setBookings([...bookings, data as Booking]);
    } catch (error) {
      console.error('Error booking ride:', error);
      toast.error('Erreur lors de la réservation');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <p className="text-center">Chargement en cours...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!ride) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <p className="text-center">Trajet non trouvé</p>
            <div className="text-center mt-4">
              <Button onClick={() => navigate(-1)}>Retour</Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {ride.departure} → {ride.destination}
              </CardTitle>
              <CardDescription>
                {formatDate(ride.departure_time)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Départ
                  </h3>
                  <p className="text-gray-700">{formatDate(ride.departure_time)}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Lieu de départ
                  </h3>
                  <p className="text-gray-700">{ride.departure}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Destination
                  </h3>
                  <p className="text-gray-700">{ride.destination}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Places disponibles
                  </h3>
                  <p className="text-gray-700">{ride.available_seats}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Prix
                  </h3>
                  <p className="text-gray-700">{ride.price} €</p>
                </div>
              </div>
              
              {ride.description && (
                <div className="mt-4">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-gray-700">{ride.description}</p>
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="font-semibold flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Conducteur
                </h3>
                {ride.driver && (
                  <p className="text-gray-700">
                    {ride.driver.first_name} {ride.driver.last_name}
                  </p>
                )}
              </div>
              
              {isPassenger() && !isDriver() && !hasBooked && ride.status === 'active' && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold mb-2">Réserver ce trajet</h3>
                  <div className="flex items-center space-x-4">
                    <div>
                      <label htmlFor="seats" className="block text-sm font-medium mb-1">
                        Nombre de places
                      </label>
                      <select
                        id="seats"
                        value={seats}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        className="border rounded px-3 py-2"
                      >
                        {Array.from(
                          { length: Math.min(4, ride.available_seats) },
                          (_, i) => i + 1
                        ).map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      onClick={handleBookRide}
                      className="bg-carpu-gradient hover:opacity-90"
                    >
                      Réserver
                    </Button>
                  </div>
                </div>
              )}
              
              {hasBooked && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-green-600 font-medium">
                    Vous avez réservé ce trajet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {isDriver() && ride.driver && user?.id === ride.driver.id && (
            <Card>
              <CardHeader>
                <CardTitle>Réservations</CardTitle>
                <CardDescription>
                  Gérez les réservations pour ce trajet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between">
                          <div>
                            {booking.passenger && (
                              <p className="font-medium">
                                {booking.passenger.first_name} {booking.passenger.last_name}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              {booking.seats} {booking.seats > 1 ? 'places' : 'place'}
                            </p>
                            <p className="text-sm text-gray-600">
                              Status: {booking.status}
                            </p>
                          </div>
                          {booking.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-green-500 text-green-600"
                                onClick={async () => {
                                  try {
                                    const { error } = await supabase
                                      .from('bookings')
                                      .update({ status: 'accepted' })
                                      .eq('id', booking.id);
                                      
                                    if (error) throw error;
                                    
                                    // Update local state
                                    setBookings(bookings.map(b => 
                                      b.id === booking.id 
                                        ? { ...b, status: 'accepted' as const } 
                                        : b
                                    ));
                                    
                                    toast.success('Réservation acceptée');
                                  } catch (error) {
                                    console.error('Error accepting booking:', error);
                                    toast.error('Erreur lors de l\'acceptation');
                                  }
                                }}
                              >
                                Accepter
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-500 text-red-600"
                                onClick={async () => {
                                  try {
                                    const { error } = await supabase
                                      .from('bookings')
                                      .update({ status: 'rejected' })
                                      .eq('id', booking.id);
                                      
                                    if (error) throw error;
                                    
                                    // Update local state
                                    setBookings(bookings.map(b => 
                                      b.id === booking.id 
                                        ? { ...b, status: 'rejected' as const } 
                                        : b
                                    ));
                                    
                                    toast.success('Réservation refusée');
                                  } catch (error) {
                                    console.error('Error rejecting booking:', error);
                                    toast.error('Erreur lors du refus');
                                  }
                                }}
                              >
                                Refuser
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    Aucune réservation pour ce trajet
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RideDetails;
