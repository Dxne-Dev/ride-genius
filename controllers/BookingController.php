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

    // Afficher les réservations pour un trajet
    public function rideBookings() {
        // Vérifier si l'utilisateur est connecté
        if (!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour voir les réservations";
            header("Location: index.php?page=login");
            exit();
        }

        // Vérifier si l'ID du trajet est fourni
        if (!isset($_GET['id'])) {
            $_SESSION['error'] = "Trajet introuvable";
            header("Location: index.php?page=rides");
            exit();
        }

        $this->ride->id = $_GET['id'];
        $ride_data = $this->ride->readOne();

        // Vérifier si le trajet existe et appartient à l'utilisateur
        if (!$ride_data || $ride_data['driver_id'] != $_SESSION['user_id']) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à voir ces réservations";
            header("Location: index.php?page=rides");
            exit();
        }

        $this->booking->ride_id = $this->ride->id;
        $bookings = $this->booking->readRideBookings();

        // Récupérer les détails du trajet pour affichage
        $this->ride->driver_name = $ride_data['driver_name'] ?? '';

        include "views/bookings/ride_bookings.php";
    }

    // Afficher les détails d'une réservation
    public function show() {
        // Vérifier si l'utilisateur est connecté
        if (!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour voir cette réservation";
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

        // Vérifier si la réservation existe et est liée à l'utilisateur
        if (!$booking_data || 
            ($booking_data['passenger_id'] != $_SESSION['user_id'] && 
             $booking_data['driver_id'] != $_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à voir cette réservation";
            header("Location: index.php?page=bookings");
            exit();
        }

        include "views/bookings/show.php";
    }

    // Mettre à jour le statut d'une réservation
    public function updateStatus() {
        // Vérifier si l'utilisateur est connecté
        if (!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour gérer les réservations";
            header("Location: index.php?page=login");
            exit();
        }

        // Vérifier si les données sont fournies
        if (!isset($_GET['id']) || !isset($_GET['status'])) {
            $_SESSION['error'] = "Données manquantes";
            header("Location: index.php?page=bookings");
            exit();
        }

        $this->booking->id = $_GET['id'];
        $booking_data = $this->booking->readOne();

        // Vérifier si la réservation existe
        if (!$booking_data) {
            $_SESSION['error'] = "Réservation introuvable";
            header("Location: index.php?page=bookings");
            exit();
        }

        // Récupérer les détails du trajet
        $this->ride->id = $booking_data['ride_id'];
        $ride_data = $this->ride->readOne();

        // Vérifier si l'utilisateur est le conducteur du trajet
        if ($ride_data['driver_id'] != $_SESSION['user_id']) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à gérer cette réservation";
            header("Location: index.php?page=bookings");
            exit();
        }

        $valid_statuses = ['accepted', 'rejected', 'cancelled'];
        if (!in_array($_GET['status'], $valid_statuses)) {
            $_SESSION['error'] = "Statut invalide";
            header("Location: index.php?page=ride-bookings&id=" . $booking_data['ride_id']);
            exit();
        }

        $this->booking->status = $_GET['status'];
        
        // Mettre à jour le statut
        if ($this->booking->updateStatus()) {
            // Si la réservation est annulée ou rejetée, mettre à jour le nombre de places disponibles
            if ($this->booking->status === 'rejected' || $this->booking->status === 'cancelled') {
                $this->ride->available_seats = $ride_data['available_seats'] + $booking_data['seats'];
                $this->ride->updateAvailableSeats();
            }
            
            $_SESSION['success'] = "Statut de la réservation mis à jour avec succès";
        } else {
            $_SESSION['error'] = "Une erreur s'est produite lors de la mise à jour du statut";
        }

        header("Location: index.php?page=ride-bookings&id=" . $booking_data['ride_id']);
        exit();
    }
    
    // Méthode pour vérifier si un utilisateur a déjà réservé ce trajet
    // Cette méthode est appelée dans le contrôleur RideController
    public function checkExistingBooking() {
        // Vérifier si les données nécessaires sont définies
        if (empty($this->booking->ride_id) || empty($this->booking->passenger_id)) {
            return false;
        }
        
        return $this->booking->hasBooking();
    }
}
