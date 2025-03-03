
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Calendar as CalendarIcon, Clock, User, Car, CreditCard, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Offer = () => {
  const [date, setDate] = useState<Date>();
  const [departureTime, setDepartureTime] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('3');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.success("Votre trajet a été publié avec succès !");
    
    // Here you would typically submit to API
    console.log({
      date,
      departureTime,
      price,
      seats
    });
  };
  
  return (
    <Layout>
      <div className="pt-28 pb-20">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Proposer un trajet</h1>
            <p className="text-muted-foreground">
              Partagez votre voyage et réduisez vos frais tout en aidant d'autres voyageurs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Détails du trajet</CardTitle>
                  <CardDescription>
                    Renseignez les informations de votre trajet pour le publier.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Route */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Itinéraire</h3>
                      
                      <div className="space-y-3">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Départ" className="pl-10" required />
                        </div>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Destination" className="pl-10" required />
                        </div>
                        
                        <div className="text-sm">
                          <Button type="button" variant="link" className="h-auto p-0 text-carpu-purple">
                            + Ajouter des étapes intermédiaires
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Date and Time */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Date et heure</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date de départ</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="date"
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
                          <Label htmlFor="time">Heure de départ</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input 
                              id="time"
                              type="time" 
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
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Prix et places</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Prix par passager (€)</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input 
                              id="price"
                              type="number" 
                              placeholder="25" 
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="pl-10"
                              min="1"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="seats">Nombre de places disponibles</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Select value={seats} onValueChange={setSeats}>
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
                    </div>
                    
                    {/* Vehicle Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Informations sur le véhicule</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="car-model">Modèle de voiture</Label>
                          <div className="relative">
                            <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="car-model" placeholder="ex: Peugeot 3008" className="pl-10" required />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="car-color">Couleur</Label>
                          <Input id="car-color" placeholder="ex: Gris métallisé" required />
                        </div>
                      </div>
                    </div>
                    
                    {/* Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Préférences</h3>
                      
                      <div className="space-y-3">
                        {[
                          { id: 'animals', label: 'Animaux autorisés' },
                          { id: 'smoking', label: 'Fumeur autorisé' },
                          { id: 'music', label: 'Musique possible' },
                          { id: 'conversation', label: 'Conversation souhaitée' }
                        ].map((pref) => (
                          <div key={pref.id} className="flex items-center space-x-2">
                            <Checkbox id={pref.id} />
                            <label 
                              htmlFor={pref.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {pref.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Informations complémentaires</h3>
                      
                      <div>
                        <Textarea 
                          placeholder="Ajoutez des détails sur votre trajet (point de rendez-vous précis, bagages acceptés, etc.)" 
                          className="min-h-32"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-carpu-gradient hover:opacity-90 transition-opacity">
                      Publier ce trajet
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Right side - Tips */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Info className="h-5 w-5 mr-2" />
                    Conseils pour les conducteurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-1">Prix équitable</h4>
                      <p className="text-muted-foreground">
                        Proposez un prix raisonnable pour attirer plus de passagers. 
                        Le but du covoiturage est de partager les frais, pas de faire du profit.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Soyez précis</h4>
                      <p className="text-muted-foreground">
                        Donnez des détails sur les points de rendez-vous et 
                        d'arrivée pour faciliter l'organisation.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Communication</h4>
                      <p className="text-muted-foreground">
                        Restez joignable avant le départ et informez vos passagers 
                        en cas de changement ou de retard.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Sécurité</h4>
                      <p className="text-muted-foreground">
                        Assurez-vous que votre véhicule est en bon état et 
                        respectez les règles de sécurité routière.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Offer;
