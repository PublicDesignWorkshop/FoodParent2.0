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
      delete();
      break;
  }

  function update() {
    // mode: 1 - FOOD, 2 - FLAG, 3 - OWNERSHIP, 4 - ADOPT
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();
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
    } else if ($_POST['mode'] == 3) {
      if ($_POST['ids'] != "") {
        $_SESSION['public'] = $_POST['ids'];
      } else {
        $_SESSION['public'] = null;
      }
    } else if ($_POST['mode'] == 4) {
      if ($_POST['ids'] != "") {
        $_SESSION['adopt'] = $_POST['ids'];
      } else {
        $_SESSION['adopt'] = null;
      }
    } else if ($_POST['mode'] == 5) {
      if ($_POST['ids'] != "") {
        $_SESSION['rates'] = $_POST['ids'];
      } else {
        $_SESSION['rates'] = null;
      }
    }

    $params = array(
      "code" => 400,
      "ownerships" => $_SESSION['public'],
      "foods" => $_SESSION['food_ids'],
      "flags" => $_SESSION['flag_ids'],
      "adopt" => $_SESSION['adopt'],
      "rates" => $_SESSION['rates'],
    );
    echo json_encode($params);
  }

  function read() {
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();
    $public = null;
    $foods = null;
    $flags = null;
    $adopt = null;
    $rates = null;
    if (isset($_SESSION['public'])) {
      $public = $_SESSION['public'];
    }
    if (isset($_SESSION['flag_ids'])) {
      $flags = $_SESSION['flag_ids'];
    }
    if (isset($_SESSION['adopt'])) {
      $adopt = $_SESSION['adopt'];
    }
    if (isset($_SESSION['rates'])) {
      $rates = $_SESSION['rates'];
    }
    if (isset($_SESSION['food_ids'])) {
      $foods = $_SESSION['food_ids'];
    } else {
      $foods = calcSeasonFoods(0);
      $_SESSION['food_ids'] = $foods;
    }
    $params = array(
      "code" => 400,
      "ownerships" => $public,
      "foods" => $foods,
      "flags" => $flags,
      "adopt" => $adopt,
      "rates" => $rates,
    );
    echo json_encode($params);
  }

  function init() {
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();
    $public = null;
    $foods = null;
    $flags = null;
    $adopt = null;
    $rates = null;

    $public = "0,1";
    $_SESSION['public'] = $public;
    $flags = getDefaultFlags();
    $_SESSION['flag_ids'] = $flags;
    $foods = calcSeasonFoods(0);
    $_SESSION['food_ids'] = $foods;
    $adopt = "0";
    $_SESSION['adopt'] = $adopt;
    $rates = "-1,0,1,2,3,4,5";
    $_SESSION['rates'] = $rates;
    $params = array(
      "code" => 400,
      "ownerships" => $public,
      "foods" => $foods,
      "flags" => $flags,
      "adopt" => $adopt,
      "rates" => $rates,
    );
    echo json_encode($params);
  }

  function delete() {
    sec_session_continue(); // Our custom secure way of starting a PHP session.
    $check = admin_check();
    $public = null;
    $foods = null;
    $flags = null;
    $adopt = null;
    $rates = null;

    $public = "0,1";
    $_SESSION['public'] = $public;
    $flags = "0," . getAllFlags();
    $_SESSION['flag_ids'] = $flags;
    // $foods = calcSeasonFoods();
    // $_SESSION['food_ids'] = $foods;
    $adopt = "0";
    $_SESSION['adopt'] = $adopt;
    $rates = "-1,0,1,2,3,4,5";
    $_SESSION['rates'] = $rates;
    $params = array(
      "code" => 400,
      "ownerships" => $public,
      "foods" => $_SESSION['food_ids'],
      "flags" => $flags,
      "adopt" => $adopt,
      "rates" => $rates,
    );
    echo json_encode($params);
  }

?>
