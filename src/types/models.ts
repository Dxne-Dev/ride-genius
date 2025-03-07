
export type UserRole = 'passager' | 'conducteur' | 'admin';

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: UserRole;
}

export interface Ride {
  id: string;
  driver_id: string;
  departure: string;
  destination: string;
  departure_time: string;
  available_seats: number;
  price: number;
  description: string | null;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  bookings?: Booking[];
  driver?: UserProfile;
}

export interface Booking {
  id: string;
  ride_id: string;
  passenger_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  seats: number;
  created_at: string;
  ride?: Ride;
  passenger?: UserProfile;
}

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
