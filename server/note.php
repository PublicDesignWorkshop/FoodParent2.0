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
      //read();
      break;
    case 'PUT':
      //update();
      break;
    case 'DELETE':
      //delete();
      break;
  }

  function read() {
    $data = json_decode(file_get_contents('php://input'));
    $params = null;
    if ($data != null) {
      $params = array(
      "id" => $data->{'id'},
      );
    } else {
      $params = array(
        "id" => $_GET['id'],
      );
    }
    $sql = "SELECT * FROM `tree` WHERE (`id` = :id)";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);
      $pdo = null;
      echo json_encode($result);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

  function update() {
    $data = json_decode(file_get_contents('php://input'));
    $params = null;
    if ($data != null) {
      $params = array(
        "id" => $data->{'id'},
        "lat" => $data->{'lat'},
        "lng" => $data->{'lng'},
        "food" => $data->{'food'},
        "flag" => $data->{'flag'},
        "description" => $data->{'description'},
        "address" => $data->{'address'},
        "public" => $data->{'public'},
        "owner" => $data->{'owner'},
        "updated" => date("Y-m-d H:i:s"),
      );
    }
    $sql = "UPDATE `tree` SET `lat` = :lat, `lng` = :lng, `food` = :food, `flag` = :flag, `public` = :public, `owner` = :owner, `description` = :description, `address` = :address, `updated` = :updated WHERE (`id` = :id)";

    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);

      $sql = "SELECT * FROM `tree` WHERE (`id` = :id)";
      $params = array(
        "id" => $data->{'id'},
      );

      try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetch();
        $pdo = null;
        echo json_encode($result);
      } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
      }

    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

  function create() {
    $owner = 0;
    if ($_SESSION && $_SESSION['user_id']) {
      $owner = intval($_SESSION['user_id']);
    }

    $data = json_decode(file_get_contents('php://input'));
    $type = $data->{'type'};  // 1: CHANGE, 2: POST, 3: PICKUP
    $proper = $data->{'proper'};  // 1: EARLY, 2: PROPER, 3: LATE
    if (floatval($data->{'amount'}) > 0) {
      $type = 3;
    } else {
      $proper = 0;
    }
    $params = array(
      "type" => $type,
      "tree" => $data->{'tree'},
      "person" => $owner,
      "comment" => $data->{'comment'},
      "picture" => $data->{'picture'},
      "rate" => $data->{'rate'},
      "amount" => $data->{'amount'},
      "proper" => $proper,
      "date" => $data->{'date'},
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
      try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $pdo = null;
        echo json_encode($result[0]);
      } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
      }
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

    function delete() {
        $data = json_decode(file_get_contents('php://input'));
        $params = array(
            "id" => $data->{'id'},
        );
        $sql = "DELETE FROM `tree` WHERE (`id` = :id)";
        try {
            $pdo = getConnection();
            $stmt = $pdo->prepare($sql);
            $result = $stmt->execute($params);
            $pdo = null;
            echo json_encode($result);
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
?>
