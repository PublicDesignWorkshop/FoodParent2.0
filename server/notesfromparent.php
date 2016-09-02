<?php
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  include_once 'functions.php';

  switch($_SERVER['REQUEST_METHOD']){
    case 'GET':
      read();
      break;
  }

  function read() {
    $data = json_decode(file_get_contents('php://input'));
    $params = null;
    if ($data != null) {
      $params = array(
        "contact" => $data->{'contact'},
      );
    } else {
      $params = array(
        "contact" => $_GET['contact'],
      );
    }
    $sql = "SELECT note.id, note.type, note.tree, note.person, note.comment, note.picture, note.rate, note.amount, note.proper, note.date, tree.food FROM `note` INNER JOIN tree WHERE note.person = :contact AND type = 2 AND note.tree = tree.id ORDER BY `date` DESC";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);
      $pdo = null;
      $params = array(
        "code" => 200,
        "notes" => $result,
      );
      echo json_encode($params);
    } catch(PDOException $e) {
      $json = array(
        "code" => $e->getCode(),
        "message" => $e->getMessage(),
      );
      echo json_encode($json);
    }
  }
?>
