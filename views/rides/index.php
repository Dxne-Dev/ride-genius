
<?php 
$pageTitle = "Trajets disponibles";
ob_start(); 
?>

<h1 class="mb-4">Trajets disponibles</h1>

<div class="card mb-4">
    <div class="card-body">
        <h5 class="card-title">Rechercher un trajet</h5>
        <form action="index.php" method="get" class="row g-3">
            <input type="hidden" name="page" value="search-rides">
            
            <div class="col-md-4">
                <label for="departure" class="form-label">Ville de départ</label>
                <input type="text" class="form-control" id="departure" name="departure" placeholder="Ex: Paris">
            </div>
            
            <div class="col-md-4">
                <label for="destination" class="form-label">Ville d'arrivée</label>
                <input type="text" class="form-control" id="destination" name="destination" placeholder="Ex: Lyon">
            </div>
            
            <div class="col-md-3">
                <label for="date" class="form-label">Date</label>
                <input type="date" class="form-control" id="date" name="date">
            </div>
            
            <div class="col-md-1 d-flex align-items-end">
                <button type="submit" class="btn btn-primary w-100">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </form>
    </div>
</div>

<?php if($rides->rowCount() > 0): ?>
    <div class="row">
        <?php while($ride = $rides->fetch(PDO::FETCH_ASSOC)): ?>
            <div class="col-md-6 mb-4">
                <div class="card ride-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="card-title mb-0"><?php echo htmlspecialchars($ride['departure']); ?> → <?php echo htmlspecialchars($ride['destination']); ?></h5>
                            <span class="badge bg-primary"><?php echo htmlspecialchars($ride['price']); ?> €</span>
                        </div>
                        
                        <p class="card-text">
                            <i class="fas fa-calendar-alt me-2"></i> <?php echo formatDate($ride['departure_time']); ?><br>
                            <i class="fas fa-user me-2"></i> <?php echo htmlspecialchars($ride['driver_name']); ?><br>
                            <i class="fas fa-chair me-2"></i> <?php echo htmlspecialchars($ride['available_seats']); ?> place(s) disponible(s)
                        </p>
                        
                        <?php if(!empty($ride['description'])): ?>
                            <p class="card-text"><small><?php echo htmlspecialchars($ride['description']); ?></small></p>
                        <?php endif; ?>
                        
                        <div class="d-grid">
                            <a href="index.php?page=ride&id=<?php echo $ride['id']; ?>" class="btn btn-outline-primary">
                                Voir les détails
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        <?php endwhile; ?>
    </div>
<?php else: ?>
    <div class="alert alert-info">
        Aucun trajet disponible pour le moment. Revenez plus tard ou modifiez vos critères de recherche.
    </div>
<?php endif; ?>

<?php
$content = ob_get_clean();
include 'views/layout.php';
?>
