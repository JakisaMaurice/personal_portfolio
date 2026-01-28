<?php
/**
 * Simplified Contact Form Handler
 * Works without database dependency and uses basic email
 */

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type
header('Content-Type: application/json; charset=utf-8');

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Start session for CSRF protection
session_start();

// CSRF Protection (optional - can be disabled for testing)
$csrf_required = false; // Set to false to disable CSRF for testing
if ($csrf_required) {
    if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token']) || 
        !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Invalid security token. Please refresh the page and try again.']);
        exit;
    }
}

// Input validation and sanitization
function validateInput($data) {
    return htmlspecialchars(trim(stripslashes($data)), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) && 
           preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $email);
}

function validatePhone($phone) {
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

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Validate and sanitize input
$name = validateInput($_POST['name']);
$email = validateInput($_POST['email']);
$telephone = validateInput($_POST['telephone']);
$feedback = validateInput($_POST['feedback']);

// Specific validations
if (strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters long';
}

if (!validateEmail($email)) {
    $errors[] = 'Please enter a valid email address';
}

if (!validatePhone($telephone)) {
    $errors[] = 'Please enter a valid phone number';
}

if (strlen($feedback) < 10) {
    $errors[] = 'Message must be at least 10 characters long';
}

// Check for spam (honeypot)
if (!empty($_POST['website'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam detected']);
    exit;
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Rate limiting
if (!isset($_SESSION['last_submission'])) {
    $_SESSION['last_submission'] = 0;
}

$timeSinceLastSubmission = time() - $_SESSION['last_submission'];
if ($timeSinceLastSubmission < 30) { // 30 seconds between submissions
    http_response_code(429);
    echo json_encode([
        'success' => false, 
        'message' => 'Please wait before submitting another message'
    ]);
    exit;
}

// Try to send email
$emailSent = false;
$to = 'jakisamaurice@gmail.com';
$subject = 'New Contact Form Submission from Portfolio Website';

$message = "New contact form submission:\n\n";
$message .= "Name: " . $name . "\n";
$message .= "Email: " . $email . "\n";
$message .= "Phone: " . $telephone . "\n";
$message .= "Message:\n" . $feedback . "\n\n";
$message .= "Submitted at: " . date('Y-m-d H:i:s') . "\n";
$message .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";

$headers = "From: noreply@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Try to send email
try {
    $emailSent = mail($to, $subject, $message, $headers);
} catch (Exception $e) {
    error_log('Email error: ' . $e->getMessage());
}

// Save to file as backup (create logs directory if it doesn't exist)
$logDir = __DIR__ . '/../logs';
if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

$logFile = $logDir . '/contact_messages.log';
$logEntry = date('Y-m-d H:i:s') . " | " . $name . " | " . $email . " | " . $telephone . " | " . str_replace("\n", " ", $feedback) . "\n";

try {
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
} catch (Exception $e) {
    error_log('Log file error: ' . $e->getMessage());
}

// Update last submission time
$_SESSION['last_submission'] = time();

// Return response
if ($emailSent) {
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you for your message! I will get back to you soon.',
        'data' => [
            'name' => $name,
            'email' => $email
        ]
    ]);
} else {
    // Even if email fails, we saved to log file
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you for your message! I have received it and will get back to you soon.',
        'data' => [
            'name' => $name,
            'email' => $email
        ]
    ]);
}
?>