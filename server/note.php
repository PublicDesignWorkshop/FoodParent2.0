<?php
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  include_once 'functions.php';
  sec_session_continue(); // Our custom secure way of starting a PHP session.

  switch($_SERVER['REQUEST_METHOD']){
    case 'POST':
      create();
      break;
    case 'GET':
      read();
      break;
    case 'PUT':
      update();
      break;
    case 'DELETE':
      delete();
      break;
  }

  // Read the most recent post and pickup data.
  function read() {
    $data = json_decode(file_get_contents('php://input'));
    $params = null;
    if ($data != null) {
      $params = array(
      "treeId" => $data->{'treeId'},
      );
    } else {
      $params = array(
        "treeId" => $_GET['treeId'],
      );
    }
    $sql = "SELECT * FROM `note` WHERE (`tree` = :treeId) AND `type` = 2 ORDER BY `date` DESC LIMIT 1";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);
      $result = $stmt->fetch(PDO::FETCH_OBJ);
      $pdo = null;
      // echo json_encode($result);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

    // $sql = "SELECT * FROM `note` WHERE (`tree` = :treeId) AND `type` = 3 ORDER BY `date` DESC LIMIT 1";
    // try {
    //   $pdo = getConnection();
    //   $stmt = $pdo->prepare($sql);
    //   $stmt->execute($params);
    //   $result2 = $stmt->fetch(PDO::FETCH_OBJ);
    //   $pdo = null;
    //
    // } catch(PDOException $e) {
    //   echo '{"error":{"text":'. $e->getMessage() .'}}';
    // }

    $notes = [];
    // array_push($notes, $result, $result2);
    array_push($notes, $result);

    $json = array(
      "notes" => $notes,
      "code" => 200,
    );
    echo json_encode($json);
  }

  function update() {
    $data = json_decode(file_get_contents('php://input'));
    if (validateDate($data->{'date'})) {
      $date = $data->{'date'};
    } else {
      $date = date('Y-m-d H:i:s', time());
    }
    $params = array(
      "id" => $data->{'id'},
      "type" => $data->{'type'},
      "tree" => $data->{'tree'},
      "person" => $data->{'person'},
      "comment" => $data->{'comment'},
      "picture" => $data->{'picture'},
      "rate" => $data->{'rate'},
      "amount" => $data->{'amount'},
      "proper" => $data->{'proper'},
      "date" => $date,
    );
    $sql = "UPDATE `note` SET `type` = :type, `tree` = :tree, `person` = :person, `comment` = :comment, `picture` = :picture, `rate` = :rate, `amount` = :amount, `proper` = :proper, `date` = :date WHERE (`id` = :id)";

    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);

      $sql = "SELECT * FROM `note` WHERE (`id` = :id)";
      $params = array(
        "id" => $data->{'id'},
      );

      try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $pdo = null;
        $params = array(
          "code" => 200,
          "note" => $result[0],
        );
        echo json_encode($params);
      } catch(PDOException $e) {
        $params = array(
          "code" => $e->getCode(),
          "message" => $e->getMessage(),
        );
        echo json_encode($params);
      }
    } catch(PDOException $e) {
      $params = array(
        "code" => $e->getCode(),
        "message" => $e->getMessage(),
      );
      echo json_encode($params);
    }
  }

  function create() {
    // Getting author contact from a client.
    // $owner = 0;
    // if (isset($_SESSION['user_id'])) {
    //   $owner = intval($_SESSION['user_id']);
    // }

    $data = json_decode(file_get_contents('php://input'));
    $type = $data->{'type'};  // 1: CHANGE, 2: POST, 3: PICKUP
    $proper = $data->{'proper'};  // 1: EARLY, 2: PROPER, 3: LATE
    if (floatval($data->{'amount'}) > 0) {
      $type = 3;
    } else {
      $proper = 0;
    }
    if (validateDate($data->{'date'})) {
      $date = $data->{'date'};
    } else {
      $date = date('Y-m-d H:i:s', time());
    }
    $params = array(
      "type" => $type,
      "tree" => $data->{'tree'},
      "person" => $data->{'person'},
      "comment" => $data->{'comment'},
      "picture" => $data->{'picture'},
      "rate" => $data->{'rate'},
      "amount" => $data->{'amount'},
      "proper" => $proper,
      "date" => $date,
      );
    $sql = "INSERT INTO `note` VALUES ( NULL, :type, :tree, :person, :comment, :picture, :rate, :amount, :proper, :date )";

    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);

      $sql = "SELECT * FROM `note` WHERE `id` = :id";
      $params = array(
        "id" => $pdo->lastInsertId(),
      );

      // Store newly added note into a cookie so that users can edit before cookie being expired.
      if (isset($_SESSION['temp_notes']) && $_SESSION['temp_notes'] != null) {
        $temp_notes = explode(",", $_SESSION['temp_notes']);
        array_push($temp_notes, $params['id']);
        $_SESSION['temp_notes'] = implode(',', $temp_notes);
      } else {
        $_SESSION['temp_notes'] = $params['id'];
      }
      $_SESSION['LAST_CREATE'] = $_SERVER['REQUEST_TIME'];

      try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $pdo = null;
        $params = array(
          "code" => 200,
          "note" => $result[0],
        );
        echo json_encode($params);
      } catch(PDOException $e) {
        $params = array(
          "code" => $e->getCode(),
          "message" => $e->getMessage(),
        );
        echo json_encode($params);
      }
    } catch(PDOException $e) {
      $params = array(
        "code" => $e->getCode(),
        "message" => $e->getMessage(),
      );
      echo json_encode($params);
    }
  }

  function delete() {
    $data = json_decode(file_get_contents('php://input'));
    $params = array(
      "id" => $data->{'id'},
    );
    $sql = "DELETE FROM `note` WHERE (`id` = :id)";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $result = $stmt->execute($params);
      $pdo = null;
      $params = array(
        "code" => 200,
        "notes" => $result,
      );
      echo json_encode($params);
    } catch(PDOException $e) {
      $params = array(
        "code" => $e->getCode(),
        "message" => $e->getMessage(),
      );
      echo json_encode($params);
    }
  }
?>
