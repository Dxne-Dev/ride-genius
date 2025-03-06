
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchForm, { SearchData } from '@/components/search/SearchForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { format, isEqual, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CarFront, Clock, MapPin, CreditCard, Star, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RideResult {
  id: string;
  driver: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  departure: {
    city: string;
    time: string;
  };
  destination: {
    city: string;
    time: string;
  };
  price: number;
  seats: number;
  car: string;
  distance: string;
  duration: string;
}

const Search = () => {
  const [searchParams, setSearchParams] = useState<SearchData | null>(null);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredResults, setFilteredResults] = useState<RideResult[]>([]);
  const [isReserving, setIsReserving] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock data for demonstration
  const mockResults: RideResult[] = [
    {
      id: '1',
      driver: {
        name: 'Pierre Dupont',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.8,
        verified: true
      },
      departure: {
        city: 'Paris',
        time: '08:00'
      },
      destination: {
        city: 'Lyon',
        time: '12:30'
      },
      price: 35,
      seats: 3,
      car: 'Peugeot 3008',
      distance: '465 km',
      duration: '4h 30min'
    },
    {
      id: '2',
      driver: {
        name: 'Marie Lambert',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4.9,
        verified: true
      },
      departure: {
        city: 'Paris',
        time: '09:30'
      },
      destination: {
        city: 'Lyon',
        time: '14:00'
      },
      price: 32,
      seats: 2,
      car: 'Renault Clio',
      distance: '465 km',
      duration: '4h 30min'
    },
    {
      id: '3',
      driver: {
        name: 'Thomas Martin',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        rating: 4.6,
        verified: true
      },
      departure: {
        city: 'Paris',
        time: '14:00'
      },
      destination: {
        city: 'Lyon',
        time: '18:30'
      },
      price: 28,
      seats: 4,
      car: 'Citroën C4',
      distance: '465 km',
      duration: '4h 30min'
    },
    {
      id: '4',
      driver: {
        name: 'Sophie Petit',
        avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
        rating: 4.7,
        verified: true
      },
      departure: {
        city: 'Marseille',
        time: '10:00'
      },
      destination: {
        city: 'Nice',
        time: '12:00'
      },
      price: 22,
      seats: 3,
      car: 'Toyota Yaris',
      distance: '200 km',
      duration: '2h 00min'
    },
    {
      id: '5',
      driver: {
        name: 'Jean Moreau',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        rating: 4.5,
        verified: true
      },
      departure: {
        city: 'Bordeaux',
        time: '07:30'
      },
      destination: {
        city: 'Toulouse',
        time: '10:30'
      },
      price: 25,
      seats: 2,
      car: 'Volkswagen Golf',
      distance: '245 km',
      duration: '3h 00min'
    }
  ];
  
  // Check if search parameters were passed from the home page
  useEffect(() => {
    const searchData = location.state?.searchData;
    if (searchData) {
      setSearchParams(searchData);
    }
  }, [location]);
  
  // Apply filters whenever search parameters or price range changes
  useEffect(() => {
    if (!searchParams) {
      setFilteredResults([]);
      return;
    }
    
    // Filter rides based on search criteria and price range
    const results = mockResults.filter(ride => {
      // Match departure and destination cities (case insensitive)
      const departureMatch = ride.departure.city.toLowerCase().includes(searchParams.departure.toLowerCase());
      const destinationMatch = ride.destination.city.toLowerCase().includes(searchParams.destination.toLowerCase());
      
      // Match price range
      const priceMatch = ride.price >= priceRange[0] && ride.price <= priceRange[1];
      
      // Check if ride has enough seats
      const seatsMatch = ride.seats >= searchParams.passengers;
      
      return departureMatch && destinationMatch && priceMatch && seatsMatch;
    });
    
    setFilteredResults(results);
  }, [searchParams, priceRange]);
  
  const handleSearch = (data: SearchData) => {
    setSearchParams(data);
    console.log('Search data:', data);
  };
  
  const handleReservation = async (rideId: string) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour réserver un trajet');
      navigate('/login');
      return;
    }
    
    setIsReserving(rideId);
    
    try {
      // Find the ride in filteredResults
      const ride = filteredResults.find(r => r.id === rideId);
      
      if (!ride) {
        throw new Error("Ce trajet n'existe pas");
      }
      
      // In a real-world scenario, we would store this in Supabase
      // For now, we'll simulate a successful reservation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Votre réservation pour ${ride.departure.city} → ${ride.destination.city} a été confirmée !`);
      
      // Redirect to the rides page
      navigate('/rides');
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error("Une erreur est survenue lors de la réservation");
    } finally {
      setIsReserving(null);
    }
  };

  // Filter options for departure time 
  const [timeFilters, setTimeFilters] = useState({
    morning: false,
    afternoon: false,
    evening: false
  });

  // Apply time filters to results
  const applyTimeFilters = (results: RideResult[]) => {
    // If no time filters are selected, return all results
    if (!timeFilters.morning && !timeFilters.afternoon && !timeFilters.evening) {
      return results;
    }

    return results.filter(ride => {
      const hourStr = ride.departure.time.split(':')[0];
      const hour = parseInt(hourStr);

      if (timeFilters.morning && hour < 12) return true;
      if (timeFilters.afternoon && hour >= 12 && hour < 18) return true;
      if (timeFilters.evening && hour >= 18) return true;

      return false;
    });
  };

  // Get the final filtered results
  const finalResults = searchParams ? applyTimeFilters(filteredResults) : [];
  
  return (
    <Layout>
      <div className="pt-28 pb-20">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Rechercher un trajet</h1>
            <SearchForm onSearch={handleSearch} minimal initialData={searchParams} />
          </div>
          
          {searchParams && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters - Desktop */}
              <div className="hidden lg:block">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Filtres</h3>
                    
                    <div className="space-y-6">
                      {/* Price range */}
                      <div>
                        <h4 className="font-medium mb-3">Prix</h4>
                        <div className="mb-2">
                          <Slider
                            defaultValue={[0, 100]}
                            max={100}
                            step={1}
                            value={priceRange}
                            onValueChange={setPriceRange}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{priceRange[0]}€</span>
                          <span>{priceRange[1]}€</span>
                        </div>
                      </div>
                      
                      {/* Departure time */}
                      <div>
                        <h4 className="font-medium mb-3">Heure de départ</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="time-morning" 
                              checked={timeFilters.morning}
                              onCheckedChange={(checked) => 
                                setTimeFilters(prev => ({...prev, morning: checked === true}))
                              }
                            />
                            <label htmlFor="time-morning" className="text-sm">Matin (avant 12h)</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="time-afternoon" 
                              checked={timeFilters.afternoon}
                              onCheckedChange={(checked) => 
                                setTimeFilters(prev => ({...prev, afternoon: checked === true}))
                              }
                            />
                            <label htmlFor="time-afternoon" className="text-sm">Après-midi (12h-18h)</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="time-evening" 
                              checked={timeFilters.evening}
                              onCheckedChange={(checked) => 
                                setTimeFilters(prev => ({...prev, evening: checked === true}))
                              }
                            />
                            <label htmlFor="time-evening" className="text-sm">Soir (après 18h)</label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Comfort options */}
                      <div>
                        <h4 className="font-medium mb-3">Confort</h4>
                        <div className="space-y-2">
                          {['Accepte les animaux', 'Espace bagages', 'Climatisation', 'Prises USB'].map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox id={`option-${option}`} />
                              <label htmlFor={`option-${option}`} className="text-sm">{option}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Search Results */}
              <div className="lg:col-span-3">
                {/* Mobile filter button */}
                <div className="lg:hidden mb-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtres
                  </Button>
                  
                  {showFilters && (
                    <Card className="mt-4">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Filtres</h3>
                        
                        <div className="space-y-6">
                          {/* Price range */}
                          <div>
                            <h4 className="font-medium mb-3">Prix</h4>
                            <div className="mb-2">
                              <Slider
                                defaultValue={[0, 100]}
                                max={100}
                                step={1}
                                value={priceRange}
                                onValueChange={setPriceRange}
                              />
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{priceRange[0]}€</span>
                              <span>{priceRange[1]}€</span>
                            </div>
                          </div>
                          
                          {/* Departure time */}
                          <div>
                            <h4 className="font-medium mb-3">Heure de départ</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="mobile-time-morning" 
                                  checked={timeFilters.morning}
                                  onCheckedChange={(checked) => 
                                    setTimeFilters(prev => ({...prev, morning: checked === true}))
                                  }
                                />
                                <label htmlFor="mobile-time-morning" className="text-sm">Matin (avant 12h)</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="mobile-time-afternoon" 
                                  checked={timeFilters.afternoon}
                                  onCheckedChange={(checked) => 
                                    setTimeFilters(prev => ({...prev, afternoon: checked === true}))
                                  }
                                />
                                <label htmlFor="mobile-time-afternoon" className="text-sm">Après-midi (12h-18h)</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="mobile-time-evening" 
                                  checked={timeFilters.evening}
                                  onCheckedChange={(checked) => 
                                    setTimeFilters(prev => ({...prev, evening: checked === true}))
                                  }
                                />
                                <label htmlFor="mobile-time-evening" className="text-sm">Soir (après 18h)</label>
                              </div>
                            </div>
                          </div>
                          
                          {/* Comfort options */}
                          <div>
                            <h4 className="font-medium mb-3">Confort</h4>
                            <div className="space-y-2">
                              {['Accepte les animaux', 'Espace bagages', 'Climatisation', 'Prises USB'].map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                  <Checkbox id={`mobile-option-${option}`} />
                                  <label htmlFor={`mobile-option-${option}`} className="text-sm">{option}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    {searchParams.departure} → {searchParams.destination} · {searchParams.date ? format(searchParams.date, 'd MMMM yyyy', { locale: fr }) : 'Date non spécifiée'} · {searchParams.passengers} {searchParams.passengers > 1 ? 'passagers' : 'passager'}
                  </p>
                </div>
                
                {finalResults.length > 0 ? (
                  <div className="space-y-4">
                    {finalResults.map((ride) => (
                      <Card key={ride.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Time and Route */}
                            <div className="flex items-start space-x-4">
                              <div className="text-center">
                                <div className="text-lg font-semibold">{ride.departure.time}</div>
                                <div className="h-14 w-px bg-border mx-auto my-1"></div>
                                <div className="text-lg font-semibold">{ride.destination.time}</div>
                              </div>
                              
                              <div>
                                <div className="mb-4">
                                  <div className="font-semibold">{ride.departure.city}</div>
                                  <div className="text-sm text-muted-foreground flex items-center">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    Point de rendez-vous
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="font-semibold">{ride.destination.city}</div>
                                  <div className="text-sm text-muted-foreground flex items-center">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    Point d'arrivée
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Driver info */}
                            <div className="flex items-center space-x-4">
                              <img 
                                src={ride.driver.avatar} 
                                alt={ride.driver.name} 
                                className="h-12 w-12 rounded-full object-cover"
                              />
                              
                              <div>
                                <div className="font-medium">{ride.driver.name}</div>
                                <div className="flex items-center text-sm">
                                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                                  <span>{ride.driver.rating}</span>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <CarFront className="mr-1 h-3 w-3" />
                                  {ride.car}
                                </div>
                              </div>
                            </div>
                            
                            {/* Price and details */}
                            <div className="flex flex-col justify-between">
                              <div className="flex items-center justify-between">
                                <div className="text-sm flex items-center">
                                  <Clock className="mr-1 h-4 w-4" />
                                  {ride.duration}
                                </div>
                                <div className="text-xl font-bold text-carpu-purple">{ride.price}€</div>
                              </div>
                              
                              <div className="text-sm text-muted-foreground mb-2">
                                {ride.seats} {ride.seats > 1 ? 'places disponibles' : 'place disponible'}
                              </div>
                              
                              <Button 
                                className="bg-carpu-gradient hover:opacity-90 transition-opacity w-full mt-auto"
                                onClick={() => handleReservation(ride.id)}
                                disabled={isReserving === ride.id}
                              >
                                {isReserving === ride.id ? 'Réservation en cours...' : (user ? 'Réserver' : 'Se connecter pour réserver')}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-10 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">
                      Aucun trajet ne correspond à vos critères de recherche.
                    </p>
                    <p className="text-sm mt-2 text-muted-foreground">
                      Essayez de modifier vos filtres ou vos critères de recherche.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {!searchParams && (
            <div className="text-center p-10">
              <p className="text-muted-foreground">
                Utilisez le formulaire ci-dessus pour rechercher des trajets disponibles.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
