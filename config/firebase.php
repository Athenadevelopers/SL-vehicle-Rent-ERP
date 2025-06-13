<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

// Firebase configuration
$firebaseConfig = [
    'apiKey' => 'AIzaSyDPMglfN6aBuVZ9r3E881sjIjphhZHsHA8',
    'authDomain' => 'trackace-vo2gn.firebaseapp.com',
    'databaseURL' => 'https://trackace-vo2gn-default-rtdb.asia-southeast1.firebasedatabase.app',
    'projectId' => 'trackace-vo2gn',
    'storageBucket' => 'trackace-vo2gn.firebasestorage.app',
    'messagingSenderId' => '305838510077',
    'appId' => '1:305838510077:web:6fe38aa85d6dc3076cd394'
];

// Initialize Firebase services
function initFirebase() {
    global $firebaseConfig;
    
    try {
        // Create a new Firebase factory
        $factory = (new Factory)
            ->withProjectId($firebaseConfig['projectId'])
            ->withDatabaseUri($firebaseConfig['databaseURL']);
            
        // If service account file exists, use it
        if (file_exists(__DIR__ . '/service-account.json')) {
            $factory = $factory->withServiceAccount(__DIR__ . '/service-account.json');
        }
        
        // Initialize services
        $firebase = [
            'auth' => $factory->createAuth(),
            'database' => $factory->createDatabase(),
            'firestore' => $factory->createFirestore(),
            'storage' => $factory->createStorage()
        ];
        
        return $firebase;
    } catch (Exception $e) {
        error_log('Firebase initialization error: ' . $e->getMessage());
        return null;
    }
}

// Get Firebase services
function getFirebase() {
    static $firebase = null;
    
    if ($firebase === null) {
        $firebase = initFirebase();
    }
    
    return $firebase;
}
