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
        "message" => "Access is not authorized.",
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
          "code" => 200,
          "result" => $result,
        );
        echo json_encode($json);
      } catch(PDOException $e) {
        $json = array(
          "code" => $e->getCode(),
          "message" => $e->getMessage(),
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
    $params = array(
      "id" => $data->{'id'},
    );

    if (($userauth != 1 && $userauth != 2) && $userid != intval($params['id'])) {
      $json = array(
        "code" => 901,
        "message" => "Access is not authorized.",
      );
      echo json_encode($json);
    } else {
      if (trim($data->{'password'}) == "") {  // Not changing password.
        $params = array(
          "id" => $data->{'id'},
          "auth" => $data->{'auth'},
          "name" => $data->{'name'},
          "contact" => $data->{'contact'},
          "neighborhood" => $data->{'neighborhood'},
          "active" => 1,
          "updated" => date("Y-m-d H:i:s"),
        );
        $sql = "UPDATE `person` SET `auth` = :auth, `name` = :name, `contact` = :contact, `neighborhood` = :neighborhood, `active` = :active, `updated` = :updated WHERE (`id` = :id)";
        try {
          $pdo = getConnection();
          $stmt = $pdo->prepare($sql);
          $stmt->execute($params);

          $sql = "SELECT `id`, `auth`, `name`, `contact`, `neighborhood`, `updated` FROM `person` WHERE (`id` = :id)";
          $params = array(
            "id" => $data->{'id'},
          );
          try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $result = $stmt->fetch();
            $pdo = null;
            $params = array(
              "code" => 200,
              "person" => $result,
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
      } else {  // Changing password.
        // generate salt.
        $salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
        // Create salted password.
        $password = hash('sha512', $data->{'password'} . $salt);
        $params = array(
          "id" => $data->{'id'},
          "auth" => $data->{'auth'},
          "name" => filter_var($data->{'name'}, FILTER_SANITIZE_STRING),
          "contact" => filter_var($data->{'contact'}, FILTER_SANITIZE_STRING),
          "password" => $password,
          "salt" => $salt,
          "neighborhood" => filter_var($data->{'neighborhood'}, FILTER_SANITIZE_STRING),
          "active" => 1,
          "updated" => date("Y-m-d"),
        );
        $sql = "UPDATE `person` SET `auth` = :auth, `name` = :name, `contact` = :contact, `password` = :password, `salt` = :salt, `neighborhood` = :neighborhood, `active` = :active, `updated` = :updated WHERE (`id` = :id)";
        try {
          $pdo = getConnection();
          $stmt = $pdo->prepare($sql);
          $stmt->execute($params);

          $sql = "SELECT `id`, `auth`, `name`, `contact`, `neighborhood`, `updated` FROM `person` WHERE (`id` = :id)";
          $params = array(
            "id" => $data->{'id'},
          );
          try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $result = $stmt->fetch();
            $pdo = null;
            $params = array(
              "code" => 200,
              "person" => $result,
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
    }
  }

  function create() {
    $data = json_decode(file_get_contents('php://input'));
    // Check account already exists in db.
    $params = array(
      "contact" => filter_var($data->{'contact'}, FILTER_SANITIZE_STRING),
    );
    $sql = "SELECT `id`, `active` FROM `person` WHERE (`contact` = :contact)";
    try {
      $pdo = getConnection();
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);
      $result = $stmt->fetch();
      if ($stmt->rowCount() == 1) { // user already exists.
        $id = $result["id"];
        $active = $result["active"]; // Check account is active or not.
        if ($active == 1) { // Return with error code if account already exists and active.
          $json = array(
            "code" => 903,
            "message" => "Account is already exist.",
          );
          echo json_encode($json);
        } else {  // Make active if account already exists but is inactive.
          // generate salt.
          $salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
          // Create salted password.
          $password = hash('sha512', $params["contact"] . $salt);
          $params = array(
            "id" => $id,
            "auth" => 3,
            "name" => filter_var($data->{'name'}, FILTER_SANITIZE_STRING),
            "contact" => filter_var($data->{'contact'}, FILTER_SANITIZE_STRING),
            "password" => $password,
            "salt" => $salt,
            "neighborhood" => filter_var($data->{'neighborhood'}, FILTER_SANITIZE_STRING),
            "active" => 1,
            "updated" => date("Y-m-d"),
          );

          $sql = "UPDATE `person` SET `auth` = :auth, `name` = :name, `contact` = :contact, `password` = :password, `salt` = :salt, `neighborhood` = :neighborhood, `active` = :active, `updated` = :updated WHERE (`id` = :id)";
          try {
            $pdo = getConnection();
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            $sql = "SELECT `id`, `auth`, `name`, `contact`, `neighborhood`, `updated` FROM `person` WHERE (`id` = :id)";
            $params = array(
              "id" => $id,
            );
            try {
              $stmt = $pdo->prepare($sql);
              $stmt->execute($params);
              $result = $stmt->fetch();
              $pdo = null;
              login(filter_var($data->{'contact'}, FILTER_SANITIZE_STRING), filter_var($data->{'contact'}, FILTER_SANITIZE_STRING));  // Login automatically.
              $params = array(
                "code" => 200,
                "person" => $result,
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
      } else {  // Create a new user account.
        // generate salt.
        $salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
        // Create salted password.
        $password = hash('sha512', $params["contact"] . $salt);
        $params = array(
          "auth" => 3,
          "name" => filter_var($data->{'name'}, FILTER_SANITIZE_STRING),
          "contact" => filter_var($data->{'contact'}, FILTER_SANITIZE_STRING),
          "password" => $password,
          "salt" => $salt,
          "neighborhood" => filter_var($data->{'neighborhood'}, FILTER_SANITIZE_STRING),
          "active" => 1,
          "updated" => date("Y-m-d"),
        );

        $sql = "INSERT INTO `person` VALUES ( NULL, :auth, :name, :contact, :password, :salt, :neighborhood, :active, :updated )";
        try {
          $stmt = $pdo->prepare($sql);
          if ($stmt) {
            $stmt->execute($params);
            login($params["contact"], $params["contact"]);  // Login automatically.
            $sql = "SELECT `id`, `auth`, `name`, `contact`, `neighborhood`, `updated` FROM `person` WHERE (`id` = :id)";
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
                "person" => $result[0],
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
        } catch(PDOException $e) {
          $json = array(
            "code" => $e->getCode(),
            "message" => $e->getMessage(),
          );
          echo json_encode($json);
        }
      }
    } catch(PDOException $e) {
      $json = array(
        "code" => $e->getCode(),
        "message" => $e->getMessage(),
      );
      echo json_encode($json);
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
        $params = array(
          "code" => 200,
          "person" => $result,
        );
        echo json_encode($params);
      } catch(PDOException $e) {
        $json = array(
          "code" => $e->getCode(),
          "message" => $e->getMessage(),
        );
        echo json_encode($json);
      }
    } else {
      $json = array(
        "code" => 901,
        "message" => "Access is not authorized.",
      );
      echo json_encode($json);
    }
  }
?>
