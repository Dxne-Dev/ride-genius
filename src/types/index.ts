
// Types pour les rôles d'utilisateur
export type UserRole = 'passager' | 'conducteur' | 'admin';

// Type pour les données de profil
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at?: string | null;
  updated_at?: string | null;
}

// Types pour les trajets
export interface Ride {
  id: string;
  driver_id: string;
  departure: string;
  destination: string;
  departure_time: string;
  price: number;
  available_seats: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  description: string | null;
  driver?: UserProfile;
  bookings?: Booking[];
}

// Types pour les réservations
export interface Booking {
  id: string;
  ride_id: string;
  passenger_id: string;
  seats: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  created_at: string;
  ride?: Ride;
  passenger?: UserProfile;
}

// Types pour les avis
export interface Review {
  id: string;
  booking_id: string;
  author_id: string;
  recipient_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  author?: UserProfile;
  recipient?: UserProfile;
}

// Type pour les données de recherche
export interface SearchData {
  departure: string;
  destination: string;
  date: Date | undefined;
  passengers: number;
}
