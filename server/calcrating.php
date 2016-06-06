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
    $startthisyear = new DateTime('-1 MONTH', new DateTimeZone('America/Los_Angeles')); // first argument uses strtotime parsing
    $endthisyear = new DateTime('+1 MONTH', new DateTimeZone('America/Los_Angeles')); // first argument uses strtotime parsing
    $startlastyear = new DateTime('-13 MONTH', new DateTimeZone('America/Los_Angeles')); // first argument uses strtotime parsing
    $endlastyear = new DateTime('-11 MONTH', new DateTimeZone('America/Los_Angeles')); // first argument uses strtotime parsing
    $start2lastyear = new DateTime('-25 MONTH', new DateTimeZone('America/Los_Angeles')); // first argument uses strtotime parsing
    $end2lastyear = new DateTime('-23 MONTH', new DateTimeZone('America/Los_Angeles')); // first argument uses strtotime parsing

    // echo nl2br($startthisyear->format('Y-m-d') . "\n");
    // echo nl2br($endthisyear->format('Y-m-d') . "\n");
    $sql = "UPDATE `tree` SET `rate` = 0";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute();
      // echo nl2br("Clear all rating data.\n");
      $sql = "SELECT id FROM `tree`";
      try {
        $pdo = getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $result1 = $stmt->fetchAll();
        foreach ($result1 as $tree) {
          // echo nl2br("- calculating for " . $tree["id"] ."\n");
          $sql = "SELECT `rate` FROM `note` WHERE (`type` IN (2,3)) AND (`tree` = " . $tree["id"] . ") AND ( (`date` BETWEEN '" . $startthisyear->format('Y-m-d') . "' AND '" . $endthisyear->format('Y-m-d') . "') OR (`date` BETWEEN '" . $startlastyear->format('Y-m-d') . "' AND '" . $endlastyear->format('Y-m-d') . "')  OR (`date` BETWEEN '" . $start2lastyear->format('Y-m-d') . "' AND '" . $end2lastyear->format('Y-m-d') . "') )ORDER BY `date` DESC LIMIT 1";
          try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $result2 = $stmt->fetchAll();
            foreach ($result2 as $note) {
              // echo nl2br("-- found note rate: " . $note["rate"] . "\n");
              $sql = "UPDATE `tree` SET `rate` = " . $note["rate"] . " WHERE (`id` = " . $tree["id"] . ")";
              try {
                $stmt = $pdo->prepare($sql);
                $stmt->execute();
              } catch(PDOException $e) {
                return '{"error":{"text":'. $e->getMessage() .'}}';
              }
            }
          } catch(PDOException $e) {
            return '{"error":{"text":'. $e->getMessage() .'}}';
          }
        }
        $params = array(
          "code" => 200,
        );
        echo json_encode($params);
      } catch(PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() .'}}';
      }
    } catch(PDOException $e) {
      return '{"error":{"text":'. $e->getMessage() .'}}';
    }


  }
?>
