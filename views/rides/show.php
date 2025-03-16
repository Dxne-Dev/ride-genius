
<?php 
$pageTitle = "Détails du trajet";
ob_start(); 
?>

<div class="mb-3">
    <a href="index.php?page=rides" class="btn btn-outline-secondary">
        <i class="fas fa-arrow-left me-2"></i> Retour aux trajets
    </a>
</div>

<div class="card mb-4">
    <div class="card-header bg-primary text-white">
        <h2 class="mb-0">
            <?php echo htmlspecialchars($this->ride->departure); ?> → <?php echo htmlspecialchars($this->ride->destination); ?>
        </h2>
    </div>
    <div class="card-body">
        <div class="row">
            <div class="col-md-8">
                <h4 class="mb-4">Détails du trajet</h4>
                
                <div class="mb-3 row">
                    <div class="col-md-4 fw-bold">Date et heure</div>
                    <div class="col-md-8"><?php echo formatDate($this->ride->departure_time); ?></div>
                </div>
                
                <div class="mb-3 row">
                    <div class="col-md-4 fw-bold">Départ</div>
                    <div class="col-md-8"><?php echo htmlspecialchars($this->ride->departure); ?></div>
                </div>
                
                <div class="mb-3 row">
                    <div class="col-md-4 fw-bold">Destination</div>
                    <div class="col-md-8"><?php echo htmlspecialchars($this->ride->destination); ?></div>
                </div>
                
                <div class="mb-3 row">
                    <div class="col-md-4 fw-bold">Prix</div>
                    <div class="col-md-8"><?php echo htmlspecialchars($this->ride->price); ?> €</div>
                </div>
                
                <div class="mb-3 row">
                    <div class="col-md-4 fw-bold">Places disponibles</div>
                    <div class="col-md-8"><?php echo htmlspecialchars($this->ride->available_seats); ?></div>
                </div>
                
                <?php if(!empty($this->ride->description)): ?>
                    <div class="mb-3 row">
                        <div class="col-md-4 fw-bold">Description</div>
                        <div class="col-md-8"><?php echo nl2br(htmlspecialchars($this->ride->description)); ?></div>
                    </div>
                <?php endif; ?>
            </div>
            
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Conducteur</h5>
                    </div>
                    <div class="card-body text-center">
                        <div class="mb-3">
                            <i class="fas fa-user-circle fa-5x text-primary"></i>
                        </div>
                        <h5><?php echo htmlspecialchars($this->ride->driver_name); ?></h5>
                    </div>
                </div>
                
                <?php if(isset($_SESSION['user_id']) && $_SESSION['user_id'] != $this->ride->driver_id && !$has_booked && $this->ride->available_seats > 0 && $this->ride->status === 'active'): ?>
                    <div class="mt-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Réserver ce trajet</h5>
                            </div>
                            <div class="card-body">
                                <form action="index.php?page=book-ride" method="post">
                                    <input type="hidden" name="ride_id" value="<?php echo $this->ride->id; ?>">
                                    
                                    <div class="mb-3">
                                        <label for="seats" class="form-label">Nombre de places</label>
                                        <select class="form-select" id="seats" name="seats">
                                            <?php for($i = 1; $i <= min(5, $this->ride->available_seats); $i++): ?>
                                                <option value="<?php echo $i; ?>"><?php echo $i; ?></option>
                                            <?php endfor; ?>
                                        </select>
                                    </div>
                                    
                                    <div class="d-grid">
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-ticket-alt me-2"></i> Réserver
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                <?php elseif($has_booked): ?>
                    <div class="alert alert-success mt-4">
                        <i class="fas fa-check-circle me-2"></i> Vous avez déjà réservé ce trajet. 
                        <a href="index.php?page=bookings" class="alert-link">Voir mes réservations</a>
                    </div>
                <?php elseif($this->ride->available_seats <= 0): ?>
                    <div class="alert alert-warning mt-4">
                        <i class="fas fa-exclamation-triangle me-2"></i> Ce trajet est complet.
                    </div>
                <?php elseif($this->ride->status !== 'active'): ?>
                    <div class="alert alert-danger mt-4">
                        <i class="fas fa-times-circle me-2"></i> Ce trajet n'est plus disponible.
                    </div>
                <?php endif; ?>
                
                <?php if(isset($_SESSION['user_id']) && $_SESSION['user_id'] == $this->ride->driver_id): ?>
                    <div class="d-grid gap-2 mt-4">
                        <a href="index.php?page=edit-ride&id=<?php echo $this->ride->id; ?>" class="btn btn-outline-primary">
                            <i class="fas fa-edit me-2"></i> Modifier
                        </a>
                        <a href="index.php?page=ride-bookings&id=<?php echo $this->ride->id; ?>" class="btn btn-outline-primary">
                            <i class="fas fa-list me-2"></i> Voir les réservations
                        </a>
                        <?php if($this->ride->status === 'active'): ?>
                            <a href="index.php?page=cancel-ride&id=<?php echo $this->ride->id; ?>" class="btn btn-outline-danger" 
                               onclick="return confirm('Êtes-vous sûr de vouloir annuler ce trajet ?');">
                                <i class="fas fa-times me-2"></i> Annuler le trajet
                            </a>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php
$content = ob_get_clean();
include 'views/layout.php';
?>
