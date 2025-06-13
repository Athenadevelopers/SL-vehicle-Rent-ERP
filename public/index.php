<?php
session_start();

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/firebase.php';

use Slim\Factory\AppFactory;
use Slim\Views\PhpRenderer;
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Create Slim app
$app = AppFactory::create();
$app->addErrorMiddleware(true, true, true);

// Set up view renderer
$renderer = new PhpRenderer(__DIR__ . '/../views');
$app->getContainer()['renderer'] = $renderer;

// Check if user is authenticated
$isAuthenticated = function ($request, $handler) use ($app) {
    $response = $app->getResponseFactory()->createResponse();
    
    if (!isset($_SESSION['user'])) {
        return $response->withHeader('Location', '/login')->withStatus(302);
    }
    
    return $handler->handle($request);
};

// Routes
$app->get('/', function ($request, $response) {
    return $this->get('renderer')->render($response, 'home.php');
});

$app->get('/login', function ($request, $response) {
    return $this->get('renderer')->render($response, 'login.php');
});

$app->post('/login', function ($request, $response) {
    $data = $request->getParsedBody();
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    $firebase = getFirebase();
    
    if (!$firebase || !isset($firebase['auth'])) {
        $_SESSION['error'] = 'Authentication service is not available';
        return $response->withHeader('Location', '/login')->withStatus(302);
    }
    
    try {
        $signInResult = $firebase['auth']->signInWithEmailAndPassword($email, $password);
        $user = $signInResult->data();
        
        $_SESSION['user'] = [
            'uid' => $user['localId'],
            'email' => $user['email'],
            'displayName' => $user['displayName'] ?? '',
        ];
        
        return $response->withHeader('Location', '/dashboard')->withStatus(302);
    } catch (Exception $e) {
        $_SESSION['error'] = 'Invalid email or password: ' . $e->getMessage();
        return $response->withHeader('Location', '/login')->withStatus(302);
    }
});

// Demo login for testing
$app->post('/demo-login', function ($request, $response) {
    // Set up a demo user session without actual Firebase authentication
    $_SESSION['user'] = [
        'uid' => 'demo-user-123',
        'email' => 'demo@example.com',
        'displayName' => 'Demo User',
        'isDemo' => true
    ];
    
    return $response->withHeader('Location', '/dashboard')->withStatus(302);
});

$app->get('/register', function ($request, $response) {
    return $this->get('renderer')->render($response, 'register.php');
});

$app->post('/register', function ($request, $response) {
    $data = $request->getParsedBody();
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    $firebase = getFirebase();
    
    if (!$firebase || !isset($firebase['auth'])) {
        $_SESSION['error'] = 'Authentication service is not available';
        return $response->withHeader('Location', '/register')->withStatus(302);
    }
    
    try {
        $userProperties = [
            'email' => $email,
            'emailVerified' => false,
            'password' => $password,
            'displayName' => $name,
        ];
        
        $createdUser = $firebase['auth']->createUser($userProperties);
        
        // Create user document in Firestore
        if (isset($firebase['firestore'])) {
            $firebase['firestore']->collection('users')->document($createdUser->uid)->set([
                'name' => $name,
                'email' => $email,
                'role' => 'user',
                'createdAt' => new \Google\Cloud\Core\Timestamp(new \DateTime()),
            ]);
        }
        
        $_SESSION['success'] = 'Registration successful. Please log in.';
        return $response->withHeader('Location', '/login')->withStatus(302);
    } catch (Exception $e) {
        $_SESSION['error'] = 'Registration failed: ' . $e->getMessage();
        return $response->withHeader('Location', '/register')->withStatus(302);
    }
});

$app->get('/logout', function ($request, $response) {
    session_destroy();
    return $response->withHeader('Location', '/login')->withStatus(302);
});

$app->get('/dashboard', $isAuthenticated, function ($request, $response) {
    return $this->get('renderer')->render($response, 'dashboard/index.php');
});

$app->get('/dashboard/vehicles', $isAuthenticated, function ($request, $response) {
    return $this->get('renderer')->render($response, 'dashboard/vehicles.php');
});

$app->get('/dashboard/bookings', $isAuthenticated, function ($request, $response) {
    return $this->get('renderer')->render($response, 'dashboard/bookings.php');
});

$app->get('/dashboard/customers', $isAuthenticated, function ($request, $response) {
    return $this->get('renderer')->render($response, 'dashboard/customers.php');
});

$app->get('/dashboard/payments', $isAuthenticated, function ($request, $response) {
    return $this->get('renderer')->render($response, 'dashboard/payments.php');
});

$app->get('/dashboard/reports', $isAuthenticated, function ($request, $response) {
    return $this->get('renderer')->render($response, 'dashboard/reports.php');
});

$app->get('/dashboard/settings', $isAuthenticated, function ($request, $response) {
    return $this->get('renderer')->render($response, 'dashboard/settings.php');
});

// Run the app
$app->run();
