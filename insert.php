<?php
include "connect.php";

// Get form data
$name = $_POST['name'];
$email = $_POST['email'];
$telephone = $_POST['telephone'];
$feedback = $_POST['feedback'];

// SQL query to insert data
$sql = "INSERT INTO contact (NAME, EMAIL, TELEPHONE, FEEDBACK) VALUES ('$name', '$email', '$telephone', '$feedback' )";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
    header("Location: contact.html");
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close connection
$conn->close();
?>
