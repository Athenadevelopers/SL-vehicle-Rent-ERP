<?php
namespace App\Services;

use App\Services\DatabaseService;
use App\Services\VehicleService;
use Google\Cloud\Core\Timestamp;

class BookingService {
    private $db;
    private $vehicleService;
    
    public function __construct() {
        $this->db = new DatabaseService();
        $this->vehicleService = new VehicleService();
    }
    
    /**
     * Get all bookings
     */
    public function getAllBookings(): array {
        return $this->db->getCollection('bookings');
    }
    
    /**
     * Get booking by ID
     */
    public function getBookingById(string $id): ?array {
        return $this->db->getDocument('bookings', $id);
    }
    
    /**
     * Add a new booking
     */
    public function addBooking(array $bookingData): ?string {
        // Generate a booking ID with B prefix and 5 digits
        $bookingId = 'B' . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
        $bookingData['id'] = $bookingId;
        
        // Calculate total days and amount
        $pickupDate = $bookingData['pickupDate']->get();
        $returnDate = $bookingData['returnDate']->get();
        $totalDays = $pickupDate->diff($returnDate)->days;
        
        // Get vehicle details
        $vehicle = $this->vehicleService->getVehicleById($bookingData['vehicleId']);
        $dailyRate = $vehicle['dailyRate'] ?? 0;
        
        $totalAmount = $dailyRate * $totalDays;
        
        $bookingData['totalDays'] = $totalDays;
        $bookingData['totalAmount'] = $totalAmount;
        $bookingData['vehicleName'] = $vehicle['name'] ?? '';
        $bookingData['status'] = 'pending';
        $bookingData['createdAt'] = new Timestamp(new \DateTime());
        
        // Set payment details
        if ($bookingData['paymentType'] === 'total') {
            $bookingData['advanceAmount'] = $totalAmount;
            $bookingData['balanceAmount'] = 0;
            $bookingData['paymentStatus'] = 'paid';
        } else {
            $advanceAmount = $bookingData['advanceAmount'] ?? 0;
            $bookingData['balanceAmount'] = $totalAmount - $advanceAmount;
            $bookingData['paymentStatus'] = $advanceAmount > 0 ? 'partial' : 'unpaid';
        }
        
        $bookingId = $this->db->addDocument('bookings', $bookingData);
        
        // Update vehicle status to rented
        if ($bookingId) {
            $this->vehicleService->updateVehicle($bookingData['vehicleId'], [
                'status' => 'rented'
            ]);
        }
        
        return $bookingId;
    }
    
    /**
     * Update a booking
     */
    public function updateBooking(string $id, array $bookingData): bool {
        $bookingData['updatedAt'] = new Timestamp(new \DateTime());
        
        return $this->db->updateDocument('bookings', $id, $bookingData);
    }
    
    /**
     * Update booking status
     */
    public function updateBookingStatus(string $id, string $status): bool {
        $booking = $this->getBookingById($id);
        
        if (!$booking) {
            return false;
        }
        
        $data = [
            'status' => $status,
            'updatedAt' => new Timestamp(new \DateTime())
        ];
        
        $result = $this->db->updateDocument('bookings', $id, $data);
        
        // If completed, make the vehicle available again
        if ($status === 'completed' && isset($booking['vehicleId'])) {
            $this->vehicleService->updateVehicle($booking['vehicleId'], [
                'status' => 'available'
            ]);
        }
        
        // If cancelled and the booking was active, make the vehicle available again
        if ($status === 'cancelled' && $booking['status'] === 'active' && isset($booking['vehicleId'])) {
            $this->vehicleService->updateVehicle($booking['vehicleId'], [
                'status' => 'available'
            ]);
        }
        
        return $result;
    }
    
    /**
     * Delete a booking
     */
    public function deleteBooking(string $id): bool {
        $booking = $this->getBookingById($id);
        
        if (!$booking) {
            return false;
        }
        
        // If the booking has an active vehicle, make it available again
        if ($booking['status'] === 'active' && isset($booking['vehicleId'])) {
            $this->vehicleService->updateVehicle($booking['vehicleId'], [
                'status' => 'available'
            ]);
        }
        
        return $this->db->deleteDocument('bookings', $id);
    }
    
    /**
     * Get active bookings
     */
    public function getActiveBookings(): array {
        return $this->db->queryDocuments('bookings', [
            ['status', '==', 'active']
        ]);
    }
    
    /**
     * Get recent bookings
     */
    public function getRecentBookings(int $limit = 5): array {
        // In a real implementation, you would use a query with limit and order by
        $bookings = $this->getAllBookings();
        
        // Sort by createdAt (descending)
        usort($bookings, function($a, $b) {
            return $b['createdAt']->get()->getTimestamp() - $a['createdAt']->get()->getTimestamp();
        });
        
        // Limit the results
        return array_slice($bookings, 0, $limit);
    }
}
