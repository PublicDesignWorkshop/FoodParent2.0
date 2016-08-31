<?php
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  include_once 'functions.php';
  require_once("mailconfig.php");
  # Include the Autoloader (see "Libraries" for install instructions)
  require '../vendor/autoload.php';
  use Mailgun\Mailgun;

  switch($_SERVER['REQUEST_METHOD']){
    case 'POST':
      tomanager();
      break;
    case 'GET':
      read();
      break;
    case 'PUT':
      toparents();
      break;
    case 'DELETE':
      //delete();
      break;
  }

  function read() {
    # find items
    $sql = "SELECT tree.id, food.name, donate.date, donate.amount, donate.tree FROM donate INNER JOIN tree on FIND_IN_SET(tree.id, donate.tree) INNER JOIN food on tree.food = food.id WHERE ABS(MOD(datediff(CURRENT_DATE, donate.date), 365)) >= 351 GROUP BY tree.id ORDER BY ABS(MOD(datediff(CURRENT_DATE, donate.date), 365)) DESC";
    $text = "";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);

      #find forward items
      $sql = "SELECT tree.id, food.name, donate.date, donate.amount, donate.tree FROM donate INNER JOIN tree on FIND_IN_SET(tree.id, donate.tree) INNER JOIN food on tree.food = food.id WHERE ABS(MOD(datediff(CURRENT_DATE, donate.date), 365)) >= 335 GROUP BY tree.id ORDER BY ABS(MOD(datediff(CURRENT_DATE, donate.date), 365)) DESC";

      try {
        $pdo = getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $result2 = $stmt->fetchAll(PDO::FETCH_OBJ);
      } catch(PDOException $e) {
        $params = array(
          "code" => 400,
        );
        echo json_encode($params);
      }

      $params = array(
        "code" => 200,
        "pastpickups" => $result,
        "upcomings" => $result2,
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
