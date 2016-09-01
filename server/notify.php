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
      toparents();
      break;
    case 'GET':
      read();
      break;
    case 'PUT':
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
      $sql = "SELECT tree.id, food.name, donate.date, donate.amount, donate.tree FROM donate INNER JOIN tree on FIND_IN_SET(tree.id, donate.tree) INNER JOIN food on tree.food = food.id WHERE `public` = 1 AND ABS(MOD(datediff(CURRENT_DATE, donate.date), 365)) >= 335 GROUP BY tree.id ORDER BY ABS(MOD(datediff(CURRENT_DATE, donate.date), 365)) DESC";

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

  function toparents() {
    $recipients = array();
    $config = new mailconfig();

    # Instantiate the client.
    $mg = new Mailgun($config->apikey);

    # Detect base url.
    $settings = json_decode(file_get_contents("../dist/setting/server.json"), true);
    $test = filter_var($settings['bTestMail'], FILTER_VALIDATE_BOOLEAN);
    $baseurl = $settings['ssltype'] . $_SERVER['SERVER_NAME'] . $settings['uBaseForRouter'];
    $treesurl = $baseurl . "tree/";
    $gtolib = floatval($settings['fGToLBS']);

    // $sql = "SELECT tree.id, tree.parent, food.name, note.date, note.amount FROM note INNER JOIN tree on note.tree = tree.id INNER JOIN food on tree.food = food.id ";
    // $sql .= "WHERE tree.public = 1 AND note.type = 3 AND ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) >= 335 AND tree.id IN (" . $_POST['treeIds'] . ") ";
    // $sql .= "GROUP BY tree.id ORDER BY ABS(MOD(datediff(CURRENT_DATE, note.date), 365)) DESC";

    $sql = "SELECT tree.id, food.name, donate.date, donate.amount, donate.tree FROM donate INNER JOIN tree on FIND_IN_SET(tree.id, donate.tree) INNER JOIN food on tree.food = food.id WHERE `public` = 1 AND ABS(MOD(datediff(CURRENT_DATE, donate.date), 365)) >= 335  AND tree.id IN (" . $_POST['treeIds'] . ") GROUP BY tree.id ORDER BY ABS(MOD(datediff(CURRENT_DATE, donate.date), 365)) DESC";

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
        $html = "";
        foreach ($result as $item) {
          $parents = explode(",", $item['parent']);
          if (in_array($uparent, $parents)) {
            // $text .= "Please update " . $item['name'] . " #" . $item['id'] .= " - " . $treesurl . $item['id'] . "\n";

            $html .= "<div style='font-family:sans-serif;margin-bottom:8px;'>Please update " . $item['name'] . " #" . $item['id'] .= " - <a href='" . $treesurl . $item['id'] . "'>Post a new note for " . $item['name'] . " #" . $item['id'] . "</a></div><img style='max-width: 100%; height:auto;' src='" . $baseurl . "dist/map/" . $item['id'] . "_map.png'><br/><hr />";
          }
        }

        $sql = "SELECT contact FROM person WHERE `id` = " . $uparent;
        try {
          $pdo = getConnection();
          $stmt = $pdo->prepare($sql);
          $stmt->execute();
          $result3 = $stmt->fetchAll();

          // Send message.
          if ($test) {
            $mg->sendMessage($config->domain, array('from'    => $config->from,
                                                    'to'      => $result3[0]['contact'],
                                                    'subject' => "[TEST] FoodParent " . date("F j, Y") . " Update Request",
                                                    // 'text'    => "FoodParent " . date("F j, Y") . " Update Request\n\n" . $text,
                                                    'html'    => "<html><head></head><body><h3 style='font-family:sans-serif;margin-bottom:16px;'>[TEST] FoodParent " . date("F j, Y") . " Update Request</h3>" . $html . "</body></html>",
                                                  ));
          } else {
            $mg->sendMessage($config->domain, array('from'    => $config->from,
                                                    'to'      => $result3[0]['contact'],
                                                    'subject' => "FoodParent " . date("F j, Y") . " Update Request",
                                                    // 'text'    => "FoodParent " . date("F j, Y") . " Update Request\n\n" . $text,
                                                    'html'    => "<html><head></head><body><h3 style='font-family:sans-serif;margin-bottom:16px;'>FoodParent " . date("F j, Y") . " Update Request</h3>" . $html . "</body></html>",
                                                  ));
          }



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
