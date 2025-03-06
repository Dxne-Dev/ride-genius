
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Users, CarFront, Map, Award, Check, X, UserCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Types pour les profils utilisateurs
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'passager' | 'conducteur' | 'admin';
  created_at: string;
}

// Types pour les trajets
interface Ride {
  id: string;
  driver_id: string;
  departure: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  price: number;
  status: string;
  created_at: string;
  driver: {
    first_name: string;
    last_name: string;
  };
}

const AdminDashboard = () => {
  const { user, profile, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [fetchingProfiles, setFetchingProfiles] = useState(true);
  
  const [rides, setRides] = useState<Ride[]>([]);
  const [fetchingRides, setFetchingRides] = useState(true);
  
  // Rediriger si ce n'est pas un admin
  useEffect(() => {
    if (!isLoading && user) {
      if (!isAdmin()) {
        toast.error("Accès non autorisé. Vous devez être un administrateur pour accéder à cette page.");
        navigate('/');
      }
    } else if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, isAdmin, navigate]);
  
  // Charger tous les profils utilisateurs
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user || !isAdmin()) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setProfiles(data || []);
      } catch (error: any) {
        console.error('Erreur lors du chargement des profils:', error);
        toast.error('Erreur lors du chargement des profils utilisateurs');
      } finally {
        setFetchingProfiles(false);
      }
    };
    
    if (user && isAdmin()) {
      fetchProfiles();
    }
  }, [user, isAdmin]);
  
  // Charger tous les trajets
  useEffect(() => {
    const fetchRides = async () => {
      if (!user || !isAdmin()) return;
      
      try {
        const { data, error } = await supabase
          .from('rides')
          .select(`
            *,
            driver:driver_id (
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setRides(data as Ride[] || []);
      } catch (error: any) {
        console.error('Erreur lors du chargement des trajets:', error);
        toast.error('Erreur lors du chargement des trajets');
      } finally {
        setFetchingRides(false);
      }
    };
    
    if (user && isAdmin()) {
      fetchRides();
    }
  }, [user, isAdmin]);
  
  // Mettre à jour le statut d'un trajet
  const handleUpdateRideStatus = async (rideId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status })
        .eq('id', rideId);
        
      if (error) throw error;
      
      // Mettre à jour l'état local
      setRides(prevRides => 
        prevRides.map(ride => 
          ride.id === rideId ? { ...ride, status } : ride
        )
      );
      
      toast.success(`Statut du trajet mis à jour: ${status}`);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du statut du trajet:', error);
      toast.error('Erreur lors de la mise à jour du statut du trajet');
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
  
  if (!user || !isAdmin()) {
    return null; // Will redirect in useEffect
  }
  
  // Compter les utilisateurs par rôle
  const passengerCount = profiles.filter(p => p.role === 'passager').length;
  const driverCount = profiles.filter(p => p.role === 'conducteur').length;
  const adminCount = profiles.filter(p => p.role === 'admin').length;
  
  // Compter les trajets actifs
  const activeRideCount = rides.filter(r => r.status === 'active').length;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
          <p className="text-muted-foreground mb-8">
            Gérez les utilisateurs, les trajets et le fonctionnement de la plateforme
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Passagers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{passengerCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Conducteurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{driverCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Trajets actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeRideCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Administrateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{adminCount}</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="users">
            <TabsList className="mb-6">
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="rides">Trajets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              {fetchingProfiles ? (
                <p>Chargement des utilisateurs...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Nom</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Téléphone</th>
                        <th className="text-left py-3 px-4">Rôle</th>
                        <th className="text-left py-3 px-4">Date d'inscription</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map((profile) => (
                        <tr key={profile.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{profile.first_name} {profile.last_name}</td>
                          <td className="py-3 px-4">{/* Mettre l'email ici */}</td>
                          <td className="py-3 px-4">{profile.phone || '-'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              profile.role === 'passager' ? 'bg-blue-100 text-blue-800' :
                              profile.role === 'conducteur' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {profile.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">{profile.created_at ? formatDate(profile.created_at) : '-'}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <a href={`/admin/users/${profile.id}`}>
                                  Détails
                                </a>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rides">
              {fetchingRides ? (
                <p>Chargement des trajets...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Trajet</th>
                        <th className="text-left py-3 px-4">Conducteur</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Prix</th>
                        <th className="text-left py-3 px-4">Places</th>
                        <th className="text-left py-3 px-4">Statut</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rides.map((ride) => (
                        <tr key={ride.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            {ride.departure} → {ride.destination}
                          </td>
                          <td className="py-3 px-4">
                            {ride.driver.first_name} {ride.driver.last_name}
                          </td>
                          <td className="py-3 px-4">
                            {formatDate(ride.departure_time)}
                            <div className="text-xs text-muted-foreground">
                              {formatTime(ride.departure_time)}
                            </div>
                          </td>
                          <td className="py-3 px-4">{ride.price}€</td>
                          <td className="py-3 px-4">{ride.available_seats}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ride.status === 'active' ? 'bg-green-100 text-green-800' :
                              ride.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {ride.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <a href={`/admin/rides/${ride.id}`}>
                                  Détails
                                </a>
                              </Button>
                              {ride.status === 'active' ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleUpdateRideStatus(ride.id, 'blocked')}
                                >
                                  Bloquer
                                </Button>
                              ) : ride.status === 'blocked' ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() => handleUpdateRideStatus(ride.id, 'active')}
                                >
                                  Activer
                                </Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
