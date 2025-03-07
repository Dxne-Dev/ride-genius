import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchData } from '@/types';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/types';
import { CheckCircle, MapPin, RefreshCcw, Route, Star, Search } from 'lucide-react';
import { toast } from 'sonner';
import BookingCard from '@/components/bookings/BookingCard';
import SearchForm from '@/components/search/SearchForm';

const PassengerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalSpent: 0
  });

  useEffect(() => {
    const fetchPassengerData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            ride_id,
            passenger_id,
            seats,
            status,
            created_at,
            ride:rides(*)
          `)
          .eq('passenger_id', user.id)
          .order('created_at', { ascending: false });
          
        if (bookingsError) throw bookingsError;
        
        const typedBookings = bookingsData.map(booking => ({
          ...booking,
          status: booking.status as "pending" | "accepted" | "rejected" | "cancelled" | "completed",
          ride: booking.ride ? {
            ...booking.ride,
            status: booking.ride.status as "active" | "completed" | "cancelled"
          } : undefined
        }));
        
        const now = new Date();
        const upcoming: Booking[] = [];
        const past: Booking[] = [];
        
        typedBookings.forEach(booking => {
          if (!booking.ride) return;
          
          const departureTime = new Date(booking.ride.departure_time);
          
          if (departureTime > now && 
              (booking.status === 'accepted' || booking.status === 'pending')) {
            upcoming.push(booking as Booking);
          } else if (booking.status === 'completed' || 
                     (departureTime < now && booking.status === 'accepted')) {
            past.push(booking as Booking);
          }
        });
        
        setUpcomingBookings(upcoming);
        setPastBookings(past);
        
        const totalBookings = typedBookings.length;
        const upcomingCount = upcoming.length;
        const completedCount = typedBookings.filter(b => b.status === 'completed').length;
        
        const totalSpent = typedBookings
          .filter(b => b.status === 'accepted' || b.status === 'completed')
          .reduce((sum, booking) => {
            const ridePrice = booking.ride?.price || 0;
            return sum + (ridePrice * booking.seats);
          }, 0);
        
        setStats({
          totalBookings,
          upcomingBookings: upcomingCount,
          completedBookings: completedCount,
          totalSpent
        });
      } catch (error) {
        console.error('Error fetching passenger data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPassengerData();
  }, [user]);
  
  const handleSearch = (searchData: SearchData) => {
    navigate('/search', { state: { searchData } });
  };
  
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      setUpcomingBookings(prev => prev.filter(b => b.id !== bookingId));
      
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
          <h1 className="text-3xl font-bold mb-2">Tableau de bord Passager</h1>
          <p className="text-muted-foreground mb-8">
            Gérez vos réservations et recherchez de nouveaux trajets
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Réservations</p>
                    <h3 className="text-2xl font-bold">{stats.totalBookings}</h3>
                  </div>
                  <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">À venir</p>
                    <h3 className="text-2xl font-bold">{stats.upcomingBookings}</h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Route className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Trajets terminés</p>
                    <h3 className="text-2xl font-bold">{stats.completedBookings}</h3>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Dépenses</p>
                    <h3 className="text-2xl font-bold">{stats.totalSpent} €</h3>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <RefreshCcw className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Rechercher un trajet</CardTitle>
              <CardDescription>
                Trouvez votre prochain covoiturage
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <SearchForm onSearch={handleSearch} minimal={true} />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Réservations à venir</CardTitle>
                  <CardDescription>
                    Vos prochains trajets
                  </CardDescription>
                </div>
                <Button
                  onClick={() => navigate('/search')}
                  variant="outline"
                  className="flex items-center"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map(booking => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        actions={
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
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
                      Vous n'avez pas de réservation à venir
                    </p>
                    <Button
                      onClick={() => navigate('/search')}
                      className="bg-carpu-gradient hover:opacity-90"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Rechercher un trajet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Historique</CardTitle>
                <CardDescription>
                  Vos trajets passés
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pastBookings.length > 0 ? (
                  <div className="space-y-4">
                    {pastBookings.slice(0, 3).map(booking => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                      />
                    ))}
                    
                    {pastBookings.length > 3 && (
                      <div className="text-center pt-4">
                        <Button
                          variant="outline"
                          onClick={() => navigate('/passenger/bookings')}
                        >
                          Voir tout l'historique
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Vous n'avez pas encore effectué de trajet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PassengerDashboard;
