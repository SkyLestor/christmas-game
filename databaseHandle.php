<?php 

$servername = "localhost";  // or '127.0.0.1'
$name = "root";         // default MySQL user
$password = "";             // default is empty (no password) unless set in XAMPP
$dbname = "leaderboard";  // the name of the database you created

// Create connection
$conn = new mysqli($servername, $name, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$postData = file_get_contents('php://input');

$data = json_decode($postData, true);

if ($data && isset($data['score']) && isset($data['username'])) {
    $score = $data['score'];
    $username = $data['username'];
    echo json_encode(['status' => 'Success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
}

$stmt = $conn->prepare("INSERT INTO personalBest (username, score) VALUES (?, ?)");
$stmt->bind_param("si", $username, $score);
if ($stmt->execute()) {
    echo "New record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();