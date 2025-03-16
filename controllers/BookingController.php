
<?php
require_once 'models/Booking.php';
require_once 'models/Ride.php';
require_once 'config/Database.php';

class BookingController {
    private $db;
    private $booking;
    private $ride;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->booking = new Booking($this->db);
        $this->ride = new Ride($this->db);
    }

    // Créer une réservation
    public function create() {
        // Vérifier si l'utilisateur est connecté
        if (!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour réserver un trajet";
            header("Location: index.php?page=login");
            exit();
        }

        // Vérifier si le formulaire a été soumis
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header("Location: index.php?page=rides");
            exit();
        }

        // Récupérer les données du formulaire
        $this->booking->ride_id = $_POST['ride_id'];
        $this->booking->passenger_id = $_SESSION['user_id'];
        $this->booking->seats = isset($_POST['seats']) ? $_POST['seats'] : 1;

        // Vérifier si l'utilisateur a déjà réservé ce trajet
        if ($this->booking->checkExistingBooking()) {
            $_SESSION['error'] = "Vous avez déjà réservé ce trajet";
            header("Location: index.php?page=ride&id=" . $this->booking->ride_id);
            exit();
        }

        // Vérifier si le trajet existe et s'il reste des places disponibles
        $this->ride->id = $this->booking->ride_id;
        $ride_data = $this->ride->readOne();
        
        if (!$ride_data) {
            $_SESSION['error'] = "Trajet introuvable";
            header("Location: index.php?page=rides");
            exit();
        }

        if ($ride_data['available_seats'] < $this->booking->seats) {
            $_SESSION['error'] = "Il ne reste pas assez de places disponibles";
            header("Location: index.php?page=ride&id=" . $this->booking->ride_id);
            exit();
        }

        // Créer la réservation
        if ($this->booking->create()) {
            // Mettre à jour le nombre de places disponibles
            $this->ride->available_seats = $ride_data['available_seats'] - $this->booking->seats;
            $this->ride->updateAvailableSeats();
            
            $_SESSION['success'] = "Votre réservation a été effectuée avec succès";
            header("Location: index.php?page=bookings");
        } else {
            $_SESSION['error'] = "Une erreur s'est produite lors de la réservation";
            header("Location: index.php?page=ride&id=" . $this->booking->ride_id);
        }
        exit();
    }

    // Afficher les réservations de l'utilisateur
    public function myBookings() {
        // Vérifier si l'utilisateur est connecté
        if (!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour voir vos réservations";
            header("Location: index.php?page=login");
            exit();
        }

        $this->booking->passenger_id = $_SESSION['user_id'];
        $bookings = $this->booking->readUserBookings();

        include "views/bookings/my_bookings.php";
    }

    // Annuler une réservation
    public function cancel() {
        // Vérifier si l'utilisateur est connecté
        if (!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour annuler une réservation";
            header("Location: index.php?page=login");
            exit();
        }

        // Vérifier si l'ID de la réservation est fourni
        if (!isset($_GET['id'])) {
            $_SESSION['error'] = "Réservation introuvable";
            header("Location: index.php?page=bookings");
            exit();
        }

        $this->booking->id = $_GET['id'];
        $booking_data = $this->booking->readOne();

        // Vérifier si la réservation existe et appartient à l'utilisateur
        if (!$booking_data || $booking_data['passenger_id'] != $_SESSION['user_id']) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à annuler cette réservation";
            header("Location: index.php?page=bookings");
            exit();
        }

        // Annuler la réservation
        $this->booking->status = 'cancelled';
        if ($this->booking->updateStatus()) {
            // Mettre à jour le nombre de places disponibles
            $this->ride->id = $booking_data['ride_id'];
            $ride_data = $this->ride->readOne();
            $this->ride->available_seats = $ride_data['available_seats'] + $booking_data['seats'];
            $this->ride->updateAvailableSeats();

            $_SESSION['success'] = "Votre réservation a été annulée avec succès";
        } else {
            $_SESSION['error'] = "Une erreur s'est produite lors de l'annulation";
        }

        header("Location: index.php?page=bookings");
        exit();
    }
}
