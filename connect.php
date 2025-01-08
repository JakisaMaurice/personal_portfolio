<?php
// Database configuration
$servername = "localhost"; // XAMPP default hostname
$username = "root";       // Default username for XAMPP
$password = "";           // Default password is empty
$database = "portfolio_website";     // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>
