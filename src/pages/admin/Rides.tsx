
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { Ride } from '@/types';
import { Calendar, Car, Filter, Search, Trash, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminRides = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    if (!isAdmin()) {
      return;
    }
    
    const fetchRides = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('rides')
          .select(`
            *,
            driver:profiles(*),
            bookings:bookings(*)
          `)
          .order('departure_time', { ascending: false });
          
        if (error) throw error;
        
        // Cast the data to ensure type safety
        const typedRides = data.map(ride => ({
          ...ride,
          status: ride.status as "active" | "completed" | "cancelled",
          bookings: ride.bookings as any[] || []
        }));
        
        setRides(typedRides as Ride[]);
        setFilteredRides(typedRides as Ride[]);
      } catch (error) {
        console.error('Error fetching rides:', error);
        toast.error('Erreur lors du chargement des trajets');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRides();
  }, [isAdmin]);
  
  useEffect(() => {
    let result = rides;
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(ride => 
        ride.departure.toLowerCase().includes(searchLower) ||
        ride.destination.toLowerCase().includes(searchLower) ||
        (ride.driver?.first_name && ride.driver.first_name.toLowerCase().includes(searchLower)) ||
        (ride.driver?.last_name && ride.driver.last_name.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(ride => ride.status === statusFilter);
    }
    
    setFilteredRides(result);
  }, [search, statusFilter, rides]);
  
  const handleCancelRide = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status: 'cancelled' })
        .eq('id', rideId);
        
      if (error) throw error;
      
      // Update bookings for this ride to cancelled
      const { error: bookingsError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('ride_id', rideId)
        .in('status', ['pending', 'accepted']);
        
      if (bookingsError) throw bookingsError;
      
      // Update local state
      setRides(rides.map(r => 
        r.id === rideId ? { ...r, status: 'cancelled' as const } : r
      ));
      
      toast.success('Trajet annulé avec succès');
    } catch (error) {
      console.error('Error cancelling ride:', error);
      toast.error('Erreur lors de l\'annulation du trajet');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr });
  };
  
  if (!isAdmin()) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Accès non autorisé</h1>
            <p>Vous n'avez pas les droits pour accéder à cette page.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Gestion des trajets</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
              <CardDescription>
                Rechercher et filtrer les trajets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Rechercher par ville, conducteur..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actifs</SelectItem>
                      <SelectItem value="completed">Terminés</SelectItem>
                      <SelectItem value="cancelled">Annulés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trajets ({filteredRides.length})</CardTitle>
              <CardDescription>
                Liste de tous les trajets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-8">Chargement...</p>
              ) : filteredRides.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trajet</TableHead>
                      <TableHead>Conducteur</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Places</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRides.map((ride) => (
                      <TableRow key={ride.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {ride.departure} → {ride.destination}
                            </p>
                            <p className="text-xs text-gray-500">{ride.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {ride.driver ? (
                            <p>
                              {ride.driver.first_name} {ride.driver.last_name}
                            </p>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {formatDate(ride.departure_time)}
                        </TableCell>
                        <TableCell>{ride.price} €</TableCell>
                        <TableCell>
                          {ride.available_seats} 
                          {ride.bookings && (
                            <span className="text-xs text-gray-500">
                              ({ride.bookings.filter(b => b.status === 'accepted').length} réservées)
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ride.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : ride.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {ride.status === 'active' 
                              ? 'Actif' 
                              : ride.status === 'completed'
                              ? 'Terminé'
                              : 'Annulé'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/rides/${ride.id}`)}
                            >
                              <Car className="h-4 w-4" />
                            </Button>
                            
                            {ride.status === 'active' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Annuler le trajet</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Êtes-vous sûr de vouloir annuler ce trajet ? 
                                      Cette action annulera également toutes les réservations.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 text-white hover:bg-red-600"
                                      onClick={() => handleCancelRide(ride.id)}
                                    >
                                      Confirmer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  Aucun trajet trouvé
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminRides;
