<?php
namespace App\Services;

use App\Services\DatabaseService;
use Google\Cloud\Core\Timestamp;

class VehicleService {
    private $db;
    
    public function __construct() {
        $this->db = new DatabaseService();
    }
    
    /**
     * Get all vehicles
     */
    public function getAllVehicles(): array {
        return $this->db->getCollection('vehicles');
    }
    
    /**
     * Get vehicle by ID
     */
    public function getVehicleById(string $id): ?array {
        return $this->db->getDocument('vehicles', $id);
    }
    
    /**
     * Add a new vehicle
     */
    public function addVehicle(array $vehicleData): ?string {
        $vehicleData['createdAt'] = new Timestamp(new \DateTime());
        $vehicleData['updatedAt'] = new Timestamp(new \DateTime());
        
        return $this->db->addDocument('vehicles', $vehicleData);
    }
    
    /**
     * Update a vehicle
     */
    public function updateVehicle(string $id, array $vehicleData): bool {
        $vehicleData['updatedAt'] = new Timestamp(new \DateTime());
        
        return $this->db->updateDocument('vehicles', $id, $vehicleData);
    }
    
    /**
     * Delete a vehicle
     */
    public function deleteVehicle(string $id): bool {
        return $this->db->deleteDocument('vehicles', $id);
    }
    
    /**
     * Schedule vehicle maintenance
     */
    public function scheduleVehicleMaintenance(string $id, \DateTime $date): bool {
        $data = [
            'nextMaintenance' => new Timestamp($date),
            'updatedAt' => new Timestamp(new \DateTime())
        ];
        
        return $this->db->updateDocument('vehicles', $id, $data);
    }
    
    /**
     * Complete vehicle maintenance
     */
    public function completeVehicleMaintenance(string $id, string $notes): bool {
        $now = new \DateTime();
        $nextMaintenanceDate = new \DateTime();
        $nextMaintenanceDate->modify('+3 months');
        
        $data = [
            'lastMaintenance' => new Timestamp($now),
            'nextMaintenance' => new Timestamp($nextMaintenanceDate),
            'status' => 'available',
            'maintenanceNotes' => $notes,
            'updatedAt' => new Timestamp($now)
        ];
        
        return $this->db->updateDocument('vehicles', $id, $data);
    }
    
    /**
     * Get available vehicles
     */
    public function getAvailableVehicles(): array {
        return $this->db->queryDocuments('vehicles', [
            ['status', '==', 'available']
        ]);
    }
}
