
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
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour réserver un trajet";
            redirect('login');
        }

        // Vérifier si le formulaire a été soumis
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            redirect('rides');
        }

        // Récupérer les données du formulaire
        $this->booking->ride_id = $_POST['ride_id'];
        $this->booking->passenger_id = $_SESSION['user_id'];
        $this->booking->seats = isset($_POST['seats']) ? $_POST['seats'] : 1;

        // Vérifier si l'utilisateur a déjà réservé ce trajet
        if($this->booking->checkExistingBooking()) {
            $_SESSION['error'] = "Vous avez déjà réservé ce trajet";
            redirect('ride&id=' . $this->booking->ride_id);
        }

        // Vérifier si le trajet existe et s'il reste des places disponibles
        $this->ride->id = $this->booking->ride_id;
        if(!$this->ride->readOne()) {
            $_SESSION['error'] = "Trajet introuvable";
            redirect('rides');
        }

        if($this->ride->available_seats < $this->booking->seats) {
            $_SESSION['error'] = "Il ne reste pas assez de places disponibles";
            redirect('ride&id=' . $this->booking->ride_id);
        }

        // Créer la réservation
        if($this->booking->create()) {
            // Mettre à jour le nombre de places disponibles
            $this->ride->available_seats = $this->ride->available_seats - $this->booking->seats;
            $this->ride->updateAvailableSeats();
            
            $_SESSION['success'] = "Votre réservation a été effectuée avec succès";
            redirect('bookings');
        } else {
            $_SESSION['error'] = "Une erreur s'est produite lors de la réservation";
            redirect('ride&id=' . $this->booking->ride_id);
        }
    }

    // Afficher les réservations de l'utilisateur
    public function myBookings() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour voir vos réservations";
            redirect('login');
        }

        $this->booking->passenger_id = $_SESSION['user_id'];
        $bookings = $this->booking->readUserBookings();

        include "views/bookings/my_bookings.php";
    }

    // Annuler une réservation
    public function cancel() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour annuler une réservation";
            redirect('login');
        }

        // Vérifier si l'ID de la réservation est fourni
        if(!isset($_GET['id'])) {
            $_SESSION['error'] = "Réservation introuvable";
            redirect('bookings');
        }

        $this->booking->id = $_GET['id'];
        if(!$this->booking->readOne()) {
            $_SESSION['error'] = "Réservation introuvable";
            redirect('bookings');
        }

        // Vérifier si l'utilisateur est le propriétaire de la réservation
        if($this->booking->passenger_id != $_SESSION['user_id']) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à annuler cette réservation";
            redirect('bookings');
        }

        // Annuler la réservation
        $this->booking->status = 'cancelled';
        if($this->booking->updateStatus()) {
            // Mettre à jour le nombre de places disponibles
            $this->ride->id = $this->booking->ride_id;
            $this->ride->readOne();
            $this->ride->available_seats = $this->ride->available_seats + $this->booking->seats;
            $this->ride->updateAvailableSeats();

            $_SESSION['success'] = "Votre réservation a été annulée avec succès";
        } else {
            $_SESSION['error'] = "Une erreur s'est produite lors de l'annulation";
        }

        redirect('bookings');
    }

    // Afficher les réservations pour un trajet
    public function rideBookings() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour voir les réservations";
            redirect('login');
        }

        // Vérifier si l'ID du trajet est fourni
        if(!isset($_GET['id'])) {
            $_SESSION['error'] = "Trajet introuvable";
            redirect('my-rides');
        }

        $this->ride->id = $_GET['id'];
        if(!$this->ride->readOne()) {
            $_SESSION['error'] = "Trajet introuvable";
            redirect('my-rides');
        }

        // Vérifier si l'utilisateur est le propriétaire du trajet
        if($this->ride->driver_id != $_SESSION['user_id']) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à voir ces réservations";
            redirect('my-rides');
        }

        $this->booking->ride_id = $this->ride->id;
        $bookings = $this->booking->readRideBookings();

        include "views/bookings/ride_bookings.php";
    }

    // Afficher les détails d'une réservation
    public function show() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour voir cette réservation";
            redirect('login');
        }

        // Vérifier si l'ID de la réservation est fourni
        if(!isset($_GET['id'])) {
            $_SESSION['error'] = "Réservation introuvable";
            redirect('bookings');
        }

        $this->booking->id = $_GET['id'];
        if(!$this->booking->readOne()) {
            $_SESSION['error'] = "Réservation introuvable";
            redirect('bookings');
        }

        // Récupérer les détails du trajet
        $this->ride->id = $this->booking->ride_id;
        $this->ride->readOne();

        // Vérifier si l'utilisateur est le passager ou le conducteur
        if($this->booking->passenger_id != $_SESSION['user_id'] && $this->ride->driver_id != $_SESSION['user_id']) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à voir cette réservation";
            redirect('bookings');
        }

        include "views/bookings/show.php";
    }

    // Mettre à jour le statut d'une réservation
    public function updateStatus() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour gérer les réservations";
            redirect('login');
        }

        // Vérifier si les données sont fournies
        if(!isset($_GET['id']) || !isset($_GET['status'])) {
            $_SESSION['error'] = "Données manquantes";
            redirect('my-rides');
        }

        $this->booking->id = $_GET['id'];
        if(!$this->booking->readOne()) {
            $_SESSION['error'] = "Réservation introuvable";
            redirect('my-rides');
        }

        // Récupérer les détails du trajet
        $this->ride->id = $this->booking->ride_id;
        $this->ride->readOne();

        // Vérifier si l'utilisateur est le conducteur du trajet
        if($this->ride->driver_id != $_SESSION['user_id']) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à gérer cette réservation";
            redirect('my-rides');
        }

        $valid_statuses = ['accepted', 'rejected', 'completed'];
        if(!in_array($_GET['status'], $valid_statuses)) {
            $_SESSION['error'] = "Statut invalide";
            redirect('ride-bookings&id=' . $this->booking->ride_id);
        }

        // Si on accepte une réservation, vérifier qu'il reste des places
        if($_GET['status'] === 'accepted' && $this->booking->status !== 'accepted') {
            $booked_seats = $this->booking->countAcceptedBookings();
            if($booked_seats + $this->booking->seats > $this->ride->available_seats) {
                $_SESSION['error'] = "Il ne reste pas assez de places disponibles";
                redirect('ride-bookings&id=' . $this->booking->ride_id);
            }
        }

        // Mettre à jour le statut
        $old_status = $this->booking->status;
        $this->booking->status = $_GET['status'];
        
        if($this->booking->updateStatus()) {
            // Si la réservation est annulée ou rejetée, mettre à jour le nombre de places disponibles
            if(($old_status === 'accepted' && $this->booking->status === 'rejected') || 
               ($old_status === 'accepted' && $this->booking->status === 'cancelled')) {
                $this->ride->available_seats = $this->ride->available_seats + $this->booking->seats;
                $this->ride->updateAvailableSeats();
            }
            
            $_SESSION['success'] = "Statut de la réservation mis à jour avec succès";
        } else {
            $_SESSION['error'] = "Une erreur s'est produite lors de la mise à jour du statut";
        }

        redirect('ride-bookings&id=' . $this->booking->ride_id);
    }
}
