
<?php
require_once 'models/Ride.php';
require_once 'models/Booking.php';
require_once 'config/Database.php';

class RideController {
    private $db;
    private $ride;
    private $booking;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->ride = new Ride($this->db);
        $this->booking = new Booking($this->db);
    }

    // Afficher tous les trajets
    public function index() {
        $rides = $this->ride->read();
        include "views/rides/index.php";
    }

    // Afficher le formulaire de création de trajet
    public function createForm() {
        // Vérifier si l'utilisateur est connecté et est un conducteur
        if(!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'conducteur') {
            $_SESSION['error'] = "Vous devez être un conducteur pour proposer un trajet";
            redirect('login');
        }

        include "views/rides/create.php";
    }

    // Créer un trajet
    public function create() {
        // Vérifier si l'utilisateur est connecté et est un conducteur
        if(!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'conducteur') {
            $_SESSION['error'] = "Vous devez être un conducteur pour proposer un trajet";
            redirect('login');
        }

        // Vérifier si le formulaire a été soumis
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            redirect('create-ride');
        }

        // Vérifier les champs requis
        if(empty($_POST['departure']) || empty($_POST['destination']) || empty($_POST['departure_time']) || 
           empty($_POST['available_seats']) || empty($_POST['price'])) {
            $_SESSION['error'] = "Tous les champs sont obligatoires sauf la description";
            redirect('create-ride');
        }

        // Vérifier que les places et le prix sont positifs
        if($_POST['available_seats'] <= 0 || $_POST['price'] <= 0) {
            $_SESSION['error'] = "Le nombre de places et le prix doivent être positifs";
            redirect('create-ride');
        }

        // Vérifier que la date de départ est dans le futur
        $departure_time = new DateTime($_POST['departure_time']);
        $now = new DateTime();
        if($departure_time < $now) {
            $_SESSION['error'] = "La date de départ doit être dans le futur";
            redirect('create-ride');
        }

        // Assigner les valeurs
        $this->ride->driver_id = $_SESSION['user_id'];
        $this->ride->departure = $_POST['departure'];
        $this->ride->destination = $_POST['destination'];
        $this->ride->departure_time = $_POST['departure_time'];
        $this->ride->available_seats = $_POST['available_seats'];
        $this->ride->price = $_POST['price'];
        $this->ride->status = 'active';
        $this->ride->description = !empty($_POST['description']) ? $_POST['description'] : null;

        // Créer le trajet
        if($this->ride->create()) {
            $_SESSION['success'] = "Trajet créé avec succès";
            redirect('my-rides');
        } else {
            $_SESSION['error'] = "Une erreur est survenue lors de la création du trajet";
            redirect('create-ride');
        }
    }

    // Détails d'un trajet
    public function show() {
        if(!isset($_GET['id'])) {
            redirect('rides');
        }

        $this->ride->id = $_GET['id'];

        if(!$this->ride->readOne()) {
            $_SESSION['error'] = "Trajet introuvable";
            redirect('rides');
        }

        $has_booked = false;
        if(isset($_SESSION['user_id'])) {
            $this->booking->ride_id = $this->ride->id;
            $this->booking->passenger_id = $_SESSION['user_id'];
            $has_booked = $this->booking->checkExistingBooking();
        }

        include "views/rides/show.php";
    }

    // Afficher le formulaire de modification de trajet
    public function editForm() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour modifier un trajet";
            redirect('login');
        }

        // Vérifier si l'ID du trajet est fourni
        if(!isset($_GET['id'])) {
            redirect('my-rides');
        }

        $this->ride->id = $_GET['id'];
        
        if(!$this->ride->readOne()) {
            $_SESSION['error'] = "Trajet introuvable";
            redirect('my-rides');
        }

        // Vérifier si l'utilisateur est le propriétaire du trajet
        if($this->ride->driver_id != $_SESSION['user_id']) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à modifier ce trajet";
            redirect('my-rides');
        }

        include "views/rides/edit.php";
    }

    // Mettre à jour un trajet
    public function update() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour modifier un trajet";
            redirect('login');
        }

        // Vérifier si le formulaire a été soumis
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            redirect('my-rides');
        }

        // Vérifier les champs requis
        if(empty($_POST['id']) || empty($_POST['departure']) || empty($_POST['destination']) || 
           empty($_POST['departure_time']) || empty($_POST['available_seats']) || empty($_POST['price'])) {
            $_SESSION['error'] = "Tous les champs sont obligatoires sauf la description";
            redirect('edit-ride&id=' . $_POST['id']);
        }

        // Récupérer le trajet
        $this->ride->id = $_POST['id'];
        if(!$this->ride->readOne()) {
            $_SESSION['error'] = "Trajet introuvable";
            redirect('my-rides');
        }

        // Vérifier si l'utilisateur est le propriétaire du trajet
        if($this->ride->driver_id != $_SESSION['user_id']) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à modifier ce trajet";
            redirect('my-rides');
        }

        // Vérifier que les places et le prix sont positifs
        if($_POST['available_seats'] <= 0 || $_POST['price'] <= 0) {
            $_SESSION['error'] = "Le nombre de places et le prix doivent être positifs";
            redirect('edit-ride&id=' . $_POST['id']);
        }

        // Assigner les valeurs
        $this->ride->departure = $_POST['departure'];
        $this->ride->destination = $_POST['destination'];
        $this->ride->departure_time = $_POST['departure_time'];
        $this->ride->available_seats = $_POST['available_seats'];
        $this->ride->price = $_POST['price'];
        $this->ride->status = $_POST['status'];
        $this->ride->description = !empty($_POST['description']) ? $_POST['description'] : null;

        // Mettre à jour le trajet
        if($this->ride->update()) {
            $_SESSION['success'] = "Trajet mis à jour avec succès";
            redirect('my-rides');
        } else {
            $_SESSION['error'] = "Une erreur est survenue lors de la mise à jour du trajet";
            redirect('edit-ride&id=' . $_POST['id']);
        }
    }

    // Annuler un trajet
    public function cancel() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour annuler un trajet";
            redirect('login');
        }

        // Vérifier si l'ID du trajet est fourni
        if(!isset($_GET['id'])) {
            redirect('my-rides');
        }

        $this->ride->id = $_GET['id'];
        
        if(!$this->ride->readOne()) {
            $_SESSION['error'] = "Trajet introuvable";
            redirect('my-rides');
        }

        // Vérifier si l'utilisateur est le propriétaire du trajet
        if($this->ride->driver_id != $_SESSION['user_id']) {
            $_SESSION['error'] = "Vous n'êtes pas autorisé à annuler ce trajet";
            redirect('my-rides');
        }

        // Mettre à jour le statut
        $this->ride->status = 'cancelled';
        
        if($this->ride->update()) {
            $_SESSION['success'] = "Trajet annulé avec succès";
        } else {
            $_SESSION['error'] = "Une erreur est survenue lors de l'annulation du trajet";
        }

        redirect('my-rides');
    }

    // Afficher les trajets d'un conducteur
    public function myRides() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour voir vos trajets";
            redirect('login');
        }

        $this->ride->driver_id = $_SESSION['user_id'];
        $rides = $this->ride->getDriverRides();

        include "views/rides/my_rides.php";
    }

    // Rechercher des trajets
    public function search() {
        // Vérifier si le formulaire a été soumis
        if($_SERVER['REQUEST_METHOD'] !== 'GET' || (!isset($_GET['departure']) && !isset($_GET['destination']) && !isset($_GET['date']))) {
            redirect('rides');
        }

        $this->ride->departure = isset($_GET['departure']) ? $_GET['departure'] : '';
        $this->ride->destination = isset($_GET['destination']) ? $_GET['destination'] : '';
        $this->ride->departure_time = isset($_GET['date']) ? $_GET['date'] : '';

        $rides = $this->ride->search();

        include "views/rides/search.php";
    }
}
