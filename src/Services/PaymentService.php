<?php
namespace App\Services;

use App\Services\DatabaseService;
use App\Services\BookingService;
use Google\Cloud\Core\Timestamp;

class PaymentService {
    private $db;
    private $bookingService;
    
    public function __construct() {
        $this->db = new DatabaseService();
        $this->bookingService = new BookingService();
    }
    
    /**
     * Get all payments
     */
    public function getAllPayments(): array {
        return $this->db->getCollection('payments');
    }
    
    /**
     * Get payment by ID
     */
    public function getPaymentById(string $id): ?array {
        return $this->db->getDocument('payments', $id);
    }
    
    /**
     * Add a new payment
     */
    public function addPayment(array $paymentData): ?string {
        // Generate an invoice number with INV prefix, year, and 4 digits
        $year = date('Y');
        $invoiceNumber = 'INV-' . $year . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
        
        $paymentData['invoiceNumber'] = $invoiceNumber;
        $paymentData['date'] = $paymentData['date'] ?? new Timestamp(new \DateTime());
        $paymentData['status'] = $paymentData['status'] ?? 'completed';
        
        $paymentId = $this->db->addDocument('payments', $paymentData);
        
        // If this is for a booking, update the booking's payment status
        if ($paymentId && isset($paymentData['bookingId'])) {
            $booking = $this->bookingService->getBookingById($paymentData['bookingId']);
            
            if ($booking) {
                $totalPaid = ($booking['advanceAmount'] ?? 0) + ($paymentData['amount'] ?? 0);
                $newPaymentStatus = $totalPaid >= $booking['totalAmount'] ? 'paid' : 'partial';
                
                $this->bookingService->updateBooking($paymentData['bookingId'], [
                    'paymentStatus' => $newPaymentStatus,
                    'advanceAmount' => $totalPaid,
                    'balanceAmount' => $booking['totalAmount'] - $totalPaid
                ]);
            }
        }
        
        return $paymentId;
    }
    
    /**
     * Update a payment
     */
    public function updatePayment(string $id, array $paymentData): bool {
        return $this->db->updateDocument('payments', $id, $paymentData);
    }
    
    /**
     * Delete a payment
     */
    public function deletePayment(string $id): bool {
        return $this->db->deleteDocument('payments', $id);
    }
    
    /**
     * Get payments for a booking
     */
    public function getPaymentsForBooking(string $bookingId): array {
        return $this->db->queryDocuments('payments', [
            ['bookingId', '==', $bookingId]
        ]);
    }
    
    /**
     * Get total revenue
     */
    public function getTotalRevenue(): float {
        $payments = $this->getAllPayments();
        
        $totalRevenue = 0;
        foreach ($payments as $payment) {
            if ($payment['status'] === 'completed') {
                $totalRevenue += $payment['amount'] ?? 0;
            }
        }
        
        return $totalRevenue;
    }
}
