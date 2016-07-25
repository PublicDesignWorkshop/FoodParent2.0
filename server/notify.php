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
    $sql = "SELECT DISTINCT tree.id, food.name, note.date, note.amount FROM note INNER JOIN tree on note.tree = tree.id INNER JOIN food on tree.food = food.id WHERE note.type = 3 AND ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) >= 351 ORDER BY ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) DESC";
    $text = "";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);

      #find forward items

      $sql = "SELECT DISTINCT tree.id, food.name, note.date, note.amount FROM note INNER JOIN tree on note.tree = tree.id INNER JOIN food on tree.food = food.id WHERE note.type = 3 AND ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) >= 335 ORDER BY ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) DESC";

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
    $settings = json_decode(file_get_contents("../dist/settings.json"), true);
    $baseurl = $settings['ssltype'] . $_SERVER['SERVER_NAME'] . $settings['uBaseNameForWebPack'];
    $treesurl = $baseurl . "tree/";
    $gtolib = floatval($settings['fGToLBS']);

    # find items
    $sql = "SELECT DISTINCT tree.id, food.name, note.date, note.amount FROM note INNER JOIN tree on note.tree = tree.id INNER JOIN food on tree.food = food.id WHERE note.type = 3 AND ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) >= 351 ORDER BY ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) DESC";
    $text = "";
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
          $text .= round(floatval($item['amount']) * $gtolib, 3) . " lbs. of " . $item['name'] . " was picked up on " . $item['date'] . " from #" . $item['id'] .= " - " . $treesurl . $item['id'] . "?mode=graph\n";
        }
        // Send message.
        $mg->sendMessage($config->domain, array('from'    => $config->from,
                                                'to'      => $recipients,
                                                'subject' => "FoodParent " . date("F j, Y") . " Report",
                                                'text'    => "FoodParent " . date("F j, Y") . " Report\n\n" . $text,
                                              ));
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


  function toparents() {
    $recipients = array();

    $config = new mailconfig();

    # Instantiate the client.
    $mg = new Mailgun($config->apikey);

    # Detect base url.
    $settings = json_decode(file_get_contents("../dist/settings.json"), true);
    $baseurl = $settings['ssltype'] . $_SERVER['SERVER_NAME'] . $settings['uBaseNameForWebPack'];
    $treesurl = $baseurl . "tree/";
    $gtolib = floatval($settings['fGToLBS']);

    # find items
    $sql = "SELECT DISTINCT tree.id, tree.parent, food.name, note.date, note.amount FROM note INNER JOIN tree on note.tree = tree.id INNER JOIN food on tree.food = food.id WHERE note.type = 3 AND ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) >= 335 ORDER BY ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) DESC";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute();
      $result = $stmt->fetchAll();
      $uparents = array();
      foreach ($result as $item) {
        $parents = explode(",", $item['parent']);
        foreach ($parents as $parent) {
          if ($parent != 0)
            array_push($uparents, $parent);
        }
      }
      $uparents = array_unique($uparents);
      # send email to each parent
      foreach ($uparents as $uparent) {
        $text = "";
        foreach ($result as $item) {
          $parents = explode(",", $item['parent']);
          if (in_array($uparent, $parents)) {
            $text .= "Please update " . $item['name'] . " #" . $item['id'] .= " - " . $treesurl . $item['id'] . "\n";
          }
        }

        $sql = "SELECT contact FROM person WHERE `id` = " . $uparent;
        try {
          $pdo = getConnection();
          $stmt = $pdo->prepare($sql);
          $stmt->execute();
          $result3 = $stmt->fetchAll();

          // Send message.
          $mg->sendMessage($config->domain, array('from'    => $config->from,
                                                  'to'      => $result3[0]['contact'],
                                                  'subject' => "FoodParent " . date("F j, Y") . " Update Request",
                                                  'text'    => "FoodParent " . date("F j, Y") . " Update Request\n\n" . $text,
                                                ));
        } catch(PDOException $e) {
          $params = array(
            "code" => 400,
          );
          echo json_encode($params);
        }
      }
      $params = array(
        "code" => 200,
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
