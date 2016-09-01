<?php
  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  include_once 'functions.php';
  include_once 'config.php';
  require_once 'Mail.php';

  sec_session_continue(); // Our custom secure way of starting a PHP session.

  $config = new config;

  switch($_SERVER['REQUEST_METHOD']){
    case 'POST':
      send();
      break;
    case 'GET':
      // read();
      break;
    case 'PUT':
      // update();
      break;
    case 'DELETE':
      // delete();
      break;
  }

  function send() {
    $config = new config;
    $owner = 0;
    if (isset($_SESSION['user_id'])) {
      $owner = intval($_SESSION['user_id']);
    }

    $params = array(
      "from" => $config->mailfrom,
      "to" => $config->mailto,
      "subject" => $_POST['subject'],
      "message" => $_POST['message'],
    );
    $headers = array (
      'From' => $params['from'],
      'To' => $params['to'],
      'Subject' => $params['subject']
    );
    $smtp = Mail::factory('smtp',
      array (
        'host' => $config->mailhost,
        'auth' => true,
        'username' => $config->mailusername,
        'password' => $config->mailpassword
      )
    );
    $mail = $smtp->send($params['to'], $headers, $params['message']);
    if (PEAR::isError($mail)) {
      $params = array(
        "code" => 901,
      );
      echo json_encode($params);
      echo("<p>" . $mail->getMessage() . "</p>");
    } else {
      $params = array(
        "code" => 400,
      );
      // echo("<p>Message successfully sent!</p>");
    }
  }
?>
