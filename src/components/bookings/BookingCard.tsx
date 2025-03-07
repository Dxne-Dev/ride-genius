
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Booking } from '@/types';
import { formatBookingStatus } from '@/utils/formatters';

interface BookingCardProps {
  booking: Booking;
  actions?: React.ReactNode;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-700';
    case 'accepted':
      return 'bg-green-100 text-green-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    case 'cancelled':
      return 'bg-gray-100 text-gray-700';
    case 'completed':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const BookingCard: React.FC<BookingCardProps> = ({ booking, actions }) => {
  if (!booking.ride) return null;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center mb-2">
                <Badge className={`mr-2 ${getStatusColor(booking.status)}`}>
                  {formatBookingStatus(booking.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Réservation #{booking.id.slice(0, 8)}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-carpu-purple" />
                {booking.ride.departure} → {booking.ride.destination}
              </h3>
              
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-3">
                  {new Date(booking.ride.departure_time).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {new Date(booking.ride.departure_time).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl font-bold text-carpu-purple">
                {booking.ride.price * booking.seats} €
              </div>
              <div className="text-sm flex items-center justify-end mt-1">
                <Users className="h-4 w-4 mr-1" />
                <span>{booking.seats} place{booking.seats > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          
          {actions && (
            <div className="flex justify-end mt-4 space-x-2">
              {actions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
