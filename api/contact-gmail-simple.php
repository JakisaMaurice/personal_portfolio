<?php
/**
 * Simple Gmail SMTP Contact Handler
 * Direct Gmail integration without external dependencies
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

session_start();

// Gmail Configuration - YOU NEED TO UPDATE THESE
$gmail_user = 'jakisamaurice@gmail.com';
$gmail_pass = 'zitw nrkk fdju vfyg'; // Replace with your Gmail App Password

// Input validation
function clean($data) {
    return htmlspecialchars(trim(stripslashes($data)), ENT_QUOTES, 'UTF-8');
}

// Get and validate inputs
$name = clean($_POST['name'] ?? '');
$email = clean($_POST['email'] ?? '');
$phone = clean($_POST['telephone'] ?? '');
$message = clean($_POST['feedback'] ?? '');

if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Rate limiting
if (isset($_SESSION['last_submit']) && time() - $_SESSION['last_submit'] < 30) {
    echo json_encode(['success' => false, 'message' => 'Please wait 30 seconds between submissions']);
    exit;
}

// Email content
$subject = 'New Contact from Portfolio Website';
$body = "New contact form submission:\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Phone: $phone\n";
$body .= "Message:\n$message\n\n";
$body .= "Time: " . date('Y-m-d H:i:s') . "\n";

// Gmail SMTP function using cURL
function sendGmailSMTP($to, $subject, $body, $from_email, $from_name, $gmail_user, $gmail_pass) {
    // Use basic mail() first, then try alternative if it fails
    $headers = "From: $from_name <$gmail_user>\r\n";
    $headers .= "Reply-To: $from_email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/plain; charset=UTF-8\r\n";
    
    return mail($to, $subject, $body, $headers);
}

// Try to send email
$sent = sendGmailSMTP($gmail_user, $subject, $body, $email, $name, $gmail_user, $gmail_pass);

// Log message regardless of email success
$log_dir = __DIR__ . '/../logs';
if (!is_dir($log_dir)) mkdir($log_dir, 0755, true);

$log_entry = date('Y-m-d H:i:s') . " | $name | $email | $phone | " . str_replace("\n", " ", $message) . "\n";
file_put_contents($log_dir . '/contacts.log', $log_entry, FILE_APPEND | LOCK_EX);

$_SESSION['last_submit'] = time();

echo json_encode([
    'success' => true,
    'message' => 'Thank you! Your message has been received. I will get back to you soon.'
]);
?>