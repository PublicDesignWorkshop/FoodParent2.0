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
  }

  function tomanager() {
    $recipients = array();
    if (isset($_POST['recipients'])) {
      $recipients = explode(",", $_POST['recipients']);
    }
    if (sizeof($recipients) == 0) {
      $sql = "SELECT contact FROM person WHERE auth <= 2";
      try {
        $pdo = getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        foreach ($result as $person) {
          array_push($recipients, $person["contact"]);
        }
      } catch(PDOException $e) {
        $params = array(
          "code" => 400,
        );
        echo json_encode($params);
      }
    }

    $config = new mailconfig();

    # Instantiate the client.
    $mg = new Mailgun($config->apikey);

    # Detect base url.
    $settings = json_decode(file_get_contents("../dist/setting/server.json"), true);
    $test = filter_var($settings['bTestMail'], FILTER_VALIDATE_BOOLEAN);
    $baseurl = $settings['ssltype'] . $_SERVER['SERVER_NAME'] . $settings['uBaseForRouter'];
    $treesurl = $baseurl . "tree/";
    $gtolib = floatval($settings['fGToLBS']);

    # find items
    $sql = "SELECT tree.id, food.name, note.date, note.amount FROM note INNER JOIN tree on note.tree = tree.id INNER JOIN food on tree.food = food.id ";
    $sql .= "WHERE note.type = 3 AND ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) >= 351 AND tree.id IN (" . $_POST['treeIds'] . ") ";
    $sql .= "GROUP BY tree.id ORDER BY ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) DESC";

    $text = "";
    $html = "";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll();
      if (sizeof($recipients) == 0) {
        $params = array(
          "code" => 330,
          "message" => "No valid recipient.",
        );
      	echo json_encode($params);
      } else if (sizeof($result) == 0) {
        $params = array(
          "code" => 331,
          "message" => "No matched tree.",
        );
      	echo json_encode($params);
      } else {
        foreach ($result as $item) {
          // $text .= round(floatval($item['amount']) * $gtolib, 3) . " lbs. of " . $item['name'] . " was picked up on " . $item['date'] . " from #" . $item['id'] .= " - " . $treesurl . $item['id'] . "?mode=graph\n";

          $html .= "<div style='font-family:sans-serif;margin-bottom:8px;'>" . round(floatval($item['amount']) * $gtolib, 3) . " lbs. of " . $item['name'] . " was picked up on " . $item['date'] . " from #" . $item['id'] .= " - <a href='" . $treesurl . $item['id'] . "?mode=graph'>Check out #" . $item['id'] . "</a></div><img style='max-width: 100%; height:auto;' src='" . $baseurl . "dist/map/" . $item['id'] . "_map.png'><br/><hr />";
        }
        // Send message.
        if ($test) {
          $mg->sendMessage($config->domain, array('from'    => $config->from,
                                                  'to'      => $recipients,
                                                  'subject' => "[TEST] FoodParent " . date("F j, Y") . " Report",
                                                  'html'    => "<html><head></head><body><h3 style='font-family:sans-serif;margin-bottom:16px;'>[TEST] FoodParent " . date("F j, Y") . " Report</h3>" . $html . "</body></html>",
                                                  // 'text'    => "[TEST] FoodParent " . date("F j, Y") . " Report\n\n" . $text,
                                                ));
        } else {
          $mg->sendMessage($config->domain, array('from'    => $config->from,
                                                  'to'      => $recipients,
                                                  'subject' => "FoodParent " . date("F j, Y") . " Report",
                                                  'html'    => "<html><head></head><body><h3 style='font-family:sans-serif;margin-bottom:16px;'>FoodParent " . date("F j, Y") . " Report</h3>" . $html . "</body></html>",
                                                  // 'text'    => "FoodParent " . date("F j, Y") . " Report\n\n" . $text,
                                                ));
        }

        $params = array(
          "code" => 200,
        );
      	echo json_encode($params);
      }
    } catch(PDOException $e) {
      $params = array(
        "code" => 400,
      );
      echo json_encode($params);
    }
  }
?>
