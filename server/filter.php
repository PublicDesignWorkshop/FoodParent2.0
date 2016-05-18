<?php
  include_once 'functions.php';

  switch($_SERVER['REQUEST_METHOD']){
    case 'POST':
      update();
      break;
    case 'GET':
      read();
      break;
    case 'PUT':
      init();
      break;
    case 'DELETE':
      //delete();
      break;
  }

  function update() {
    // mode: 1 - FOOD, 2 - FLAG
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();
    $public = null;
    if ($_POST['mode'] == 1) {
      if ($_POST['ids'] != "") {
        $_SESSION['food_ids'] = $_POST['ids'];
      } else {
        $_SESSION['food_ids'] = null;
      }
    } else if ($_POST['mode'] == 2) {
      if ($_POST['ids'] != "") {
        $_SESSION['flag_ids'] = $_POST['ids'];
      } else {
        $_SESSION['flag_ids'] = null;
      }
    }
    if (isset($_SESSION['public'])) {
      $public = $_SESSION['public'];
    }

    $params = array(
      "code" => 400,
      "public" => $public,
      "foods" => $_SESSION['food_ids'],
      "flags" => $_SESSION['flag_ids'],
    );
    echo json_encode($params);
  }

  function read() {
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();
    $public = null;
    $foods = null;
    $flags = null;
    if (isset($_SESSION['public'])) {
      $public = $_SESSION['public'];
    }
    if (isset($_SESSION['flag_ids'])) {
      $flags = $_SESSION['flag_ids'];
    }
    if (isset($_SESSION['food_ids'])) {
      $foods = $_SESSION['food_ids'];
    } else {
      $foods = calcSeasonFoods();
      $_SESSION['food_ids'] = $foods;
    }
    $params = array(
      "code" => 400,
      "public" => $public,
      "foods" => $foods,
      "flags" => $flags,
    );
    echo json_encode($params);
  }

  function init() {
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();
    $public = null;
    $foods = null;
    $flags = null;
    if (isset($_SESSION['public'])) {
      $public = $_SESSION['public'];
    }
    $flags = getDefaultFlags();
    $_SESSION['flag_ids'] = $flags;
    $foods = calcSeasonFoods();
    $_SESSION['food_ids'] = $foods;
    $params = array(
      "code" => 400,
      "public" => $public,
      "foods" => $foods,
    );
    echo json_encode($params);
  }



?>
