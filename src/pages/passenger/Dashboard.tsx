
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowRight, CalendarIcon, Clock, MapPin, Star, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Booking, Ride } from '@/types/models';

const PassengerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // For reviews
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // Get all bookings with ride details
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            ride:ride_id(
              *,
              driver:driver_id(*)
            )
          `)
          .eq('passenger_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Erreur lors du chargement des réservations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
        
      if (error) throw error;
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
      
      toast.success('Réservation annulée');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error("Erreur lors de l'annulation de la réservation");
    }
  };

  const submitReview = async () => {
    if (!selectedBooking || rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      // Check if a review already exists
      const { data: existingReviews, error: checkError } = await supabase
        .from('reviews')
        .select('*')
        .eq('booking_id', selectedBooking.id)
        .eq('author_id', user!.id);
        
      if (checkError) throw checkError;
      
      if (existingReviews && existingReviews.length > 0) {
        toast.error('Vous avez déjà laissé un avis pour ce trajet');
        return;
      }
      
      // Create the review
      const { error } = await supabase
        .from('reviews')
        .insert({
          booking_id: selectedBooking.id,
          author_id: user!.id,
          recipient_id: selectedBooking.ride?.driver?.id || selectedBooking.ride?.driver_id,
          rating,
          comment: comment.trim() || null
        });
        
      if (error) throw error;
      
      // Mark the booking as "completed" if it was "accepted"
      if (selectedBooking.status === 'accepted') {
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ status: 'completed' })
          .eq('id', selectedBooking.id);
          
        if (updateError) throw updateError;
        
        // Update local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === selectedBooking.id ? { ...booking, status: 'completed' } : booking
          )
        );
      }
      
      toast.success('Merci pour votre avis !');
      setRating(0);
      setComment('');
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Erreur lors de l'envoi de l'avis");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getFilteredBookings = () => {
    if (activeTab === 'upcoming') {
      return bookings.filter(booking => 
        (booking.status === 'pending' || booking.status === 'accepted') && 
        booking.ride && 
        new Date(booking.ride.departure_time) > new Date()
      );
    } else if (activeTab === 'past') {
      return bookings.filter(booking => 
        (booking.status === 'completed' || 
         (booking.ride && new Date(booking.ride.departure_time) < new Date()))
      );
    } else if (activeTab === 'cancelled') {
      return bookings.filter(booking => booking.status === 'cancelled' || booking.status === 'rejected');
    }
    return bookings;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes réservations</h1>
        <Link to="/search">
          <Button>Rechercher un trajet</Button>
        </Link>
      </div>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="past">Passés</TabsTrigger>
          <TabsTrigger value="cancelled">Annulés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : getFilteredBookings().length > 0 ? (
            getFilteredBookings().map(booking => (
              <Card key={booking.id} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {booking.ride?.departure} <ArrowRight className="inline mx-2" /> {booking.ride?.destination}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-2">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {booking.ride?.departure_time && format(new Date(booking.ride.departure_time), 'PPPp', { locale: fr })}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className={
                      booking.status === 'accepted' ? 'bg-green-500' : 
                      booking.status === 'pending' ? 'bg-yellow-500' : 
                      'bg-gray-500'
                    }>
                      {booking.status === 'accepted' ? 'Acceptée' : 
                       booking.status === 'pending' ? 'En attente' : 
                       booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Conducteur: {booking.ride?.driver?.first_name} {booking.ride?.driver?.last_name}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Départ: {booking.ride?.departure}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Heure: {booking.ride?.departure_time && format(new Date(booking.ride.departure_time), 'p', { locale: fr })}
                    </div>
                    <div>
                      <p className="font-medium">{booking.seats} place(s) • {booking.ride?.price && Number(booking.ride.price) * booking.seats} €</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {booking.status !== 'cancelled' && (
                    <Button 
                      variant="outline" 
                      onClick={() => cancelBooking(booking.id)}
                      className="mr-2"
                    >
                      Annuler
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="mb-4">Vous n'avez pas de réservation à venir</p>
              <Link to="/search">
                <Button>Rechercher un trajet</Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : getFilteredBookings().length > 0 ? (
            getFilteredBookings().map(booking => (
              <Card key={booking.id} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {booking.ride?.departure} <ArrowRight className="inline mx-2" /> {booking.ride?.destination}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-2">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {booking.ride?.departure_time && format(new Date(booking.ride.departure_time), 'PPPp', { locale: fr })}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {booking.status === 'completed' ? 'Terminé' : 'Passé'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Conducteur: {booking.ride?.driver?.first_name} {booking.ride?.driver?.last_name}
                    </div>
                    <div>
                      <p className="font-medium">{booking.seats} place(s) • {booking.ride?.price && Number(booking.ride.price) * booking.seats} €</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {(booking.status === 'accepted' || booking.status === 'completed') && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => setSelectedBooking(booking)}
                          variant="outline"
                        >
                          <Star className="w-4 h-4 mr-2" /> Laisser un avis
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Laisser un avis</DialogTitle>
                          <DialogDescription>
                            Evaluez votre expérience avec {booking.ride?.driver?.first_name} {booking.ride?.driver?.last_name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="flex items-center justify-center space-x-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button 
                                key={star} 
                                variant="ghost" 
                                className="p-2"
                                onClick={() => setRating(star)}
                              >
                                <Star 
                                  className={`w-8 h-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              </Button>
                            ))}
                          </div>
                          <textarea 
                            className="w-full p-2 border rounded-md" 
                            rows={4}
                            placeholder="Partagez votre expérience (optionnel)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" className="mr-2">Annuler</Button>
                          </DialogClose>
                          <Button 
                            onClick={submitReview} 
                            disabled={isSubmittingReview || rating === 0}
                          >
                            {isSubmittingReview ? 'Envoi...' : 'Envoyer'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p>Vous n'avez pas de réservation passée</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : getFilteredBookings().length > 0 ? (
            getFilteredBookings().map(booking => (
              <Card key={booking.id} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {booking.ride?.departure} <ArrowRight className="inline mx-2" /> {booking.ride?.destination}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center mt-2">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {booking.ride?.departure_time && format(new Date(booking.ride.departure_time), 'PPPp', { locale: fr })}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="destructive">
                      {booking.status === 'cancelled' ? 'Annulée' : 'Refusée'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Conducteur: {booking.ride?.driver?.first_name} {booking.ride?.driver?.last_name}
                    </div>
                    <div>
                      <p className="font-medium">{booking.seats} place(s) • {booking.ride?.price && Number(booking.ride.price) * booking.seats} €</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p>Vous n'avez pas de réservation annulée</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PassengerDashboard;
