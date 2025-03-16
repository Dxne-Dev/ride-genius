
<?php
class Review {
    private $conn;
    private $table_name = "reviews";
    
    public $id;
    public $booking_id;
    public $author_id;
    public $recipient_id;
    public $rating;
    public $comment;
    public $created_at;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Créer un avis
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (booking_id, author_id, recipient_id, rating, comment) 
                  VALUES (?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer les données
        $this->booking_id = htmlspecialchars(strip_tags($this->booking_id));
        $this->author_id = htmlspecialchars(strip_tags($this->author_id));
        $this->recipient_id = htmlspecialchars(strip_tags($this->recipient_id));
        $this->rating = htmlspecialchars(strip_tags($this->rating));
        $this->comment = htmlspecialchars(strip_tags($this->comment));
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->booking_id);
        $stmt->bindParam(2, $this->author_id);
        $stmt->bindParam(3, $this->recipient_id);
        $stmt->bindParam(4, $this->rating);
        $stmt->bindParam(5, $this->comment);
        
        // Exécuter la requête
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        
        return false;
    }
    
    // Vérifier si un avis existe déjà pour une réservation
    public function checkExistingReview() {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE booking_id = ? AND author_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->booking_id);
        $stmt->bindParam(2, $this->author_id);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
    
    // Lire les avis d'un utilisateur (reçus)
    public function readUserReviews() {
        $query = "SELECT r.*, 
                CONCAT(u.first_name, ' ', u.last_name) as author_name,
                b.ride_id
                FROM " . $this->table_name . " r
                LEFT JOIN users u ON r.author_id = u.id
                LEFT JOIN bookings b ON r.booking_id = b.id
                WHERE r.recipient_id = ?
                ORDER BY r.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->recipient_id);
        $stmt->execute();
        
        return $stmt;
    }
    
    // Calculer la note moyenne d'un utilisateur
    public function getUserAverageRating() {
        $query = "SELECT AVG(rating) as average_rating
                FROM " . $this->table_name . " 
                WHERE recipient_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->recipient_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['average_rating'] ? round($row['average_rating'], 1) : 0;
    }
}
