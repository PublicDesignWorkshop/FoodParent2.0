<?php
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  include_once 'functions.php';
  sec_session_continue(); // Our custom secure way of starting a PHP session.

  switch($_SERVER['REQUEST_METHOD']){
    case 'POST':
      // create();
      break;
    case 'GET':
      read();
      break;
    case 'PUT':
      // update();
      break;
    case 'DELETE':
      // delete();
      break;
  }

  // Read the most recent 5 donate data.
  function read() {
    $data = json_decode(file_get_contents('php://input'));
    $params = null;
    if ($data != null) {
      $params = array(
      "treeId" => $data->{'treeId'},
      );
    } else {
      $params = array(
        "treeId" => $_GET['treeId'],
      );
    }
    $sql = "SELECT * FROM `donate` WHERE FIND_IN_SET(:treeId, `tree`) AND `type` = 4 ORDER BY `date` DESC LIMIT 1";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);
      $pdo = null;
      $json = array(
        "code" => 200,
        "donates" => $result,
      );
      echo json_encode($json);
      // echo json_encode($result);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }
?>
