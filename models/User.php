
<?php
class User {
    private $conn;
    private $table_name = "users";
    
    public $id;
    public $email;
    public $password;
    public $first_name;
    public $last_name;
    public $phone;
    public $role;
    public $is_active;
    public $created_at;
    public $updated_at;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Créer un utilisateur
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " (email, password, first_name, last_name, phone, role) 
                  VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer les données
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = password_hash($this->password, PASSWORD_DEFAULT); // Hashage du mot de passe
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->role = htmlspecialchars(strip_tags($this->role));
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->email);
        $stmt->bindParam(2, $this->password);
        $stmt->bindParam(3, $this->first_name);
        $stmt->bindParam(4, $this->last_name);
        $stmt->bindParam(5, $this->phone);
        $stmt->bindParam(6, $this->role);
        
        // Exécuter la requête
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        
        return false;
    }
    
    // Vérifier si un email existe déjà
    public function emailExists() {
        $query = "SELECT id, email, password, first_name, last_name, phone, role, is_active 
                FROM " . $this->table_name . " 
                WHERE email = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $this->id = $row['id'];
            $this->email = $row['email'];
            $this->password = $row['password']; // Mot de passe hashé
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->phone = $row['phone'];
            $this->role = $row['role'];
            $this->is_active = $row['is_active'];
            
            return true;
        }
        
        return false;
    }
    
    // Lire un utilisateur
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->email = $row['email'];
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->phone = $row['phone'];
            $this->role = $row['role'];
            $this->is_active = $row['is_active'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            
            return true;
        }
        
        return false;
    }
    
    // Mettre à jour un utilisateur
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET first_name = ?, last_name = ?, phone = ? 
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer les données
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->first_name);
        $stmt->bindParam(2, $this->last_name);
        $stmt->bindParam(3, $this->phone);
        $stmt->bindParam(4, $this->id);
        
        // Exécuter la requête
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Changer le mot de passe
    public function updatePassword() {
        $query = "UPDATE " . $this->table_name . " SET password = ? WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Hasher le nouveau mot de passe
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->password);
        $stmt->bindParam(2, $this->id);
        
        // Exécuter la requête
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Mettre à jour le rôle d'un utilisateur (admin seulement)
    public function updateRole() {
        $query = "UPDATE " . $this->table_name . " SET role = ? WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer les données
        $this->role = htmlspecialchars(strip_tags($this->role));
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->role);
        $stmt->bindParam(2, $this->id);
        
        // Exécuter la requête
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Activer/désactiver un utilisateur (admin seulement)
    public function toggleActive() {
        $query = "UPDATE " . $this->table_name . " SET is_active = ? WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        // Lier les paramètres
        $stmt->bindParam(1, $this->is_active);
        $stmt->bindParam(2, $this->id);
        
        // Exécuter la requête
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Lire tous les utilisateurs (admin seulement)
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }
}
