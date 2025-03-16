
<?php
require_once 'models/Review.php';
require_once 'models/Booking.php';
require_once 'models/Ride.php';
require_once 'config/Database.php';

class ReviewController {
    private $db;
    private $review;
    private $booking;
    private $ride;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->review = new Review($this->db);
        $this->booking = new Booking($this->db);
        $this->ride = new Ride($this->db);
    }

    // Afficher le formulaire d'ajout d'avis
    public function createForm() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour laisser un avis";
            redirect('login');
        }

        // Vérifier si l'ID de la réservation est fourni
        if(!isset($_GET['booking_id'])) {
            $_SESSION['error'] = "Réservation introuvable";
            redirect('bookings');
        }

        $this->booking->id = $_GET['booking_id'];
        if(!$this->booking->readOne()) {
            $_SESSION['error'] = "Réservation introuvable";
            redirect('bookings');
        }

        // Vérifier si l'utilisateur est le passager de la réservation
        if($this->booking->passenger_id != $_SESSION['user_id']) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à laisser un avis pour cette réservation";
            redirect('bookings');
        }

        // Vérifier si la réservation est terminée
        if($this->booking->status !== 'completed') {
            $_SESSION['error'] = "Vous ne pouvez laisser un avis que pour une réservation terminée";
            redirect('bookings');
        }

        // Récupérer les détails du trajet et du conducteur
        $this->ride->id = $this->booking->ride_id;
        $this->ride->readOne();

        // Vérifier si un avis existe déjà
        $this->review->booking_id = $this->booking->id;
        $this->review->author_id = $_SESSION['user_id'];
        if($this->review->checkExistingReview()) {
            $_SESSION['error'] = "Vous avez déjà laissé un avis pour cette réservation";
            redirect('bookings');
        }

        include "views/reviews/create.php";
    }

    // Créer un avis
    public function create() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour laisser un avis";
            redirect('login');
        }

        // Vérifier si le formulaire a été soumis
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            redirect('bookings');
        }

        // Vérifier les champs requis
        if(!isset($_POST['booking_id']) || !isset($_POST['recipient_id']) || !isset($_POST['rating'])) {
            $_SESSION['error'] = "Tous les champs sont obligatoires sauf le commentaire";
            redirect('bookings');
        }

        // Vérifier si la note est valide
        if($_POST['rating'] < 1 || $_POST['rating'] > 5) {
            $_SESSION['error'] = "La note doit être comprise entre 1 et 5";
            redirect('add-review&booking_id=' . $_POST['booking_id']);
        }

        // Vérifier si la réservation existe et appartient à l'utilisateur
        $this->booking->id = $_POST['booking_id'];
        if(!$this->booking->readOne() || $this->booking->passenger_id != $_SESSION['user_id']) {
            $_SESSION['error'] = "Réservation introuvable ou vous n'y avez pas accès";
            redirect('bookings');
        }

        // Vérifier si un avis existe déjà
        $this->review->booking_id = $this->booking->id;
        $this->review->author_id = $_SESSION['user_id'];
        if($this->review->checkExistingReview()) {
            $_SESSION['error'] = "Vous avez déjà laissé un avis pour cette réservation";
            redirect('bookings');
        }

        // Assigner les valeurs
        $this->review->recipient_id = $_POST['recipient_id'];
        $this->review->rating = $_POST['rating'];
        $this->review->comment = !empty($_POST['comment']) ? $_POST['comment'] : null;

        // Créer l'avis
        if($this->review->create()) {
            $_SESSION['success'] = "Votre avis a été enregistré avec succès";
        } else {
            $_SESSION['error'] = "Une erreur s'est produite lors de l'enregistrement de votre avis";
        }

        redirect('bookings');
    }

    // Afficher les avis reçus
    public function myReviews() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour voir vos avis";
            redirect('login');
        }

        $this->review->recipient_id = $_SESSION['user_id'];
        $reviews = $this->review->readUserReviews();
        $average_rating = $this->review->getUserAverageRating();

        include "views/reviews/my_reviews.php";
    }
}
