<?php
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  include_once 'functions.php';

  switch($_SERVER['REQUEST_METHOD']){
    case 'POST':
      //update();
      break;
    case 'GET':
      read();
      break;
    case 'PUT':
      //update();
      break;
    case 'DELETE':
      //delete();
      break;
  }

  function read() {
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();

    $data = json_decode(file_get_contents('php://input'));
    $params = null;
    if ($data != null) {
      $params = array(
        "ids" => $data->{'ids'},
      );
    } else {
      $params = array(
        "ids" => $_GET['ids'],
      );
    }

    if ($check) {
      $sql = "SELECT `id`, `auth`, `name`, `contact`, `neighborhood`, `updated` FROM `person` WHERE (`id` IN (" . $params["ids"] . ") AND `active` = 1)";
      try {
        $pdo = getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $pdo = null;
        echo json_encode($result);
      } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
      }
    } else {
      $json = array(
        "code" => 901,
      );
      echo json_encode($json);
    }
  }
?>
