
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ride Genius - <?php echo isset($pageTitle) ? $pageTitle : 'Covoiturage intelligent'; ?></title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Custom CSS -->
    <style>
        .navbar-brand {
            font-weight: bold;
            color: #4CAF50 !important;
        }
        
        .btn-primary {
            background-color: #4CAF50;
            border-color: #4CAF50;
        }
        
        .btn-primary:hover {
            background-color: #3e8e41;
            border-color: #3e8e41;
        }
        
        .alert {
            margin-top: 20px;
        }
        
        footer {
            margin-top: 50px;
            padding: 20px 0;
            background-color: #f8f9fa;
            text-align: center;
        }
        
        .ride-card {
            margin-bottom: 20px;
            transition: transform 0.3s;
        }
        
        .ride-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .rating {
            color: #FFD700;
        }
        
        .booking-status-pending {
            color: #FF9800;
        }
        
        .booking-status-accepted {
            color: #4CAF50;
        }
        
        .booking-status-rejected, .booking-status-cancelled {
            color: #F44336;
        }
        
        .booking-status-completed {
            color: #2196F3;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <a class="navbar-brand" href="index.php">Ride Genius</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.php">Accueil</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="index.php?page=rides">Trajets disponibles</a>
                    </li>
                    <?php if(isset($_SESSION['user_id'])): ?>
                        <?php if($_SESSION['user_role'] === 'conducteur'): ?>
                            <li class="nav-item">
                                <a class="nav-link" href="index.php?page=create-ride">Proposer un trajet</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="index.php?page=my-rides">Mes trajets</a>
                            </li>
                        <?php endif; ?>
                        <li class="nav-item">
                            <a class="nav-link" href="index.php?page=bookings">Mes réservations</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="index.php?page=my-reviews">Mes avis</a>
                        </li>
                    <?php endif; ?>
                </ul>
                <ul class="navbar-nav">
                    <?php if(isset($_SESSION['user_id'])): ?>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                                <i class="fas fa-user"></i> <?php echo $_SESSION['user_name']; ?>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="index.php?page=profile">Mon profil</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="index.php?page=logout">Déconnexion</a></li>
                            </ul>
                        </li>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="nav-link" href="index.php?page=login">Connexion</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="index.php?page=register">Inscription</a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Page Content -->
    <div class="container mt-4">
        <?php displayAlert(); ?>
        
        <?php echo $content; ?>
    </div>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> Ride Genius - Tous droits réservés</p>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
