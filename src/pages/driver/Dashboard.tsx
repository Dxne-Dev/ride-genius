
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { Ride, Booking } from '@/types';
import { CalendarDays, Car, CheckCircle, Clock, Users, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import RideCard from '@/components/rides/RideCard';
import BookingCard from '@/components/bookings/BookingCard';

const DriverDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [rides, setRides] = useState<Ride[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    activeRides: 0,
    totalSeats: 0,
    bookedSeats: 0,
    earnings: 0
  });

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch driver's rides
        const { data: ridesData, error: ridesError } = await supabase
          .from('rides')
          .select('*')
          .eq('driver_id', user.id)
          .order('departure_time', { ascending: true });
          
        if (ridesError) throw ridesError;
        
        // Fetch bookings for those rides
        const rideIds = ridesData.map(ride => ride.id);
        
        if (rideIds.length > 0) {
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              id,
              ride_id,
              passenger_id,
              seats,
              status,
              created_at,
              ride:rides(*),
              passenger:profiles(*)
            `)
            .in('ride_id', rideIds);
            
          if (bookingsError) throw bookingsError;
          
          // Group bookings by ride
          const ridesWithBookings = ridesData.map(ride => ({
            ...ride,
            bookings: bookingsData.filter(booking => booking.ride_id === ride.id)
          }));
          
          setRides(ridesWithBookings);
          
          // Set only pending bookings for display
          setBookings(bookingsData.filter(b => b.status === 'pending'));
          
          // Calculate stats
          const activeRides = ridesData.filter(r => r.status === 'active').length;
          const totalSeats = ridesData.reduce((sum, ride) => sum + ride.available_seats, 0);
          
          const bookedSeats = bookingsData
            .filter(b => b.status === 'accepted')
            .reduce((sum, booking) => sum + booking.seats, 0);
            
          const earnings = bookingsData
            .filter(b => b.status === 'accepted')
            .reduce((sum, booking) => {
              const ridePrice = booking.ride?.price || 0;
              return sum + (ridePrice * booking.seats);
            }, 0);
          
          setStats({
            activeRides,
            totalSeats,
            bookedSeats,
            earnings
          });
        } else {
          setRides([]);
          setBookings([]);
        }
      } catch (error) {
        console.error('Error fetching driver data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDriverData();
  }, [user]);
  
  const handleAcceptBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'accepted' })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      
      toast.success('Réservation acceptée');
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error('Erreur lors de l\'acceptation de la réservation');
    }
  };
  
  const handleRejectBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'rejected' })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      
      toast.success('Réservation refusée');
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Erreur lors du refus de la réservation');
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord Conducteur</h1>
          <p className="text-muted-foreground mb-8">
            Gérez vos trajets et vos réservations
          </p>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Trajets actifs</p>
                    <h3 className="text-2xl font-bold">{stats.activeRides}</h3>
                  </div>
                  <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Car className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Places réservées</p>
                    <h3 className="text-2xl font-bold">{stats.bookedSeats} / {stats.totalSeats}</h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Prochains trajets</p>
                    <h3 className="text-2xl font-bold">
                      {rides.filter(r => 
                        r.status === 'active' && 
                        new Date(r.departure_time) > new Date()
                      ).length}
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CalendarDays className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenus</p>
                    <h3 className="text-2xl font-bold">{stats.earnings} €</h3>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Réservations en attente */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Réservations en attente</CardTitle>
                  <CardDescription>
                    Réservations nécessitant votre validation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map(booking => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          actions={
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center text-green-600"
                                onClick={() => handleAcceptBooking(booking.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accepter
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center text-red-600"
                                onClick={() => handleRejectBooking(booking.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Refuser
                              </Button>
                            </div>
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Aucune réservation en attente
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Prochains trajets */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Mes trajets</CardTitle>
                    <CardDescription>
                      Vos prochains trajets
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => navigate('/driver/offer')}
                    className="bg-carpu-gradient hover:opacity-90"
                  >
                    <Car className="mr-2 h-4 w-4" />
                    Proposer un trajet
                  </Button>
                </CardHeader>
                <CardContent>
                  {rides.length > 0 ? (
                    <div className="space-y-4">
                      {rides
                        .filter(ride => 
                          ride.status === 'active' && 
                          new Date(ride.departure_time) > new Date()
                        )
                        .slice(0, 3)
                        .map(ride => (
                          <RideCard
                            key={ride.id}
                            ride={ride}
                            onSelect={() => navigate(`/rides/${ride.id}`)}
                          />
                        ))}
                      
                      {rides.filter(ride => 
                        ride.status === 'active' && 
                        new Date(ride.departure_time) > new Date()
                      ).length > 3 && (
                        <div className="text-center pt-4">
                          <Button
                            variant="outline"
                            onClick={() => navigate('/driver/rides')}
                          >
                            Voir tous mes trajets
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Vous n'avez pas encore proposé de trajet
                      </p>
                      <Button
                        onClick={() => navigate('/driver/offer')}
                        className="bg-carpu-gradient hover:opacity-90"
                      >
                        <Car className="mr-2 h-4 w-4" />
                        Proposer un trajet
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DriverDashboard;
