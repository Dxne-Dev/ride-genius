
<?php
class Booking {
    private $conn;
    private $table_name = "bookings";
    
    public $id;
    public $ride_id;
    public $passenger_id;
    public $status;
    public $seats;
    public $created_at;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Créer une réservation
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (ride_id, passenger_id, status, seats) VALUES (?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer les données
        $this->ride_id = htmlspecialchars(strip_tags($this->ride_id));
        $this->passenger_id = htmlspecialchars(strip_tags($this->passenger_id));
        $this->seats = htmlspecialchars(strip_tags($this->seats));
        $this->status = 'pending'; // Statut par défaut
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->ride_id);
        $stmt->bindParam(2, $this->passenger_id);
        $stmt->bindParam(3, $this->status);
        $stmt->bindParam(4, $this->seats);
        
        // Exécuter la requête
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        
        return false;
    }
    
    // Lire une réservation
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->ride_id = $row['ride_id'];
            $this->passenger_id = $row['passenger_id'];
            $this->status = $row['status'];
            $this->seats = $row['seats'];
            $this->created_at = $row['created_at'];
            
            return true;
        }
        
        return false;
    }
    
    // Mettre à jour le statut d'une réservation
    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . " SET status = ? WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer les données
        $this->status = htmlspecialchars(strip_tags($this->status));
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->status);
        $stmt->bindParam(2, $this->id);
        
        // Exécuter la requête
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Vérifier si un utilisateur a déjà réservé un trajet
    public function checkExistingBooking() {
        $query = "SELECT * FROM " . $this->table_name . " 
                WHERE ride_id = ? AND passenger_id = ? 
                AND (status = 'pending' OR status = 'accepted')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->ride_id);
        $stmt->bindParam(2, $this->passenger_id);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
    
    // Lire les réservations d'un utilisateur
    public function readUserBookings() {
        // On récupère les détails du trajet pour les afficher
        $query = "SELECT b.*, 
                r.departure, r.destination, r.departure_time, r.price,
                CONCAT(u.first_name, ' ', u.last_name) as driver_name
                FROM " . $this->table_name . " b
                LEFT JOIN rides r ON b.ride_id = r.id
                LEFT JOIN users u ON r.driver_id = u.id
                WHERE b.passenger_id = ?
                ORDER BY r.departure_time DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->passenger_id);
        $stmt->execute();
        
        return $stmt;
    }
    
    // Lire les réservations pour un trajet
    public function readRideBookings() {
        $query = "SELECT b.*, CONCAT(u.first_name, ' ', u.last_name) as passenger_name,
                u.phone as passenger_phone
                FROM " . $this->table_name . " b
                LEFT JOIN users u ON b.passenger_id = u.id
                WHERE b.ride_id = ?
                ORDER BY b.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->ride_id);
        $stmt->execute();
        
        return $stmt;
    }
    
    // Compter les réservations acceptées pour un trajet
    public function countAcceptedBookings() {
        $query = "SELECT SUM(seats) as total_seats
                FROM " . $this->table_name . " 
                WHERE ride_id = ? AND status = 'accepted'";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->ride_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total_seats'] ? $row['total_seats'] : 0;
    }
}
