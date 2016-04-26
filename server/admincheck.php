<?php
  include_once 'functions.php';
  sec_session_continue(); // Our custom secure way of starting a PHP session.
  $check = admin_check();
  if ($check) {
    $params = array(
      "code" => 400,
      "id" => $_SESSION['user_id'],
      "contact" => $_SESSION['contact'],
      "auth" => $_SESSION['user_auth'],
    );
    echo json_encode($params);
  } else {
    $params = array(
      "code" => 902,
    );
    echo json_encode($params);
  }
?>
