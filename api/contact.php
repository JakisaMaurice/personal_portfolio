<?php
/**
 * Secure Contact Form Handler
 * Author: Mungu Jakisa Maurice
 * Description: Modern, secure PHP contact form with validation and CSRF protection
 */

// Enable error reporting for development (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type
header('Content-Type: application/json; charset=utf-8');

// Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'portfolio_website');
define('TABLE_NAME', 'contact_messages');

// CORS headers (adjust for your domain in production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// CSRF Protection
session_start();
if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
    exit;
}

// Input validation and sanitization
function validateInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) && 
           preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $email);
}

function validatePhone($phone) {
    // Ugandan phone number validation
    $cleanedPhone = preg_replace('/[\s\-\(\)]/', '', $phone);
    return preg_match('/^(\+256|0)[0-9]{9}$/', $cleanedPhone);
}

// Validate required fields
$requiredFields = ['name', 'email', 'telephone', 'feedback'];
$errors = [];

foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        $errors[] = ucfirst($field) . ' is required';
    }
}

// Validate and sanitize input
$name = isset($_POST['name']) ? validateInput($_POST['name']) : '';
$email = isset($_POST['email']) ? validateInput($_POST['email']) : '';
$telephone = isset($_POST['telephone']) ? validateInput($_POST['telephone']) : '';
$feedback = isset($_POST['feedback']) ? validateInput($_POST['feedback']) : '';

// Specific validations
if (!empty($name) && strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters long';
}

if (!empty($email) && !validateEmail($email)) {
    $errors[] = 'Please enter a valid email address';
}

if (!empty($telephone) && !validatePhone($telephone)) {
    $errors[] = 'Please enter a valid Ugandan phone number';
}

if (!empty($feedback) && strlen($feedback) < 10) {
    $errors[] = 'Message must be at least 10 characters long';
}

// Check for spam (simple honeypot)
if (!empty($_POST['website'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam detected']);
    exit;
}

// Rate limiting (basic implementation)
if (!isset($_SESSION['last_submission'])) {
    $_SESSION['last_submission'] = 0;
}

$timeSinceLastSubmission = time() - $_SESSION['last_submission'];
if ($timeSinceLastSubmission < 60) { // 1 minute between submissions
    http_response_code(429);
    echo json_encode([
        'success' => false, 
        'message' => 'Please wait before submitting another message'
    ]);
    exit;
}

// Database connection using PDO with prepared statements
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    
    // Create table if it doesn't exist
    $createTableSQL = "
        CREATE TABLE IF NOT EXISTS " . TABLE_NAME . " (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            telephone VARCHAR(20) NOT NULL,
            feedback TEXT NOT NULL,
            ip_address VARCHAR(45),
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ";
    
    $pdo->exec($createTableSQL);
    
    // Insert the contact form data using prepared statement
    $insertSQL = "
        INSERT INTO " . TABLE_NAME . " 
        (name, email, telephone, feedback, ip_address, user_agent) 
        VALUES (:name, :email, :telephone, :feedback, :ip_address, :user_agent)
    ";
    
    $stmt = $pdo->prepare($insertSQL);
    
    $result = $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':telephone' => $telephone,
        ':feedback' => $feedback,
        ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
        ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
    ]);
    
    if ($result) {
        // Update last submission time
        $_SESSION['last_submission'] = time();
        
        // Send notification email (optional)
        sendNotificationEmail($name, $email, $telephone, $feedback);
        
        // Return success response
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you for your message! I will get back to you soon.',
            'data' => [
                'name' => $name,
                'email' => $email
            ]
        ]);
    } else {
        throw new Exception('Failed to save message');
    }
    
} catch (PDOException $e) {
    // Log database error (don't expose to user)
    error_log('Database error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Sorry, there was an error processing your message. Please try again later.'
    ]);
} catch (Exception $e) {
    error_log('General error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'An unexpected error occurred. Please try again.'
    ]);
}

function sendNotificationEmail($name, $email, $telephone, $feedback) {
    // Email configuration
    $to = 'jakisamaurice@gmail.com';
    $subject = 'New Contact Form Submission from Portfolio Website';
    
    $message = "New contact form submission:\n\n";
    $message .= "Name: " . $name . "\n";
    $message .= "Email: " . $email . "\n";
    $message .= "Phone: " . $telephone . "\n";
    $message .= "Message:\n" . $feedback . "\n\n";
    $message .= "Submitted at: " . date('Y-m-d H:i:s') . "\n";
    $message .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
    
    $headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Send email (adjust mail configuration as needed)
    mail($to, $subject, $message, $headers);
}

// CSRF token generation (for forms)
function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}
?>