<?php
namespace App\Services;

use App\Services\DatabaseService;
use Google\Cloud\Core\Timestamp;

class CustomerService {
    private $db;
    
    public function __construct() {
        $this->db = new DatabaseService();
    }
    
    /**
     * Get all customers
     */
    public function getAllCustomers(): array {
        return $this->db->getCollection('customers');
    }
    
    /**
     * Get customer by ID
     */
    public function getCustomerById(string $id): ?array {
        return $this->db->getDocument('customers', $id);
    }
    
    /**
     * Add a new customer
     */
    public function addCustomer(array $customerData): ?string {
        $customerData['bookings'] = [];
        $customerData['createdAt'] = new Timestamp(new \DateTime());
        
        return $this->db->addDocument('customers', $customerData);
    }
    
    /**
     * Update a customer
     */
    public function updateCustomer(string $id, array $customerData): bool {
        $customerData['updatedAt'] = new Timestamp(new \DateTime());
        
        return $this->db->updateDocument('customers', $id, $customerData);
    }
    
    /**
     * Delete a customer
     */
    public function deleteCustomer(string $id): bool {
        return $this->db->deleteDocument('customers', $id);
    }
    
    /**
     * Add booking to customer
     */
    public function addBookingToCustomer(string $customerId, string $bookingId): bool {
        $customer = $this->getCustomerById($customerId);
        
        if (!$customer) {
            return false;
        }
        
        $bookings = $customer['bookings'] ?? [];
        $bookings[] = $bookingId;
        
        return $this->db->updateDocument('customers', $customerId, [
            'bookings' => array_unique($bookings),
            'updatedAt' => new Timestamp(new \DateTime())
        ]);
    }
    
    /**
     * Get customer bookings
     */
    public function getCustomerBookings(string $customerId): array {
        $customer = $this->getCustomerById($customerId);
        
        if (!$customer || empty($customer['bookings'])) {
            return [];
        }
        
        $bookings = [];
        foreach ($customer['bookings'] as $bookingId) {
            $booking = $this->db->getDocument('bookings', $bookingId);
            if ($booking) {
                $bookings[] = $booking;
            }
        }
        
        return $bookings;
    }
}
