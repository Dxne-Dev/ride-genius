
<?php
// Paramètres globaux de l'application
session_start();

// Définir des constantes pour les chemins
define('ROOT_PATH', dirname(__DIR__) . '/');
define('URL_ROOT', 'http://localhost/Ride-Genius/');

// Fuseau horaire
date_default_timezone_set('Europe/Paris');

// Fonction pour formater les dates
function formatDate($date, $format = 'd/m/Y à H:i') {
    return date($format, strtotime($date));
}

// Fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Fonction pour vérifier le rôle de l'utilisateur
function hasRole($role) {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === $role;
}

// Fonction pour rediriger
function redirect($page) {
    header("Location: index.php?page={$page}");
    exit();
}

// Fonction pour afficher une alerte
function displayAlert() {
    if (isset($_SESSION['success'])) {
        echo '<div class="alert alert-success">' . $_SESSION['success'] . '</div>';
        unset($_SESSION['success']);
    }
    
    if (isset($_SESSION['error'])) {
        echo '<div class="alert alert-danger">' . $_SESSION['error'] . '</div>';
        unset($_SESSION['error']);
    }
}
