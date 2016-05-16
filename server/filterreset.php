<?php
  include_once 'functions.php';
  sec_session_continue(); // Our custom secure way of starting a PHP session.
  session_unset();
  $_SESSION['public'] = null;
  $_SESSION['food_ids'] = null;

  $params = array(
    "code" => 400,
  );
  echo json_encode($params);
?>
