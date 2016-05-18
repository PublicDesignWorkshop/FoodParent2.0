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
    $sql = "SELECT * FROM `tree` WHERE ";
    if (!$check) {
      $public = "1";
    } else {
      if (isset($_SESSION['public'])) {
        $public  = $_SESSION['public'];
      } else {
        $public = "0,1";
      }
    }
    $sql .= "`public` IN (".$public.") ";
    // Food basic filtering
    if (isset($_SESSION['food_ids'])) {
      $sql .= "AND `food` IN (".$_SESSION['food_ids'].") ";
    } else {
      //$sql .= "AND `food` IN (0) ";
      $foods = calcSeasonFoods();
      $sql .= "AND `food` IN (".$foods.") ";
    }
    // Flag basic filtering
    $flagsize = getFlagSize();
    $flags = getDefaultFlags();
    for ($i = 1; $i <= $flagsize; $i++) {
      if (isset($_SESSION['flag_ids'])) {
        $sql .= "AND SUBSTRING_INDEX(`flag`, ',', " . $i . ") IN (" . $_SESSION['flag_ids'] . ") ";
      } else {
        $sql .= "AND SUBSTRING_INDEX(`flag`, ',', " . $i . ") IN (" . $flags . ") ";
      }
    }




    /*
    if (!$loggedin) {
      $public = true;
      $flags = 0;
    }
    $sql = "SELECT * FROM `tree` where flags=$flags and public=$public and type in $type";
    */
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
