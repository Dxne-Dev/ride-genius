
<?php 
$pageTitle = "Accueil";
ob_start(); 
?>

<div class="row my-5">
    <div class="col-md-6">
        <h1 class="display-4">Bienvenue sur Ride Genius</h1>
        <p class="lead">La plateforme de covoiturage intelligente qui vous connecte avec d'autres voyageurs.</p>
        <hr class="my-4">
        <p>Economisez de l'argent, réduisez votre empreinte carbone et rencontrez de nouvelles personnes.</p>
        <div class="d-grid gap-2 d-md-flex">
            <a class="btn btn-primary btn-lg" href="index.php?page=rides" role="button">Trouver un trajet</a>
            <?php if(isset($_SESSION['user_id']) && $_SESSION['user_role'] === 'conducteur'): ?>
                <a class="btn btn-outline-primary btn-lg" href="index.php?page=create-ride" role="button">Proposer un trajet</a>
            <?php elseif(!isset($_SESSION['user_id'])): ?>
                <a class="btn btn-outline-primary btn-lg" href="index.php?page=register" role="button">S'inscrire</a>
            <?php endif; ?>
        </div>
    </div>
    <div class="col-md-6">
        <img src="https://source.unsplash.com/random/600x400/?carpool" alt="Covoiturage" class="img-fluid rounded shadow">
    </div>
</div>

<div class="row my-5">
    <div class="col-md-4">
        <div class="card h-100 text-center p-4">
            <div class="card-body">
                <i class="fas fa-money-bill-wave fa-3x mb-3 text-primary"></i>
                <h3 class="card-title">Économique</h3>
                <p class="card-text">Partagez les frais de transport et économisez de l'argent sur vos déplacements.</p>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card h-100 text-center p-4">
            <div class="card-body">
                <i class="fas fa-leaf fa-3x mb-3 text-primary"></i>
                <h3 class="card-title">Écologique</h3>
                <p class="card-text">Réduisez votre empreinte carbone en partageant votre véhicule avec d'autres voyageurs.</p>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card h-100 text-center p-4">
            <div class="card-body">
                <i class="fas fa-users fa-3x mb-3 text-primary"></i>
                <h3 class="card-title">Social</h3>
                <p class="card-text">Rencontrez de nouvelles personnes et rendez vos trajets plus agréables.</p>
            </div>
        </div>
    </div>
</div>

<div class="my-5">
    <h2 class="text-center mb-4">Comment ça marche ?</h2>
    <div class="row">
        <div class="col-md-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 60px; height: 60px;">
                        <span class="h4 mb-0">1</span>
                    </div>
                    <h4>Inscrivez-vous</h4>
                    <p>Créez votre compte gratuitement en quelques clics.</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 60px; height: 60px;">
                        <span class="h4 mb-0">2</span>
                    </div>
                    <h4>Recherchez</h4>
                    <p>Trouvez le trajet qui vous convient ou proposez le vôtre.</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 60px; height: 60px;">
                        <span class="h4 mb-0">3</span>
                    </div>
                    <h4>Réservez</h4>
                    <p>Réservez votre place en quelques clics et contactez le conducteur.</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card text-center h-100">
                <div class="card-body">
                    <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 60px; height: 60px;">
                        <span class="h4 mb-0">4</span>
                    </div>
                    <h4>Voyagez</h4>
                    <p>Profitez de votre trajet et évaluez votre expérience.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row my-5">
    <div class="col-12 text-center">
        <h2 class="mb-4">Prêt à commencer ?</h2>
        <a class="btn btn-primary btn-lg" href="index.php?page=register" role="button">S'inscrire maintenant</a>
    </div>
</div>

<?php
$content = ob_get_clean();
include 'views/layout.php';
?>
