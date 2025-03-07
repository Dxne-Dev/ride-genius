
// Formatter le trajet (distance, durée, etc.)
export const formatDistance = (departure: string, destination: string) => {
  // Fonction à améliorer avec une vraie API de calcul d'itinéraire
  return `${departure} - ${destination}`;
};

// Formatter le statut de réservation
export const formatBookingStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'accepted':
      return 'Confirmé';
    case 'rejected':
      return 'Refusé';
    case 'cancelled':
      return 'Annulé';
    case 'completed':
      return 'Terminé';
    default:
      return status;
  }
};

// Formatter le statut de trajet
export const formatRideStatus = (status: string) => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'completed':
      return 'Terminé';
    case 'cancelled':
      return 'Annulé';
    default:
      return status;
  }
};
