<?php
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  require_once('database.php');

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
    $sql = "SELECT * FROM `flag` ORDER BY `name` ASC";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);
      $pdo = null;
      $params = array(
        "code" => 200,
        "flags" => $result,
      );
      echo json_encode($params);
    } catch(PDOException $e) {
      $params = array(
        "code" => 400,
      );
      echo json_encode($params);
    }
  }
?>
