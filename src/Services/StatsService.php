<?php
namespace App\Services;

use App\Services\VehicleService;
use App\Services\BookingService;
use App\Services\CustomerService;
use App\Services\PaymentService;

class StatsService {
    private $vehicleService;
    private $bookingService;
    private $customerService;
    private $paymentService;
    
    public function __construct() {
        $this->vehicleService = new VehicleService();
        $this->bookingService = new BookingService();
        $this->customerService = new CustomerService();
        $this->paymentService = new PaymentService();
    }
    
    /**
     * Get dashboard stats
     */
    public function getDashboardStats(): array {
        try {
            $vehicles = $this->vehicleService->getAllVehicles();
            $bookings = $this->bookingService->getAllBookings();
            $customers = $this->customerService->getAllCustomers();
            
            $activeBookings = array_filter($bookings, function($booking) {
                return $booking['status'] === 'active';
            });
            
            $availableVehicles = array_filter($vehicles, function($vehicle) {
                return $vehicle['status'] === 'available';
            });
            
            $totalRevenue = $this->paymentService->getTotalRevenue();
            
            $fleetUtilization = count($vehicles) > 0 
                ? ((count($vehicles) - count($availableVehicles)) / count($vehicles)) * 100 
                : 0;
            
            // Calculate customer satisfaction (mock data)
            $customerSatisfaction = 4.7;
            
            return [
                'totalBookings' => count($bookings),
                'activeBookings' => count($activeBookings),
                'totalVehicles' => count($vehicles),
                'availableVehicles' => count($availableVehicles),
                'totalRevenue' => $totalRevenue,
                'fleetUtilization' => $fleetUtilization,
                'customerSatisfaction' => $customerSatisfaction,
                'totalCustomers' => count($customers),
            ];
        } catch (\Exception $e) {
            error_log('Error getting stats: ' . $e->getMessage());
            
            // Return mock data as fallback
            return [
                'totalBookings' => 156,
                'activeBookings' => 42,
                'totalVehicles' => 75,
                'availableVehicles' => 24,
                'totalRevenue' => 1250000,
                'fleetUtilization' => 68,
                'customerSatisfaction' => 4.7,
                'totalCustomers' => 120,
            ];
        }
    }
    
    /**
     * Generate report
     */
    public function generateReport(string $reportType, \DateTime $startDate, \DateTime $endDate): array {
        // In a real app, you would query the database based on the report type and date range
        // For now, we'll return mock data
        return [
            'reportType' => $reportType,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'data' => [
                ['date' => '2023-01-01', 'value' => 25000],
                ['date' => '2023-01-02', 'value' => 30000],
                ['date' => '2023-01-03', 'value' => 27500],
                ['date' => '2023-01-04', 'value' => 32000],
                ['date' => '2023-01-05', 'value' => 29000],
                ['date' => '2023-01-06', 'value' => 31500],
                ['date' => '2023-01-07', 'value' => 34000],
            ],
        ];
    }
}
