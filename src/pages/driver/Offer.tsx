
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Car, Clock, Euro, Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DriverOffer = () => {
  const { user, profile, isLoading, isDriver } = useAuth();
  const navigate = useNavigate();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [departureTime, setDepartureTime] = useState('');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Rediriger si ce n'est pas un conducteur
  useEffect(() => {
    if (!isLoading && user) {
      if (!isDriver()) {
        toast.error("Accès non autorisé. Vous devez être un conducteur pour proposer un trajet.");
        navigate('/');
      }
    } else if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, isDriver, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error('Veuillez sélectionner une date');
      return;
    }
    
    if (!departureTime) {
      toast.error('Veuillez indiquer une heure de départ');
      return;
    }
    
    if (!departure || !destination) {
      toast.error('Veuillez indiquer un lieu de départ et d\'arrivée');
      return;
    }
    
    if (!price || !seats) {
      toast.error('Veuillez indiquer un prix et le nombre de places disponibles');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Création de la date de départ à partir de la date et de l'heure
      const [hours, minutes] = departureTime.split(':').map(Number);
      const departureDate = new Date(date);
      departureDate.setHours(hours || 0, minutes || 0);
      
      const { data, error } = await supabase
        .from('rides')
        .insert({
          driver_id: user?.id,
          departure,
          destination,
          departure_time: departureDate.toISOString(),
          price: parseFloat(price),
          available_seats: parseInt(seats, 10),
          description: description || null,
          status: 'active'
        })
        .select();
        
      if (error) throw error;
      
      toast.success('Votre trajet a été enregistré avec succès !');
      
      // Rediriger vers le tableau de bord du conducteur
      navigate('/driver/dashboard');
      
    } catch (error: any) {
      console.error('Erreur lors de la création du trajet:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la création du trajet');
    } finally {
      setSubmitting(false);
    }
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
  
  if (!user || !isDriver()) {
    return null; // Will be redirected in useEffect
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Proposer un trajet</h1>
          <p className="text-muted-foreground mb-8">
            Partagez votre trajet et réduisez vos frais tout en contribuant à réduire l'empreinte carbone.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Détails du trajet</CardTitle>
              <CardDescription>
                Renseignez les informations de votre trajet pour le proposer aux voyageurs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="departure">Ville de départ</Label>
                      <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="departure" 
                          placeholder="Exemple: Paris" 
                          value={departure}
                          onChange={(e) => setDeparture(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="destination">Ville d'arrivée</Label>
                      <div className="relative">
                        <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="destination" 
                          placeholder="Exemple: Lyon" 
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Date de départ</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-3 h-4 w-4" />
                            {date ? (
                              format(date, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionnez une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="departureTime">Heure de départ</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="departureTime" 
                          placeholder="Exemple: 14:30" 
                          value={departureTime}
                          onChange={(e) => setDepartureTime(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix par passager (€)</Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="price" 
                        type="number" 
                        placeholder="Exemple: 25" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="pl-10"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="seats">Places disponibles</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Select value={seats} onValueChange={setSeats} required>
                        <SelectTrigger id="seats" className="pl-10">
                          <SelectValue placeholder="Nombre de places" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'place' : 'places'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Détails supplémentaires (facultatif)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Informations complémentaires sur votre trajet : points de rendez-vous précis, bagages acceptés, etc." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-carpu-gradient hover:opacity-90 transition-opacity"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement en cours...
                    </>
                  ) : (
                    'Proposer ce trajet'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
              En proposant un trajet, vous acceptez nos conditions générales et notre charte de bonne conduite.
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DriverOffer;
