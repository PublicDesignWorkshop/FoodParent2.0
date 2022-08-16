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
    $extra = 0;
    // if(isset($_GET['id'])) {
    //   // $public = "0,1";
    //   // $_SESSION['public'] = $public;
    //   // $flags = getDefaultFlags();
    //   // $_SESSION['flag_ids'] = $flags;
    //   // $foods = calcSeasonFoods(0);
    //   // $_SESSION['food_ids'] = $foods;
    //   // $adopt = "0";
    //   // $_SESSION['adopt'] = $adopt;
    //   // $rates = "-1,0,1,2,3,4,5";
    //   // $_SESSION['rates'] = $rates;
    //
    //   $sql = "SELECT `food` FROM `tree` WHERE `id` = ". $_GET['id'];
    //   try {
    //     $pdo = getConnection();
    //     $stmt = $pdo->prepare($sql);
    //     $stmt->execute();
    //     $result = $stmt->fetchAll();
    //     $pdo = null;
    //     if (sizeof($result)) {
    //       $extra = $result[0]['food'];
    //     }
    //   } catch(PDOException $e) {
    //     $json = array(
    //       "code" => $e->getCode(),
    //       "message" => $e->getMessage(),
    //     );
    //     echo json_encode($json);
    //   }
    // }



    $check = admin_check();
    $sql = "SELECT * FROM `tree` WHERE ";

    if (!$check) {
      $public = "1";
      $dead = "0";
    } else {
      if (isset($_SESSION['dead'])) {
        $dead = $_SESSION['dead'];
      } else {
        $dead = "0";
      }
      if (isset($_SESSION['public'])) {
        $public  = $_SESSION['public'];
      } else {
        $public = "0,1";
      }
    }
    $sql .= "`public` IN (".$public.") ";

    $sql .= "AND `dead` IN (".$dead.") ";

    // Food basic filtering
    if (isset($_SESSION['food_ids'])) {
      $foodList = explode(",", $_SESSION['food_ids']);
      if (!in_array(strval($extra), $foodList)) {
        array_push($foodList, strval($extra));
      }
      $_SESSION['food_ids'] = implode(",", $foodList);
      $sql .= "AND `food` IN (".$_SESSION['food_ids'].") ";
    } else {
      //$sql .= "AND `food` IN (0) ";
      $foods = calcSeasonFoods($extra);
      $sql .= "AND `food` IN (" . $foods . ") ";
    }
    // Flag basic filtering
    // $flagsize = getFlagSize();
    // $flags = "0";
    // for ($i = 1; $i <= $flagsize; $i++) {
    //   if (isset($_SESSION['flag_ids'])) {
    //     $sql .= "AND SUBSTRING_INDEX(`flag`, ',', " . $i . ") IN (" . $_SESSION['flag_ids'] . ") ";
    //   } else {
    //     $sql .= "AND SUBSTRING_INDEX(`flag`, ',', " . $i . ") IN (" . $flags . ") ";
    //   }
    // }
    if (isset($_SESSION['adopt'])) {
      if (isset($_SESSION['user_id'])) {
        $userId = intval($_SESSION['user_id']);
        if (intval($_SESSION['adopt']) == 1) {
          $sql .= "AND ( ";
          for ($i = 1; $i <= 10; $i++) {
            if ($i == 1) {
              $sql .= "SUBSTRING_INDEX(`parent`, ',', " . $i . ") = " . $userId . " ";
            } else {
              $sql .= "OR SUBSTRING_INDEX(SUBSTRING_INDEX(`parent`, ',', " . $i . "), ',', -1) = " . $userId . " ";
            }
          }
          $sql .= ") ";
        }
      }
      if (intval($_SESSION['adopt']) == 2) {
        $sql .= "AND `parent` != '' AND `parent` != '0' ";
      } else if (intval($_SESSION['adopt']) == 3) {
        $sql .= "AND (`parent` = '' OR `parent` = '0') ";
      }
    }
    if (isset($_SESSION['rates'])) {
      $sql .= "AND `rate` IN (" . $_SESSION['rates'] . ") ";
    }
    // Don't fetch any dead tree.
    $sql .= "AND `dead` = 0 ";

    // show recently added tree always without being affected by filtering.
    if (isset($_SESSION['temp_trees']) && $_SESSION['temp_trees'] != null) {
      $sql .= "OR `id` IN (" . $_SESSION['temp_trees'] . ") ";
    }

    // Only manager level can fetch Doghead farm.
    if ($check) {
      $sql .= "OR `id` = -1 ";
    } else {
      $sql .= "AND `id` != -1 ";
    }



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
