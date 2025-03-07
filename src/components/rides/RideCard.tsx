
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Users, Euro } from 'lucide-react';
import { Ride } from '@/types';
import { formatDistance } from '@/utils/formatters';

interface RideCardProps {
  ride: Ride;
  onSelect?: () => void;
  actionButton?: React.ReactNode;
  showDetails?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({ 
  ride, 
  onSelect, 
  actionButton,
  showDetails = false
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-carpu-purple" />
                {ride.departure} → {ride.destination}
              </h3>
              
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-3">
                  {new Date(ride.departure_time).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {new Date(ride.departure_time).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl font-bold text-carpu-purple">{ride.price} €</div>
              <div className="text-sm flex items-center justify-end mt-1">
                <Users className="h-4 w-4 mr-1" />
                <span>{ride.available_seats} place{ride.available_seats > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          
          {showDetails && ride.description && (
            <div className="mt-3 mb-4 text-sm">
              <p className="text-muted-foreground">{ride.description}</p>
            </div>
          )}
          
          {showDetails && ride.driver && (
            <div className="flex items-center mb-4 border-t pt-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mr-3">
                {ride.driver.first_name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-medium">
                  {ride.driver.first_name} {ride.driver.last_name}
                </p>
                <p className="text-xs text-muted-foreground">Conducteur</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            {actionButton || (
              <Button 
                onClick={onSelect} 
                className="bg-carpu-gradient hover:opacity-90"
              >
                Voir le trajet
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideCard;
