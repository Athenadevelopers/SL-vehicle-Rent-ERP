<?php 
$title = 'Vehicles - SL Vehicle Rental ERP';
require_once __DIR__ . '/../../src/Services/VehicleService.php';

use App\Services\VehicleService;

$vehicleService = new VehicleService();
$vehicles = $vehicleService->getAllVehicles();
?>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Vehicle Management</h1>
    <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addVehicleModal">
            <i class="bi bi-plus-lg"></i> Add Vehicle
        </button>
    </div>
</div>

<?php if (isset($_SESSION['success'])): ?>
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <?= $_SESSION['success']; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <?php unset($_SESSION['success']); ?>
<?php endif; ?>

<?php if (isset($_SESSION['error'])): ?>
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <?= $_SESSION['error']; ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <?php unset($_SESSION['error']); ?>
<?php endif; ?>

<div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Vehicle List</h6>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-bordered datatable" width="100%" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>License Plate</th>
                        <th>Daily Rate</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($vehicles as $vehicle): ?>
                        <tr>
                            <td><?= $vehicle['id'] ?></td>
                            <td>
                                <?php if (isset($vehicle['imageUrl'])): ?>
                                    <img src="<?= $vehicle['imageUrl'] ?>" alt="<?= $vehicle['name'] ?>" width="50" height="30">
                                <?php else: ?>
                                    <img src="/assets/images/car-placeholder.jpg" alt="No Image" width="50" height="30">
                                <?php endif; ?>
                            </td>
                            <td><?= $vehicle['name'] ?></td>
                            <td><?= $vehicle['type'] ?></td>
                            <td><?= $vehicle['licensePlate'] ?></td>
                            <td>Rs. <?= number_format($vehicle['dailyRate']) ?></td>
                            <td>
                                <?php if ($vehicle['status'] === 'available'): ?>
                                    <span class="badge bg-success">Available</span>
                                <?php elseif ($vehicle['status'] === 'rented'): ?>
                                    <span class="badge bg-warning">Rented</span>
                                <?php elseif ($vehicle['status'] === 'maintenance'): ?>
                                    <span class="badge bg-danger">Maintenance</span>
                                <?php else: ?>
                                    <span class="badge bg-secondary"><?= ucfirst($vehicle['status']) ?></span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#viewVehicleModal" data-id="<?= $vehicle['id'] ?>">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#editVehicleModal" data-id="<?= $vehicle['id'] ?>">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteVehicleModal" data-id="<?= $vehicle['id'] ?>">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add Vehicle Modal -->
<div class="modal fade" id="addVehicleModal" tabindex="-1" aria-labelledby="addVehicleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addVehicleModalLabel">Add New Vehicle</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="addVehicleForm" action="/api/vehicles" method="post" enctype="multipart/form-data">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="name" class="form-label">Vehicle Name</label>
                                <input type="text" class="form-control" id="name" name="name" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="type" class="form-label">Vehicle Type</label>
                                <select class="form-select" id="type" name="type" required>
                                    <option value="">Select Type</option>
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                    <option value="van">Van</option>
                                    <option value="hatchback">Hatchback</option>
                                    <option value="motorcycle">Motorcycle</option>
                                    <option value="tuk-tuk">Tuk-Tuk</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="make" class="form-label">Make</label>
                                <input type="text" class="form-control" id="make" name="make" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="model" class="form-label">Model</label>
                                <input type="text" class="form-control" id="model" name="model" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="year" class="form-label">Year</label>
                                <input type="number" class="form-control" id="year" name="year" min="1990" max="2030" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="licensePlate" class="form-label">License Plate</label>
                                <input type="text" class="form-control" id="licensePlate" name="licensePlate" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="dailyRate" class="form-label">Daily Rate (Rs.)</label>
                                <input type="number" class="form-control" id="dailyRate" name="dailyRate" min="0" step="100" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="status" class="form-label">Status</label>
                                <select class="form-select" id="status" name="status" required>
                                    <option value="available">Available</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="rented">Rented</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="image" class="form-label">Vehicle Image</label>
                        <input type="file" class="form-control" id="image" name="image">
                    </div>
                    
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea class="form-control" id="description" name="description" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="addVehicleForm" class="btn btn-primary">Add Vehicle</button>
            </div>
        </div>
    </div>
</div>

<!-- Edit Vehicle Modal -->
<div class="modal fade" id="editVehicleModal" tabindex="-1" aria-labelledby="editVehicleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editVehicleModalLabel">Edit Vehicle</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editVehicleForm" action="/api/vehicles" method="post" enctype="multipart/form-data">
                    <input type="hidden" id="edit_id" name="id">
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_name" class="form-label">Vehicle Name</label>
                                <input type="text" class="form-control" id="edit_name" name="name" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_type" class="form-label">Vehicle Type</label>
                                <select class="form-select" id="edit_type" name="type" required>
                                    <option value="">Select Type</option>
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                    <option value="van">Van</option>
                                    <option value="hatchback">Hatchback</option>
                                    <option value="motorcycle">Motorcycle</option>
                                    <option value="tuk-tuk">Tuk-Tuk</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_make" class="form-label">Make</label>
                                <input type="text" class="form-control" id="edit_make" name="make" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_model" class="form-label">Model</label>
                                <input type="text" class="form-control" id="edit_model" name="model" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_year" class="form-label">Year</label>
                                <input type="number" class="form-control" id="edit_year" name="year" min="1990" max="2030" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_licensePlate" class="form-label">License Plate</label>
                                <input type="text" class="form-control" id="edit_licensePlate" name="licensePlate" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_dailyRate" class="form-label">Daily Rate (Rs.)</label>
                                <input type="number" class="form-control" id="edit_dailyRate" name="dailyRate" min="0" step="100" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_status" class="form-label">Status</label>
                                <select class="form-select" id="edit_status" name="status" required>
                                    <option value="available">Available</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="rented">Rented</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="edit_image" class="form-label">Vehicle Image</label>
                        <input type="file" class="form-control" id="edit_image" name="image">
                        <div id="current_image_container" class="mt-2"></div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="edit_description" class="form-label">Description</label>
                        <textarea class="form-control" id="edit_description" name="description" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="editVehicleForm" class="btn btn-primary">Update Vehicle</button>
            </div>
        </div>
    </div>
