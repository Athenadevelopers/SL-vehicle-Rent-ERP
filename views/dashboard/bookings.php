<?php 
$title = 'Bookings - SL Vehicle Rental ERP';
require_once __DIR__ . '/../../src/Services/BookingService.php';
require_once __DIR__ . '/../../src/Services/VehicleService.php';
require_once __DIR__ . '/../../src/Services/CustomerService.php';

use App\Services\BookingService;
use App\Services\VehicleService;
use App\Services\CustomerService;

$bookingService = new BookingService();
$vehicleService = new VehicleService();
$customerService = new CustomerService();

$bookings = $bookingService->getAllBookings();
$availableVehicles = $vehicleService->getAvailableVehicles();
$customers = $customerService->getAllCustomers();
?>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Booking Management</h1>
    <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addBookingModal">
            <i class="bi bi-plus-lg"></i> New Booking
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
        <h6 class="m-0 font-weight-bold text-primary">Booking List</h6>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-bordered datatable" width="100%" cellspacing="0">
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Vehicle</th>
                        <th>Pickup Date</th>
                        <th>Return Date</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($bookings as $booking): ?>
                        <tr>
                            <td><?= $booking['id'] ?? $booking['bookingId'] ?? '-' ?></td>
                            <td><?= $booking['customerName'] ?? '-' ?></td>
                            <td><?= $booking['vehicleName'] ?? '-' ?></td>
                            <td><?= $booking['pickupDate'] instanceof \Google\Cloud\Core\Timestamp ? $booking['pickupDate']->get()->format('Y-m-d') : '-' ?></td>
                            <td><?= $booking['returnDate'] instanceof \Google\Cloud\Core\Timestamp ? $booking['returnDate']->get()->format('Y-m-d') : '-' ?></td>
                            <td>Rs. <?= number_format($booking['totalAmount'] ?? 0) ?></td>
                            <td>
                                <?php if ($booking['status'] === 'pending'): ?>
                                    <span class="badge bg-warning">Pending</span>
                                <?php elseif ($booking['status'] === 'active'): ?>
                                    <span class="badge bg-success">Active</span>
                                <?php elseif ($booking['status'] === 'completed'): ?>
                                    <span class="badge bg-primary">Completed</span>
                                <?php elseif ($booking['status'] === 'cancelled'): ?>
                                    <span class="badge bg-danger">Cancelled</span>
                                <?php else: ?>
                                    <span class="badge bg-secondary"><?= ucfirst($booking['status'] ?? 'Unknown') ?></span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#viewBookingModal" data-id="<?= $booking['id'] ?>">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#editBookingModal" data-id="<?= $booking['id'] ?>">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteBookingModal" data-id="<?= $booking['id'] ?>">
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

<!-- Add Booking Modal -->
<div class="modal fade" id="addBookingModal" tabindex="-1" aria-labelledby="addBookingModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addBookingModalLabel">New Booking</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="addBookingForm" action="/api/bookings" method="post">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="customerId" class="form-label">Customer</label>
                                <select class="form-select" id="customerId" name="customerId" required>
                                    <option value="">Select Customer</option>
                                    <?php foreach ($customers as $customer): ?>
                                        <option value="<?= $customer['id'] ?>"><?= $customer['name'] ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="vehicleId" class="form-label">Vehicle</label>
                                <select class="form-select" id="vehicleId" name="vehicleId" required>
                                    <option value="">Select Vehicle</option>
                                    <?php foreach ($availableVehicles as $vehicle): ?>
                                        <option value="<?= $vehicle['id'] ?>" data-rate="<?= $vehicle['dailyRate'] ?>"><?= $vehicle['name'] ?> (<?= $vehicle['licensePlate'] ?>)</option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="pickupDate" class="form-label">Pickup Date</label>
                                <input type="date" class="form-control datepicker" id="pickupDate" name="pickupDate" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="returnDate" class="form-label">Return Date</label>
                                <input type="date" class="form-control datepicker" id="returnDate" name="returnDate" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="paymentType" class="form-label">Payment Type</label>
                                <select class="form-select" id="paymentType" name="paymentType" required>
                                    <option value="advance">Advance Payment</option>
                                    <option value="total">Full Payment</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="advanceAmount" class="form-label">Advance Amount (Rs.)</label>
                                <input type="number" class="form-control" id="advanceAmount" name="advanceAmount" min="0" step="100">
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="totalDays" class="form-label">Total Days</label>
                                <input type="number" class="form-control" id="totalDays" name="totalDays" readonly>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="totalAmount" class="form-label">Total Amount (Rs.)</label>
                                <input type="number" class="form-control" id="totalAmount" name="totalAmount" readonly>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="notes" class="form-label">Notes</label>
                        <textarea class="form-control" id="notes" name="notes" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="addBookingForm" class="btn btn-primary">Create Booking</button>
            </div>
        </div>
    </div>
