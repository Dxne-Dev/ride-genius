
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Car, Clock, CurrencyEuro, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Offer = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [departureTime, setDepartureTime] = useState('');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('Vous devez être connecté pour proposer un trajet');
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    
    // Log the data for demonstration
    console.info({
      date,
      departureTime,
      price,
      seats
    });
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Votre trajet a été enregistré avec succès !');
      setSubmitting(false);
      
      // Reset form
      setDate(new Date());
      setDepartureTime('');
      setDeparture('');
      setDestination('');
      setPrice('');
      setSeats('');
    }, 1500);
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
  
  if (!user) {
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
                  {/* Departure and Destination */}
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
                  
                  {/* Date and Time */}
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
                
                {/* Price and Seats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix par passager (€)</Label>
                    <div className="relative">
                      <CurrencyEuro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-carpu-gradient hover:opacity-90 transition-opacity"
                  disabled={submitting}
                >
                  {submitting ? 'Enregistrement en cours...' : 'Proposer ce trajet'}
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

export default Offer;
