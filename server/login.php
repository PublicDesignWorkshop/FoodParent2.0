<?php
  include_once 'functions.php';
  sec_session_start(); // Our custom secure way of starting a PHP session.

  if (isset($_POST['contact'], $_POST['p'])) {
    $contact = $_POST['contact'];
    $password = $_POST['p']; // not hashed password.

    if (login($contact, $password) == true) {
      $params = array(
        "code" => 200,
        "id" => $_SESSION['user_id'],
        "contact" => $_SESSION['contact'],
        "auth" => $_SESSION['user_auth'], // Auth List - 1: Concrete Jungle, 2: Manager, 3: Participant, 4: Guest.
      );
    	echo json_encode($params);
    } else {
      $params = array(
        "code" => 902,
      );
      echo json_encode($params);
    }
  } else {
    // The correct POST variables were not sent to this page.
    $params = array(
      "code" => 902,
    );
    echo json_encode($params);
  }
?>
