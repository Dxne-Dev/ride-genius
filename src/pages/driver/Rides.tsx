
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { Ride } from '@/types';
import { Car, Filter, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import RideCard from '@/components/rides/RideCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DriverRides = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [rides, setRides] = useState<Ride[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  useEffect(() => {
    const fetchRides = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('rides')
          .select(`
            *,
            bookings:bookings(*)
          `)
          .eq('driver_id', user.id)
          .order('departure_time', { ascending: true });
          
        if (error) throw error;
        
        // Cast the data to ensure type safety
        const typedRides = data.map(ride => ({
          ...ride,
          status: ride.status as "active" | "completed" | "cancelled",
          bookings: ride.bookings as any[] || []
        }));
        
        setRides(typedRides as Ride[]);
      } catch (error) {
        console.error('Error fetching rides:', error);
        toast.error('Erreur lors du chargement des trajets');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRides();
  }, [user]);
  
  const getUpcomingRides = () => {
    const now = new Date();
    return rides.filter(ride => 
      ride.status === 'active' && 
      new Date(ride.departure_time) > now
    );
  };
  
  const getPastRides = () => {
    const now = new Date();
    return rides.filter(ride => 
      ride.status === 'completed' || 
      (ride.status === 'active' && new Date(ride.departure_time) < now)
    );
  };
  
  const getCancelledRides = () => {
    return rides.filter(ride => ride.status === 'cancelled');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Mes trajets</h1>
            <Button
              onClick={() => navigate('/driver/offer')}
              className="bg-carpu-gradient hover:opacity-90"
            >
              <Car className="mr-2 h-4 w-4" />
              Proposer un trajet
            </Button>
          </div>
          
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="upcoming">À venir</TabsTrigger>
                <TabsTrigger value="past">Passés</TabsTrigger>
                <TabsTrigger value="cancelled">Annulés</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>Trajets à venir</CardTitle>
                  <CardDescription>
                    Les trajets que vous allez effectuer prochainement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-center py-8">Chargement...</p>
                  ) : getUpcomingRides().length > 0 ? (
                    <div className="space-y-4">
                      {getUpcomingRides().map(ride => (
                        <RideCard
                          key={ride.id}
                          ride={ride}
                          onSelect={() => navigate(`/rides/${ride.id}`)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Vous n'avez pas de trajets à venir
                      </p>
                      <Button
                        onClick={() => navigate('/driver/offer')}
                        className="bg-carpu-gradient hover:opacity-90"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Proposer un trajet
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="past">
              <Card>
                <CardHeader>
                  <CardTitle>Trajets passés</CardTitle>
                  <CardDescription>
                    Historique des trajets que vous avez effectués
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-center py-8">Chargement...</p>
                  ) : getPastRides().length > 0 ? (
                    <div className="space-y-4">
                      {getPastRides().map(ride => (
                        <RideCard
                          key={ride.id}
                          ride={ride}
                          onSelect={() => navigate(`/rides/${ride.id}`)}
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
                  <CardTitle>Trajets annulés</CardTitle>
                  <CardDescription>
                    Trajets que vous avez annulés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-center py-8">Chargement...</p>
                  ) : getCancelledRides().length > 0 ? (
                    <div className="space-y-4">
                      {getCancelledRides().map(ride => (
                        <RideCard
                          key={ride.id}
                          ride={ride}
                          onSelect={() => navigate(`/rides/${ride.id}`)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      Vous n'avez pas de trajets annulés
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

export default DriverRides;
