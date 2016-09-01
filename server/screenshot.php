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
    // $sql = "SELECT tree.id, food.name, note.date, note.amount FROM note INNER JOIN tree on note.tree = tree.id INNER JOIN food on tree.food = food.id WHERE note.type = 3 AND ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) >= 335 GROUP BY tree.id ORDER BY ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) DESC";

    $sql = "SELECT tree.id, food.name, donate.date, donate.amount, donate.tree FROM donate INNER JOIN tree on FIND_IN_SET(tree.id, donate.tree) INNER JOIN food on tree.food = food.id WHERE `public` = 1 AND ABS(MOD(datediff(CURRENT_DATE, donate.date), 365)) >= 335 GROUP BY tree.id ORDER BY ABS(MOD(datediff(CURRENT_DATE, donate.date), 365)) DESC";

    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute();
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
