<?php
session_start();
// Unset all session variables
$_SESSION = [];
// Destroy session cookie
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params['path'], $params['domain'],
        $params['secure'], $params['httponly']
    );
}
// Destroy the session data on server
session_destroy();
// Redirect with a flag so login page can show a message without needing the session
header('Location: login.php?logout=1');
exit;