</div>

<!-- Edit Booking Modal -->
<div class="modal fade" id="editBookingModal" tabindex="-1" aria-labelledby="editBookingModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editBookingModalLabel">Edit Booking</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editBookingForm" action="/api/bookings" method="post">
                    <input type="hidden" id="edit_id" name="id">
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_status" class="form-label">Status</label>
                                <select class="form-select" id="edit_status" name="status" required>
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_paymentStatus" class="form-label">Payment Status</label>
                                <select class="form-select" id="edit_paymentStatus" name="paymentStatus" required>
                                    <option value="unpaid">Unpaid</option>
                                    <option value="partial">Partially Paid</option>
                                    <option value="paid">Fully Paid</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_pickupDate" class="form-label">Pickup Date</label>
                                <input type="date" class="form-control datepicker" id="edit_pickupDate" name="pickupDate" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_returnDate" class="form-label">Return Date</label>
                                <input type="date" class="form-control datepicker" id="edit_returnDate" name="returnDate" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_advanceAmount" class="form-label">Advance Amount (Rs.)</label>
                                <input type="number" class="form-control" id="edit_advanceAmount" name="advanceAmount" min="0" step="100">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="edit_totalAmount" class="form-label">Total Amount (Rs.)</label>
                                <input type="number" class="form-control" id="edit_totalAmount" name="totalAmount">
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="edit_notes" class="form-label">Notes</label>
                        <textarea class="form-control" id="edit_notes" name="notes" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="editBookingForm" class="btn btn-primary">Update Booking</button>
            </div>
        </div>
    </div>
</div>

<!-- View Booking Modal -->
<div class="modal fade" id="viewBookingModal" tabindex="-1" aria-labelledby="viewBookingModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="viewBookingModalLabel">Booking Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <h5>Booking Information</h5>
                        <p><strong>Booking ID:</strong> <span id="booking_id"></span></p>
                        <p><strong>Status:</strong> <span id="booking_status"></span></p>
                        <p><strong>Pickup Date:</strong> <span id="booking_pickup"></span></p>
                        <p><strong>Return Date:</strong> <span id="booking_return"></span></p>
                        <p><strong>Total Days:</strong> <span id="booking_days"></span></p>
                    </div>
                    <div class="col-md-6">
                        <h5>Payment Information</h5>
                        <p><strong>Total Amount:</strong> <span id="booking_amount"></span></p>
                        <p><strong>Advance Paid:</strong> <span id="booking_advance"></span></p>
                        <p><strong>Balance:</strong> <span id="booking_balance"></span></p>
                        <p><strong>Payment Status:</strong> <span id="booking_payment_status"></span></p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-6">
                        <h5>Customer Information</h5>
                        <p><strong>Name:</strong> <span id="customer_name"></span></p>
                        <p><strong>Phone:</strong> <span id="customer_phone"></span></p>
                        <p><strong>Email:</strong> <span id="customer_email"></span></p>
                    </div>
                    <div class="col-md-6">
                        <h5>Vehicle Information</h5>
                        <p><strong>Vehicle:</strong> <span id="vehicle_name"></span></p>
                        <p><strong>License Plate:</strong> <span id="vehicle_license"></span></p>
                        <p><strong>Daily Rate:</strong> <span id="vehicle_rate"></span></p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <h5>Notes</h5>
                        <p id="booking_notes"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="printInvoiceBtn">Print Invoice</button>
            </div>
        </div>
    </div>
</div>

<!-- Delete Booking Modal -->
<div class="modal fade" id="deleteBookingModal" tabindex="-1" aria-labelledby="deleteBookingModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="deleteBookingModalLabel">Delete Booking</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete this booking? This action cannot be undone.</p>
                <form id="deleteBookingForm" action="/api/bookings/delete" method="post">
                    <input type="hidden" id="delete_id" name="id">
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" form="deleteBookingForm" class="btn btn-danger">Delete</button>
            </div>
        </div>
    </div>
</div>

<script>
// Calculate total days and amount when dates change
document.getElementById('pickupDate').addEventListener('change', calculateTotal);
document.getElementById('returnDate').addEventListener('change', calculateTotal);
document.getElementById('vehicleId').addEventListener('change', calculateTotal);

