<?php
namespace App\Services;

use Google\Cloud\Firestore\FirestoreClient;
use Google\Cloud\Firestore\DocumentReference;
use Google\Cloud\Firestore\CollectionReference;
use Google\Cloud\Firestore\DocumentSnapshot;
use Google\Cloud\Firestore\QuerySnapshot;

class DatabaseService {
    private $firestore;
    
    public function __construct() {
        $firebase = getFirebase();
        if ($firebase && isset($firebase['firestore'])) {
            $this->firestore = $firebase['firestore'];
        } else {
            throw new \Exception("Firestore service is not available");
        }
    }
    
    /**
     * Get all documents from a collection
     */
    public function getCollection(string $collectionName): array {
        try {
            $collection = $this->firestore->collection($collectionName);
            $documents = $collection->documents();
            
            $result = [];
            foreach ($documents as $document) {
                if ($document->exists()) {
                    $result[] = array_merge(['id' => $document->id()], $document->data());
                }
            }
            
            return $result;
        } catch (\Exception $e) {
            error_log("Error getting collection {$collectionName}: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Get a document by ID
     */
    public function getDocument(string $collectionName, string $documentId): ?array {
        try {
            $docRef = $this->firestore->collection($collectionName)->document($documentId);
            $document = $docRef->snapshot();
            
            if ($document->exists()) {
                return array_merge(['id' => $document->id()], $document->data());
            }
            
            return null;
        } catch (\Exception $e) {
            error_log("Error getting document {$documentId} from {$collectionName}: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Add a document to a collection
     */
    public function addDocument(string $collectionName, array $data): ?string {
        try {
            $docRef = $this->firestore->collection($collectionName)->add($data);
            return $docRef->id();
        } catch (\Exception $e) {
            error_log("Error adding document to {$collectionName}: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Update a document
     */
    public function updateDocument(string $collectionName, string $documentId, array $data): bool {
        try {
            $docRef = $this->firestore->collection($collectionName)->document($documentId);
            $docRef->set($data, ['merge' => true]);
            return true;
        } catch (\Exception $e) {
            error_log("Error updating document {$documentId} in {$collectionName}: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Delete a document
     */
    public function deleteDocument(string $collectionName, string $documentId): bool {
        try {
            $docRef = $this->firestore->collection($collectionName)->document($documentId);
            $docRef->delete();
            return true;
        } catch (\Exception $e) {
            error_log("Error deleting document {$documentId} from {$collectionName}: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Query documents
     */
    public function queryDocuments(string $collectionName, array $conditions): array {
        try {
            $query = $this->firestore->collection($collectionName);
            
            foreach ($conditions as $condition) {
                $field = $condition[0];
                $operator = $condition[1];
                $value = $condition[2];
                $query = $query->where($field, $operator, $value);
            }
            
            $documents = $query->documents();
            
            $result = [];
            foreach ($documents as $document) {
                if ($document->exists()) {
                    $result[] = array_merge(['id' => $document->id()], $document->data());
                }
            }
            
            return $result;
        } catch (\Exception $e) {
            error_log("Error querying documents in {$collectionName}: " . $e->getMessage());
            return [];
        }
    }
}
