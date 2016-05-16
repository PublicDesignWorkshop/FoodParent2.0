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
    // mode: 1 - FOOD
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();

    if ($_POST['mode'] == 1) {
      if ($_POST['foodIds'] != "") {
        $_SESSION['food_ids'] = $_POST['foodIds'];
      } else {
        $_SESSION['food_ids'] = null;
      }
    }

    $params = array(
      "code" => 400,
      "public" => $_SESSION['public'],
      "foods" => $_SESSION['food_ids'],
    );
    echo json_encode($params);
  }

  function read() {
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();
    $public = null;
    $foods = null;
    if (isset($_SESSION['public'])) {
      $public = $_SESSION['public'];
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
    );
    echo json_encode($params);
  }

  function init() {
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();
    $public = null;
    $foods = null;
    if (isset($_SESSION['public'])) {
      $public = $_SESSION['public'];
    }
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