function calculateTotal() {
    const pickupDate = document.getElementById('pickupDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const vehicleSelect = document.getElementById('vehicleId');
    
    if (pickupDate && returnDate && vehicleSelect.value) {
        const pickup = new Date(pickupDate);
        const returnD = new Date(returnDate);
        const diffTime = Math.abs(returnD - pickup);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        document.getElementById('totalDays').value = diffDays;
        
        const selectedOption = vehicleSelect.options[vehicleSelect.selectedIndex];
        const dailyRate = selectedOption.getAttribute('data-rate');
        const totalAmount = diffDays * dailyRate;
        
        document.getElementById('totalAmount').value = totalAmount;
    }
}

// Handle payment type change
document.getElementById('paymentType').addEventListener('change', function() {
    const advanceAmountField = document.getElementById('advanceAmount');
    
    if (this.value === 'total') {
        advanceAmountField.value = document.getElementById('totalAmount').value;
        advanceAmountField.readOnly = true;
    } else {
        advanceAmountField.value = '';
        advanceAmountField.readOnly = false;
    }
});

// Handle view booking modal
document.querySelectorAll('[data-bs-target="#viewBookingModal"]').forEach(button => {
    button.addEventListener('click', function() {
        const bookingId = this.getAttribute('data-id');
        
        // In a real app, you would fetch the booking details from the server
        // For now, we'll use the data from the table
        const row = this.closest('tr');
        const id = row.querySelector('td:nth-child(1)').textContent;
        const customer = row.querySelector('td:nth-child(2)').textContent;
        const vehicle = row.querySelector('td:nth-child(3)').textContent;
        const pickupDate = row.querySelector('td:nth-child(4)').textContent;
        const returnDate = row.querySelector('td:nth-child(5)').textContent;
        const totalAmount = row.querySelector('td:nth-child(6)').textContent;
        const status = row.querySelector('td:nth-child(7) .badge').textContent;
        
        // Update the modal with the booking details
        document.getElementById('booking_id').textContent = id;
        document.getElementById('booking_status').textContent = status;
        document.getElementById('booking_pickup').textContent = pickupDate;
        document.getElementById('booking_return').textContent = returnDate;
        
        // Calculate total days
        const pickup = new Date(pickupDate);
        const returnD = new Date(returnDate);
        const diffTime = Math.abs(returnD - pickup);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        document.getElementById('booking_days').textContent = diffDays;
        document.getElementById('booking_amount').textContent = totalAmount;
        
        // Set mock data for other fields
        document.getElementById('booking_advance').textContent = 'Rs. 5,000';
        document.getElementById('booking_balance').textContent = 'Rs. 10,000';
        document.getElementById('booking_payment_status').textContent = 'Partially Paid';
        document.getElementById('customer_name').textContent = customer;
        document.getElementById('customer_phone').textContent = '+94 77 123 4567';
        document.getElementById('customer_email').textContent = 'customer@example.com';
        document.getElementById('vehicle_name').textContent = vehicle;
        document.getElementById('vehicle_license').textContent = 'ABC-1234';
        document.getElementById('vehicle_rate').textContent = 'Rs. 5,000 per day';
        document.getElementById('booking_notes').textContent = 'Customer requested child seat and GPS navigation.';
    });
});

// Handle edit booking modal
document.querySelectorAll('[data-bs-target="#editBookingModal"]').forEach(button => {
    button.addEventListener('click', function() {
        const bookingId = this.getAttribute('data-id');
        
        // In a real app, you would fetch the booking details from the server
        // For now, we'll use the data from the table
        const row = this.closest('tr');
        const id = row.querySelector('td:nth-child(1)').textContent;
        const pickupDate = row.querySelector('td:nth-child(4)').textContent;
        const returnDate = row.querySelector('td:nth-child(5)').textContent;
        const totalAmount = row.querySelector('td:nth-child(6)').textContent.replace('Rs. ', '').replace(',', '');
        const status = row.querySelector('td:nth-child(7) .badge').textContent.toLowerCase();
        
        // Update the form with the booking details
        document.getElementById('edit_id').value = id;
        document.getElementById('edit_status').value = status;
        document.getElementById('edit_pickupDate').value = pickupDate;
        document.getElementById('edit_returnDate').value = returnDate;
        document.getElementById('edit_totalAmount').value = totalAmount;
        
        // Set mock data for other fields
        document.getElementById('edit_paymentStatus').value = 'partial';
        document.getElementById('edit_advanceAmount').value = '5000';
        document.getElementById('edit_notes').value = 'Customer requested child seat and GPS navigation.';
    });
});

// Handle delete booking modal
document.querySelectorAll('[data-bs-target="#deleteBookingModal"]').forEach(button => {
    button.addEventListener('click', function() {
        const bookingId = this.getAttribute('data-id');
        document.getElementById('delete_id').value = bookingId;
    });
});

// Handle print invoice button
document.getElementById('printInvoiceBtn').addEventListener('click', function() {
    const bookingId = document.getElementById('booking_id').textContent;
    window.open(`/invoice/${bookingId}`, '_blank');
});
</script>
