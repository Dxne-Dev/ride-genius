
<?php
class Ride {
    private $conn;
    private $table_name = "rides";
    
    public $id;
    public $driver_id;
    public $departure;
    public $destination;
    public $departure_time;
    public $available_seats;
    public $price;
    public $status;
    public $description;
    public $created_at;
    public $driver_name;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Créer un trajet
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (driver_id, departure, destination, departure_time, available_seats, price, status, description) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer les données
        $this->driver_id = htmlspecialchars(strip_tags($this->driver_id));
        $this->departure = htmlspecialchars(strip_tags($this->departure));
        $this->destination = htmlspecialchars(strip_tags($this->destination));
        $this->departure_time = htmlspecialchars(strip_tags($this->departure_time));
        $this->available_seats = htmlspecialchars(strip_tags($this->available_seats));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->description = htmlspecialchars(strip_tags($this->description));
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->driver_id);
        $stmt->bindParam(2, $this->departure);
        $stmt->bindParam(3, $this->destination);
        $stmt->bindParam(4, $this->departure_time);
        $stmt->bindParam(5, $this->available_seats);
        $stmt->bindParam(6, $this->price);
        $stmt->bindParam(7, $this->status);
        $stmt->bindParam(8, $this->description);
        
        // Exécuter la requête
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        
        return false;
    }
    
    // Lire un trajet
    public function readOne() {
        $query = "SELECT r.*, CONCAT(u.first_name, ' ', u.last_name) as driver_name
                FROM " . $this->table_name . " r
                LEFT JOIN users u ON r.driver_id = u.id
                WHERE r.id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->driver_id = $row['driver_id'];
            $this->departure = $row['departure'];
            $this->destination = $row['destination'];
            $this->departure_time = $row['departure_time'];
            $this->available_seats = $row['available_seats'];
            $this->price = $row['price'];
            $this->status = $row['status'];
            $this->description = $row['description'];
            $this->created_at = $row['created_at'];
            $this->driver_name = $row['driver_name'];
            
            return true;
        }
        
        return false;
    }
    
    // Lire tous les trajets actifs et à venir (avec le nom du conducteur)
    public function read() {
        $query = "SELECT r.*, CONCAT(u.first_name, ' ', u.last_name) as driver_name
                  FROM " . $this->table_name . " r
                  LEFT JOIN users u ON r.driver_id = u.id
                  WHERE r.status = 'active' AND r.departure_time > NOW()
                  ORDER BY r.departure_time ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }
    
    // Mettre à jour un trajet
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET departure = ?, 
                      destination = ?, 
                      departure_time = ?, 
                      available_seats = ?, 
                      price = ?, 
                      status = ?, 
                      description = ?
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer les données
        $this->departure = htmlspecialchars(strip_tags($this->departure));
        $this->destination = htmlspecialchars(strip_tags($this->destination));
        $this->departure_time = htmlspecialchars(strip_tags($this->departure_time));
        $this->available_seats = htmlspecialchars(strip_tags($this->available_seats));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->departure);
        $stmt->bindParam(2, $this->destination);
        $stmt->bindParam(3, $this->departure_time);
        $stmt->bindParam(4, $this->available_seats);
        $stmt->bindParam(5, $this->price);
        $stmt->bindParam(6, $this->status);
        $stmt->bindParam(7, $this->description);
        $stmt->bindParam(8, $this->id);
        
        // Exécuter la requête
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Supprimer un trajet
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer les données
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->id);
        
        // Exécuter la requête
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Mettre à jour le nombre de places disponibles
    public function updateAvailableSeats() {
        $query = "UPDATE " . $this->table_name . " SET available_seats = ? WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->available_seats);
        $stmt->bindParam(2, $this->id);
        
        // Exécuter la requête
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Obtenir les trajets d'un conducteur
    public function getDriverRides() {
        $query = "SELECT r.*, CONCAT(u.first_name, ' ', u.last_name) as driver_name
                  FROM " . $this->table_name . " r
                  LEFT JOIN users u ON r.driver_id = u.id
                  WHERE r.driver_id = ?
                  ORDER BY r.departure_time DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->driver_id);
        $stmt->execute();
        
        return $stmt;
    }
    
    // Rechercher des trajets
    public function search() {
        $query = "SELECT r.*, CONCAT(u.first_name, ' ', u.last_name) as driver_name
                  FROM " . $this->table_name . " r
                  LEFT JOIN users u ON r.driver_id = u.id
                  WHERE r.status = 'active' 
                  AND r.departure_time > NOW()";
        
        // Ajout des critères de recherche si présents
        if (!empty($this->departure)) {
            $query .= " AND r.departure LIKE ?";
            $this->departure = "%" . $this->departure . "%";
        }
        
        if (!empty($this->destination)) {
            $query .= " AND r.destination LIKE ?";
            $this->destination = "%" . $this->destination . "%";
        }
        
        if (!empty($this->departure_time)) {
            $query .= " AND DATE(r.departure_time) = ?";
        }
        
        $query .= " ORDER BY r.departure_time ASC";
        
        $stmt = $this->conn->prepare($query);
        
        // Lier les paramètres si présents
        $paramIndex = 1;
        if (!empty($this->departure)) {
            $stmt->bindParam($paramIndex, $this->departure);
            $paramIndex++;
        }
        
        if (!empty($this->destination)) {
            $stmt->bindParam($paramIndex, $this->destination);
            $paramIndex++;
        }
        
        if (!empty($this->departure_time)) {
            $stmt->bindParam($paramIndex, $this->departure_time);
        }
        
        $stmt->execute();
        
        return $stmt;
    }
    
    // Lire tous les trajets (pour admin)
    public function readAll() {
        $query = "SELECT r.*, CONCAT(u.first_name, ' ', u.last_name) as driver_name
                  FROM " . $this->table_name . " r
                  LEFT JOIN users u ON r.driver_id = u.id
                  ORDER BY r.departure_time DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }
}
