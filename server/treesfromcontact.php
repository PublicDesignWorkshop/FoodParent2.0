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
    sec_session_continue(); // Our custom secure way of starting a PHP session.

    $data = json_decode(file_get_contents('php://input'));
    $params = null;
    if ($data != null) {
      $params = array(
        "personId" => $data->{'personId'},
      );
    } else {
      $params = array(
        "personId" => $_GET['personId'],
      );
    }
    $sql = "SELECT tree.id, tree.food, food.season FROM tree INNER JOIN food WHERE FIND_IN_SET(:personId, `parent`) AND tree.food = food.id GROUP BY tree.id ORDER BY tree.food ASC, food.season DESC, food.name ASC";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);
      $pdo = null;
      $params = array(
        "code" => 200,
        "trees" => $result,
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
