
<?php
// Inclure les fichiers de configuration
require_once 'config/config.php';

// Déterminer la page demandée
$page = isset($_GET['page']) ? $_GET['page'] : 'home';

// Contrôleurs
require_once 'controllers/UserController.php';
require_once 'controllers/RideController.php';
require_once 'controllers/BookingController.php';
require_once 'controllers/ReviewController.php';

// Instancier les contrôleurs
$userController = new UserController();
$rideController = new RideController();
$bookingController = new BookingController();
$reviewController = new ReviewController();

// Router les requêtes vers les contrôleurs appropriés
switch($page) {
    // Pages générales
    case 'home':
        include 'views/home.php';
        break;
    
    // Utilisateurs
    case 'register':
        $userController->registerForm();
        break;
    case 'register-process':
        $userController->register();
        break;
    case 'login':
        $userController->loginForm();
        break;
    case 'login-process':
        $userController->login();
        break;
    case 'logout':
        $userController->logout();
        break;
    case 'profile':
        $userController->profile();
        break;
    case 'update-profile':
        $userController->updateProfile();
        break;
    case 'change-password':
        $userController->changePasswordForm();
        break;
    case 'change-password-process':
        $userController->changePassword();
        break;
    
    // Trajets
    case 'rides':
        $rideController->index();
        break;
    case 'ride':
        $rideController->show();
        break;
    case 'create-ride':
        $rideController->createForm();
        break;
    case 'create-ride-process':
        $rideController->create();
        break;
    case 'edit-ride':
        $rideController->editForm();
        break;
    case 'update-ride':
        $rideController->update();
        break;
    case 'cancel-ride':
        $rideController->cancel();
        break;
    case 'my-rides':
        $rideController->myRides();
        break;
    case 'search-rides':
        $rideController->search();
        break;
    
    // Réservations
    case 'book-ride':
        $bookingController->create();
        break;
    case 'bookings':
        $bookingController->myBookings();
        break;
    case 'cancel-booking':
        $bookingController->cancel();
        break;
    case 'ride-bookings':
        $bookingController->rideBookings();
        break;
    case 'booking':
        $bookingController->show();
        break;
    case 'update-booking-status':
        $bookingController->updateStatus();
        break;
    
    // Avis
    case 'add-review':
        $reviewController->createForm();
        break;
    case 'create-review':
        $reviewController->create();
        break;
    case 'my-reviews':
        $reviewController->myReviews();
        break;
    
    // Page d'erreur
    default:
        include 'views/404.php';
        break;
}
