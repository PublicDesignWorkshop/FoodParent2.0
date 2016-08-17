<?php
  include_once 'functions.php';
  sec_session_continue(); // Our custom secure way of starting a PHP session.
  session_unset();

  $params = array(
    "code" => 200,
  );
  echo json_encode($params);
?>
