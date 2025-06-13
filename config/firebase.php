<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\Factory;
use Kreait\Firebase\Factory as FirebaseFactory;

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
        $factory = (new FirebaseFactory())
            ->withServiceAccount(__DIR__ . '/service-account.json')
            ->withDatabaseUri($firebaseConfig['databaseURL']);
        
        $firebase = [
            'auth' => $factory->createAuth(),
            'firestore' => $factory->createFirestore()->database(),
            'storage' => $factory->createStorage(),
            'database' => $factory->createDatabase()
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
