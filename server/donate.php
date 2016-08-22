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

  // Read the most recent 5 donate data.
  function read() {
    $data = json_decode(file_get_contents('php://input'));
    $params = null;
    if ($data != null) {
      $params = array(
      "locationId" => $data->{'locationId'},
      );
    } else {
      $params = array(
        "locationId" => $_GET['locationId'],
      );
    }
    $sql = "SELECT * FROM `donate` WHERE (`location` = :locationId) AND `type` = 4 ORDER BY `date` DESC LIMIT 5";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);
      $pdo = null;
      $json = array(
        "code" => 200,
        "donates" => $result,
      );
      echo json_encode($json);
      // echo json_encode($result);
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
        "type" => 4,  // Type for donation is 4.
        "location" => $data->{'location'},
        "food" => $data->{'food'},
        "tree" => $data->{'tree'},
        "person" => $data->{'person'},
        "comment" => $data->{'comment'},
        "picture" => $data->{'picture'},
        "amount" => $data->{'amount'},
        "date" => $data->{'date'},
      );
    }
    $sql = "UPDATE `donate` SET `type` = :type, `location` = :location, `food` = :food, `tree` = :tree, `person` = :person, `comment` = :comment, `picture` = :picture, `amount` = :amount, `date` = :date WHERE (`id` = :id)";

    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);

      $sql = "SELECT * FROM `donate` WHERE (`id` = :id)";
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
          "donate" => $result[0],
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
    // $owner = 0;
    // if (isset($_SESSION['user_id'])) {
    //   $owner = intval($_SESSION['user_id']);
    // }

    $data = json_decode(file_get_contents('php://input'));
    $params = array(
      "type" => 4,  // Type for donation is 4.
      "location" => $data->{'location'},
      "food" => $data->{'food'},
      "tree" => $data->{'tree'},
      "person" => $data->{'person'},
      "comment" => $data->{'comment'},
      "picture" => $data->{'picture'},
      "amount" => $data->{'amount'},
      "date" => $data->{'date'},
      );
    $sql = "INSERT INTO `donate` VALUES ( NULL, :type, :location, :food, :tree, :person, :comment, :picture, :amount, :date )";

    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);

      $sql = "SELECT * FROM `donate` WHERE `id` = :id";
      $params = array(
        "id" => $pdo->lastInsertId(),
      );
      try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $pdo = null;
        $params = array(
          "code" => 200,
          "donate" => $result[0],
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
    $sql = "DELETE FROM `donate` WHERE (`id` = :id)";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $result = $stmt->execute($params);
      $pdo = null;
      $params = array(
        "code" => 200,
        "donates" => $result,
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
