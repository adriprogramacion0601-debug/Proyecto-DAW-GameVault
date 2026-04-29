<?php
// controller/controladorRegistro.php

// 1. Verificar que llegó por POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 2. Recoger los datos del formulario
    $nombre   = $_POST['nombre']   ?? '';
    $email    = $_POST['email']    ?? '';
    $password = $_POST['password'] ?? '';

    // 3. Limpiar/sanitizar los datos (MUY importante)
    $nombre = htmlspecialchars(trim($nombre));
    $email  = filter_var(trim($email), FILTER_SANITIZE_EMAIL);

    // 4. Validar los datos
    $errores = [];

    if (empty($nombre)) {
        $errores[] = "El nombre es obligatorio";
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errores[] = "El email no es válido";
    }

    if (strlen($password) < 6) {
        $errores[] = "La contraseña debe tener al menos 6 caracteres";
    }

    // 5. Si hay errores, volver a la vista
    if (!empty($errores)) {
        // Puedes guardarlos en sesión o pasarlos por GET
        session_start();
        $_SESSION['errores'] = $errores;
        header('Location: ../vista/formulario.php');
        exit();
    }

    // 6. Si todo está bien, procesar (guardar en BD, etc.)
    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    // ... aquí llamas al modelo para guardar en base de datos

    // 7. Redirigir al éxito
    header('Location: ../vista/exito.php');
    exit();

} else {
    // Si alguien entra directo al controlador sin enviar el form
    header('Location: ../vista/formulario.php');
    exit();
}
?>