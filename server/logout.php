<?php
  include_once 'functions.php';
  sec_session_start(); // Our custom secure way of starting a PHP session.
  // Unset all session values
  $_SESSION = array();
  // get session parameters
  $params = session_get_cookie_params();
  // Delete the actual cookie.
  setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
  // Destroy session
  session_destroy();
  session_regenerate_id(true);    // regenerated the session, delete the old one.

  $params = array(
    "code" => 200
  );
  echo json_encode($params);
?>
