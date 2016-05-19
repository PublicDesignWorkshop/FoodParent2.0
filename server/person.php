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
      //delete();
      break;
  }

  function read() {
    $userid = null;
    $userauth = null;
    if (isset($_SESSION['user_id'])) {
      $userid = intval($_SESSION['user_id']);
    }
    if (isset($_SESSION['user_auth'])) {
      $userauth = intval($_SESSION['user_auth']);
    }
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

    if (($userauth != 1 && $userauth != 2) && $userid != intval($params['id'])) {
      $json = array(
        "code" => 901,
      );
      echo json_encode($json);
    } else {
      $sql = "SELECT `id`, `auth`, `name`, `contact`, `neighborhood`, `updated` FROM `person` WHERE (`id` = :id) AND `active` = 1";
      try {
        $pdo = getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $pdo = null;
        $json = array(
          "code" => 400,
          "result" => $result,
        );
        echo json_encode($json);
      } catch(PDOException $e) {
        $json = array(
          "code" => 404,
          "error" => $e->getMessage(),
        );
        echo json_encode($json);
      }
    }
  }

  function update() {
    $userid = null;
    $userauth = null;
    if (isset($_SESSION['user_id'])) {
      $userid = intval($_SESSION['user_id']);
    }
    if (isset($_SESSION['user_auth'])) {
      $userauth = intval($_SESSION['user_auth']);
    }
    $data = json_decode(file_get_contents('php://input'));
    $params = null;
    if ($data != null) {
      $params = array(
        "id" => $data->{'id'},
        "auth" => $data->{'auth'},
        "name" => $data->{'name'},
        "address" => $data->{'address'},
        "contact" => $data->{'contact'},
        "neighborhood" => $data->{'neighborhood'},
        "active" => 1,
        "updated" => date("Y-m-d H:i:s"),
      );
    }

    if (($userauth != 1 && $userauth != 2) && $userid != intval($params['id'])) {
      $json = array(
        "code" => 901,
      );
      echo json_encode($json);
    } else {
      $sql = "UPDATE `person` SET `auth` = :auth, `name` = :name, `address` = :address, `contact` = :contact, `neighborhood` = :neighborhood, `active` = :active, `updated` = :updated WHERE (`id` = :id)";
      try {
        $pdo = getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $sql = "SELECT `id`, `auth`, `name`, `address`, `contact`, `neighborhood`, `updated` FROM `person` WHERE (`id` = :id)";
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
  }

  function create() {
    $data = json_decode(file_get_contents('php://input'));
    $params = array(
      "auth" => $data->{'auth'},
      "name" => $data->{'name'},
      "address" => $data->{'address'},
      "contact" => $data->{'contact'},
      "password" => "",
      "salt" => "",
      "neighborhood" => $data->{'neighborhood'},
      "active" => 1,
      "updated" => date("Y-m-d H:i:s"),
    );
    $sql = "INSERT INTO `person` VALUES ( NULL, :auth, :name, :address, :contact, :password, :salt, :neighborhood, :active, :updated )";

    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);

      $sql = "SELECT `id`, `auth`, `name`, `address`, `contact`, `neighborhood`, `updated` FROM `person` WHERE `id` = :id";
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
    $check = admin_check();
    $data = json_decode(file_get_contents('php://input'));
    $params = array(
      "id" => $data->{'id'},
    );
    if ($check) {
      $sql = "DELETE FROM `person` WHERE (`id` = :id)";
      try {
        $pdo = getConnection();
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute($params);
        $pdo = null;
        echo json_encode($result);
      } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
      }
    } else {
      $json = array(
        "code" => 901,
      );
      echo json_encode($json);
    }
  }
?>
