<?php
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  include_once 'functions.php';
  sec_session_continue(); // Our custom secure way of starting a PHP session.

  switch($_SERVER['REQUEST_METHOD']){
    case 'POST':
      // create();
      break;
    case 'GET':
      // read();
      break;
    case 'PUT':
      update();
      break;
    case 'DELETE':
      // delete();
      break;
  }

  // function read() {
  //   $data = json_decode(file_get_contents('php://input'));
  //   $params = null;
  //   if ($data != null) {
  //     $params = array(
  //     "id" => $data->{'id'},
  //     );
  //   } else {
  //     $params = array(
  //       "id" => $_GET['id'],
  //     );
  //   }
  //   $sql = "SELECT * FROM `tree` WHERE (`id` = :id)";
  //   try {
  //     $pdo = getConnection();
  //     $stmt = $pdo->prepare($sql);
  //     $stmt->execute($params);
  //     $result = $stmt->fetchAll(PDO::FETCH_OBJ);
  //     $pdo = null;
  //     echo json_encode($result);
  //   } catch(PDOException $e) {
  //     $json = array(
  //       "code" => $e->getCode(),
  //       "message" => $e->getMessage(),
  //     );
  //     echo json_encode($json);
  //   }
  // }

  function update() {
    $data = json_decode(file_get_contents('php://input'));
    $params = null;
    if ($data != null) {
      $params = array(
        "id" => $data->{'id'},
        "name" => $data->{'name'},
        "icon" => $data->{'icon'},
        "adopt" => $data->{'adopt'},
        "updated" => date("Y-m-d H:i:s"),
      );
    }
    $sql = "UPDATE `food` SET `id` = :id, `name` = :name, `icon` = :icon, `adopt` = :adopt, `updated` = :updated WHERE (`id` = :id)";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);

      $sql = "SELECT * FROM `food` WHERE (`id` = :id)";
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
          "food" => $result[0],
        );
        echo json_encode($params);
      } catch(PDOException $e) {
        $json = array(
          "code" => $e->getCode(),
          "message" => $e->getMessage(),
        );
        echo json_encode($json);
      }

    } catch(PDOException $e) {
      $json = array(
        "code" => $e->getCode(),
        "message" => $e->getMessage(),
      );
      echo json_encode($json);
    }
  }
?>
