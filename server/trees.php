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
    $sql = "SELECT * FROM `tree`";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);
      $pdo = null;
      echo json_encode($result);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }
?>
