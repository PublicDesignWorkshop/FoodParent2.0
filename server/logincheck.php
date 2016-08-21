<?php
  include_once 'functions.php';
  sec_session_continue(); // Our custom secure way of starting a PHP session.

  // Handling newly added tree cookie data.
  $time = $_SERVER['REQUEST_TIME'];
  $timeout_duration = 60 * 15;
  if (isset($_SESSION['LAST_CREATE']) && ($time - $_SESSION['LAST_CREATE']) > $timeout_duration) {
    $_SESSION['temp_trees'] = null;
    $_SESSION['temp_notes'] = null;
  }

  $temp_trees = null;
  $temp_notes = null;
  if (isset($_SESSION['temp_trees'])) {
    $temp_trees = $_SESSION['temp_trees'];
  }
  if (isset($_SESSION['temp_notes'])) {
    $temp_notes = $_SESSION['temp_notes'];
  }

  $check = login_check();
  if ($check) {
    $params = array(
      "code" => 200,
      "id" => $_SESSION['user_id'],
      "contact" => $_SESSION['contact'],
      "auth" => $_SESSION['user_auth'], // Auth List - 1: Concrete Jungle, 2: Manager, 3: Participant, 4: Guest.
      "trees" => $temp_trees,
      "notes" => $temp_notes,
    );
    echo json_encode($params);
  } else {
    $params = array(
      "code" => 200,
      "message" => "Not logged in.",
      "id" => 0,
      "contact" => "",
      "auth" => 4,  // Return guest auth when an user has not logged in.
      "trees" => $temp_trees,
      "notes" => $temp_notes,
    );
    echo json_encode($params);
  }
?>
