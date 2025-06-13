<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/firebase.php';

// Test Firebase initialization
try {
    $firebase = getFirebase();
    
    if ($firebase) {
        echo "<h1>Firebase Initialization Test</h1>";
        
        echo "<h2>Available Services:</h2>";
        echo "<ul>";
        foreach ($firebase as $service => $instance) {
            echo "<li>{$service}: " . (is_object($instance) ? get_class($instance) : 'Not available') . "</li>";
        }
        echo "</ul>";
        
        if (isset($firebase['auth'])) {
            echo "<h2>Auth Service Test:</h2>";
            try {
                // Just test if we can call a method
                $firebase['auth']->listUsers(1);
                echo "<p>Auth service is working correctly!</p>";
            } catch (Exception $e) {
                echo "<p>Auth service error: " . $e->getMessage() . "</p>";
            }
        }
        
        if (isset($firebase['firestore'])) {
            echo "<h2>Firestore Service Test:</h2>";
            try {
                // Just test if we can call a method
                $collections = $firebase['firestore']->collections();
                echo "<p>Firestore service is working correctly!</p>";
                echo "<p>Available collections:</p>";
                echo "<ul>";
                foreach ($collections as $collection) {
                    echo "<li>" . $collection->id() . "</li>";
                }
                echo "</ul>";
            } catch (Exception $e) {
                echo "<p>Firestore service error: " . $e->getMessage() . "</p>";
            }
        }
    } else {
        echo "<h1>Firebase initialization failed</h1>";
    }
} catch (Exception $e) {
    echo "<h1>Error testing Firebase</h1>";
    echo "<p>" . $e->getMessage() . "</p>";
}
