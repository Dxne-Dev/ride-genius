
<?php 
$pageTitle = "Page non trouvée";
ob_start(); 
?>

<div class="text-center my-5">
    <h1 class="display-1">404</h1>
    <p class="lead">Page non trouvée</p>
    <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
    <a href="index.php" class="btn btn-primary">Retour à l'accueil</a>
</div>

<?php
$content = ob_get_clean();
include 'views/layout.php';
?>
