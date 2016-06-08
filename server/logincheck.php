<?php
  include_once 'functions.php';
  sec_session_continue(); // Our custom secure way of starting a PHP session.
  $check = login_check();
  if ($check) {
    $params = array(
      "code" => 200,
      "id" => $_SESSION['user_id'],
      "contact" => $_SESSION['contact'],
      "auth" => $_SESSION['user_auth'], // Auth List - 1: Concrete Jungle, 2: Manager, 3: Participant, 4: Guest.
    );
    echo json_encode($params);
  } else {
    $params = array(
      "code" => 200,
      "message" => "Not logged in.",
      "id" => 0,
      "contact" => "",
      "auth" => 4,  // Return guest auth when an user has not logged in.
    );
    echo json_encode($params);
  }
?>
