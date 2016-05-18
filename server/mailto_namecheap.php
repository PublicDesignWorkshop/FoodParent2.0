<?php
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  include_once 'functions.php';
  include_once 'config.php';
  sec_session_continue(); // Our custom secure way of starting a PHP session.

  switch($_SERVER['REQUEST_METHOD']){
    case 'POST':
      send();
      break;
    case 'GET':
      // read();
      break;
    case 'PUT':
      // update();
      break;
    case 'DELETE':
      // delete();
      break;
  }

  function send() {
    $config = new config;
    $owner = 0;
    if (isset($_SESSION['user_id'])) {
      $owner = intval($_SESSION['user_id']);
    }

    $data = json_decode(file_get_contents('php://input'));
    $params = array(
      "from" => $config->mailfrom,
      "to" => $config->mailto,
      "subject" => $_POST['subject'],
      "message" => $_POST['message'],
    );
    $headers = "From: " . $params["from"] . "\r\n" . "Reply-To: " . $params["from"] . "\r\n" ;
    $a = mail( $params["to"], $params["subject"], $message, $headers );
    if ($a) {
      $params = array(
        "code" => 400,
      );
      echo json_encode($params);
    } else {
      $params = array(
        "code" => 901,
      );
      echo json_encode($params);
    }
  }
?>
