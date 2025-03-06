
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Calendar as CalendarIcon, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFormProps {
  className?: string;
  onSearch?: (searchData: SearchData) => void;
  minimal?: boolean;
  initialData?: SearchData | null;
}

export interface SearchData {
  departure: string;
  destination: string;
  date: Date | undefined;
  passengers: number;
}

const SearchForm: React.FC<SearchFormProps> = ({ className, onSearch, minimal = false, initialData }) => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [passengers, setPassengers] = useState('1');
  
  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setDeparture(initialData.departure);
      setDestination(initialData.destination);
      setDate(initialData.date);
      setPassengers(initialData.passengers.toString());
    }
  }, [initialData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch({
        departure,
        destination,
        date,
        passengers: parseInt(passengers)
      });
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "w-full max-w-5xl mx-auto",
        minimal 
          ? "p-4 bg-white rounded-xl shadow-sm border border-border/60" 
          : "glass-card p-6 md:p-8",
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Departure */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Départ"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        
        {/* Destination */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        
        {/* Date */}
        <div>
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
        
        {/* Passengers */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Passagers" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'passager' : 'passagers'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="bg-carpu-gradient hover:opacity-90 transition-opacity">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