</div>

<!-- View Vehicle Modal -->
<div class="modal fade" id="viewVehicleModal" tabindex="-1" aria-labelledby="viewVehicleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="viewVehicleModalLabel">Vehicle Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <div id="vehicle_image" class="mb-3 text-center"></div>
                    </div>
                    <div class="col-md-6">
                        <h4 id="vehicle_name"></h4>
                        <p id="vehicle_make_model"></p>
                        <p id="vehicle_license"></p>
                        <p id="vehicle_rate"></p>
                        <p id="vehicle_status"></p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h5>Description</h5>
                        <p id="vehicle_description"></p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h5>Maintenance History</h5>
                        <div id="maintenance_history">
                            <p>No maintenance records found.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<!-- Delete Vehicle Modal -->
<div class="modal fade" id="deleteVehicleModal" tabindex="-1" aria-labelledby="deleteVehicleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteVehicleModalLabel">Delete Vehicle</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete this vehicle? This action cannot be undone.</p>
                <form id="deleteVehicleForm" action="/api/vehicles/delete" method="post">
                    <input type="hidden" id="delete_id" name="id">
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="deleteVehicleForm" class="btn btn-danger">Delete</button>
            </div>
        </div>
    </div>
</div>

<script>
// Handle view vehicle modal
document.querySelectorAll('[data-bs-target="#viewVehicleModal"]').forEach(button => {
    button.addEventListener('click', function() {
        const vehicleId = this.getAttribute('data-id');
        
        // In a real app, you would fetch the vehicle details from the server
        // For now, we'll use the data from the table
        const row = this.closest('tr');
        const name = row.querySelector('td:nth-child(3)').textContent;
        const type = row.querySelector('td:nth-child(4)').textContent;
        const licensePlate = row.querySelector('td:nth-child(5)').textContent;
        const dailyRate = row.querySelector('td:nth-child(6)').textContent;
        const status = row.querySelector('td:nth-child(7) .badge').textContent;
        const imageUrl = row.querySelector('td:nth-child(2) img').src;
        
        // Update the modal with the vehicle details
        document.getElementById('vehicle_name').textContent = name;
        document.getElementById('vehicle_make_model').textContent = `Type: ${type}`;
        document.getElementById('vehicle_license').textContent = `License Plate: ${licensePlate}`;
        document.getElementById('vehicle_rate').textContent = `Daily Rate: ${dailyRate}`;
        document.getElementById('vehicle_status').textContent = `Status: ${status}`;
        document.getElementById('vehicle_image').innerHTML = `<img src="${imageUrl}" alt="${name}" class="img-fluid">`;
        document.getElementById('vehicle_description').textContent = 'No description available.';
    });
});

// Handle edit vehicle modal
document.querySelectorAll('[data-bs-target="#editVehicleModal"]').forEach(button => {
    button.addEventListener('click', function() {
        const vehicleId = this.getAttribute('data-id');
        
        // In a real app, you would fetch the vehicle details from the server
        // For now, we'll use the data from the table
        const row = this.closest('tr');
        const name = row.querySelector('td:nth-child(3)').textContent;
        const type = row.querySelector('td:nth-child(4)').textContent;
        const licensePlate = row.querySelector('td:nth-child(5)').textContent;
        const dailyRate = row.querySelector('td:nth-child(6)').textContent.replace('Rs. ', '').replace(',', '');
        const status = row.querySelector('td:nth-child(7) .badge').textContent.toLowerCase();
        const imageUrl = row.querySelector('td:nth-child(2) img').src;
        
        // Update the form with the vehicle details
        document.getElementById('edit_id').value = vehicleId;
        document.getElementById('edit_name').value = name;
        document.getElementById('edit_type').value = type.toLowerCase();
        document.getElementById('edit_licensePlate').value = licensePlate;
        document.getElementById('edit_dailyRate').value = dailyRate;
        document.getElementById('edit_status').value = status;
        
        // Show the current image
        document.getElementById('current_image_container').innerHTML = `
            <img src="${imageUrl}" alt="${name}" width="100" height="60" class="img-thumbnail">
            <p class="small text-muted mt-1">Current image</p>
        `;
        
        // Set default values for other fields
        document.getElementById('edit_make').value = 'Toyota';
        document.getElementById('edit_model').value = 'Corolla';
        document.getElementById('edit_year').value = '2020';
        document.getElementById('edit_description').value = 'Well-maintained vehicle in excellent condition.';
    });
});

// Handle delete vehicle modal
document.querySelectorAll('[data-bs-target="#deleteVehicleModal"]').forEach(button => {
    button.addEventListener('click', function() {
        const vehicleId = this.getAttribute('data-id');
        document.getElementById('delete_id').value = vehicleId;
    });
});
</script>
