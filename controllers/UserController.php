
<?php
require_once 'models/User.php';
require_once 'config/Database.php';

class UserController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    // Afficher le formulaire d'inscription
    public function registerForm() {
        // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
        if(isset($_SESSION['user_id'])) {
            redirect('home');
        }
        
        include "views/users/register.php";
    }

    // Traiter l'inscription
    public function register() {
        // Vérifier si le formulaire a été soumis
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            redirect('register');
        }

        // Vérifier les champs requis
        if(empty($_POST['email']) || empty($_POST['password']) || empty($_POST['first_name']) || 
           empty($_POST['last_name']) || empty($_POST['phone']) || empty($_POST['role'])) {
            $_SESSION['error'] = "Tous les champs sont obligatoires";
            redirect('register');
        }

        // Vérifier si les mots de passe correspondent
        if($_POST['password'] !== $_POST['confirm_password']) {
            $_SESSION['error'] = "Les mots de passe ne correspondent pas";
            redirect('register');
        }

        // Vérifier que le rôle est valide
        $valid_roles = ['passager', 'conducteur'];
        if(!in_array($_POST['role'], $valid_roles)) {
            $_SESSION['error'] = "Rôle invalide";
            redirect('register');
        }

        // Vérifier si l'email existe déjà
        $this->user->email = $_POST['email'];
        if($this->user->emailExists()) {
            $_SESSION['error'] = "Cet email est déjà utilisé";
            redirect('register');
        }

        // Assigner les valeurs
        $this->user->password = $_POST['password'];
        $this->user->first_name = $_POST['first_name'];
        $this->user->last_name = $_POST['last_name'];
        $this->user->phone = $_POST['phone'];
        $this->user->role = $_POST['role'];

        // Créer l'utilisateur
        if($this->user->create()) {
            $_SESSION['success'] = "Inscription réussie ! Vous pouvez maintenant vous connecter";
            redirect('login');
        } else {
            $_SESSION['error'] = "Une erreur est survenue lors de l'inscription";
            redirect('register');
        }
    }

    // Afficher le formulaire de connexion
    public function loginForm() {
        // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
        if(isset($_SESSION['user_id'])) {
            redirect('home');
        }
        
        include "views/users/login.php";
    }

    // Traiter la connexion
    public function login() {
        // Vérifier si le formulaire a été soumis
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            redirect('login');
        }

        // Vérifier les champs requis
        if(empty($_POST['email']) || empty($_POST['password'])) {
            $_SESSION['error'] = "Email et mot de passe requis";
            redirect('login');
        }

        // Vérifier si l'email existe
        $this->user->email = $_POST['email'];
        if(!$this->user->emailExists()) {
            $_SESSION['error'] = "Email ou mot de passe incorrect";
            redirect('login');
        }

        // Vérifier si le compte est actif
        if(!$this->user->is_active) {
            $_SESSION['error'] = "Votre compte est désactivé. Contactez l'administrateur";
            redirect('login');
        }

        // Vérifier le mot de passe
        if(password_verify($_POST['password'], $this->user->password)) {
            // Démarrer la session
            $_SESSION['user_id'] = $this->user->id;
            $_SESSION['user_name'] = $this->user->first_name . ' ' . $this->user->last_name;
            $_SESSION['user_role'] = $this->user->role;

            $_SESSION['success'] = "Connexion réussie";
            
            // Rediriger selon le rôle
            if($this->user->role === 'admin') {
                redirect('admin');
            } else {
                redirect('home');
            }
        } else {
            $_SESSION['error'] = "Email ou mot de passe incorrect";
            redirect('login');
        }
    }

    // Déconnexion
    public function logout() {
        // Détruire la session
        session_destroy();
        
        // Rediriger vers la page de connexion
        header("Location: index.php?page=login");
        exit();
    }

    // Afficher le profil
    public function profile() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour accéder à votre profil";
            redirect('login');
        }

        $this->user->id = $_SESSION['user_id'];
        $this->user->readOne();

        include "views/users/profile.php";
    }

    // Mettre à jour le profil
    public function updateProfile() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour mettre à jour votre profil";
            redirect('login');
        }

        // Vérifier si le formulaire a été soumis
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            redirect('profile');
        }

        // Vérifier les champs requis
        if(empty($_POST['first_name']) || empty($_POST['last_name']) || empty($_POST['phone'])) {
            $_SESSION['error'] = "Tous les champs sont obligatoires";
            redirect('profile');
        }

        // Assigner les valeurs
        $this->user->id = $_SESSION['user_id'];
        $this->user->first_name = $_POST['first_name'];
        $this->user->last_name = $_POST['last_name'];
        $this->user->phone = $_POST['phone'];

        // Mettre à jour le profil
        if($this->user->update()) {
            $_SESSION['user_name'] = $this->user->first_name . ' ' . $this->user->last_name;
            $_SESSION['success'] = "Profil mis à jour avec succès";
        } else {
            $_SESSION['error'] = "Une erreur est survenue lors de la mise à jour du profil";
        }

        redirect('profile');
    }

    // Afficher le formulaire de changement de mot de passe
    public function changePasswordForm() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour changer votre mot de passe";
            redirect('login');
        }

        include "views/users/change_password.php";
    }

    // Changer le mot de passe
    public function changePassword() {
        // Vérifier si l'utilisateur est connecté
        if(!isset($_SESSION['user_id'])) {
            $_SESSION['error'] = "Vous devez être connecté pour changer votre mot de passe";
            redirect('login');
        }

        // Vérifier si le formulaire a été soumis
        if($_SERVER['REQUEST_METHOD'] !== 'POST') {
            redirect('change-password');
        }

        // Vérifier les champs requis
        if(empty($_POST['current_password']) || empty($_POST['new_password']) || empty($_POST['confirm_password'])) {
            $_SESSION['error'] = "Tous les champs sont obligatoires";
            redirect('change-password');
        }

        // Vérifier si les nouveaux mots de passe correspondent
        if($_POST['new_password'] !== $_POST['confirm_password']) {
            $_SESSION['error'] = "Les nouveaux mots de passe ne correspondent pas";
            redirect('change-password');
        }

        // Récupérer l'utilisateur
        $this->user->id = $_SESSION['user_id'];
        $this->user->readOne();

        // Vérifier l'ancien mot de passe
        if(!password_verify($_POST['current_password'], $this->user->password)) {
            $_SESSION['error'] = "Mot de passe actuel incorrect";
            redirect('change-password');
        }

        // Assigner le nouveau mot de passe
        $this->user->password = $_POST['new_password'];

        // Mettre à jour le mot de passe
        if($this->user->updatePassword()) {
            $_SESSION['success'] = "Mot de passe changé avec succès";
            redirect('profile');
        } else {
            $_SESSION['error'] = "Une erreur est survenue lors du changement de mot de passe";
            redirect('change-password');
        }
    }
}
