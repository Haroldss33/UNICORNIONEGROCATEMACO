<?php
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

// Database credentials for Hostinger - *** REPLACE THESE ***
$servername = "localhost"; // Example: 'sqlXXX.hostinger.com' or 'localhost'
$username = "root";   // Your Hostinger database username
$password = "";   // Your Hostinger database password
$dbname = "contactos_hostinger";            // Your Hostinger database name

// Create database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    $response['message'] = "Error de conexión a la base de datos: " . $conn->connect_error;
    echo json_encode($response);
    exit();
}

// Get the raw POST data (from JavaScript fetch)
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Check if JSON decoding was successful
if ($data === null) {
    $response['message'] = 'Datos inválidos recibidos.';
    echo json_encode($response);
    exit();
}

// Extract and sanitize data
$nombre = $conn->real_escape_string($data['nombre'] ?? '');
$telefono = $conn->real_escape_string($data['telefono'] ?? '');
$motivo_consulta = $conn->real_escape_string($data['motivo_consulta'] ?? '');

// Server-side validation
if (empty($nombre) || empty($telefono) || empty($motivo_consulta)) {
    $response['message'] = 'Por favor, completa todos los campos obligatorios.';
    echo json_encode($response);
    exit();
}

// Prepare and bind the SQL statement to prevent SQL injection
$stmt = $conn->prepare("INSERT INTO contactos_hostinger (nombre, telefono, motivo_consulta) VALUES (?, ?, ?)");

if ($stmt === false) {
    $response['message'] = "Error al preparar la consulta: " . $conn->error;
    echo json_encode($response);
    exit();
}

// 's' for string (all three fields are strings)
$stmt->bind_param("sss", $nombre, $telefono, $motivo_consulta);

// Execute the statement
if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = '¡Tu mensaje ha sido enviado con éxito! Pronto me pondré en contacto contigo.';
} else {
    $response['message'] = "Error al guardar los datos: " . $stmt->error;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>