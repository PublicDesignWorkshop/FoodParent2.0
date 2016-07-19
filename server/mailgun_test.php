<?php

require_once("mailconfig.php");
# Include the Autoloader (see "Libraries" for install instructions)
require '../vendor/autoload.php';
use Mailgun\Mailgun;

$config = new mailconfig();

# Instantiate the client.
$mg = new Mailgun($config->apikey);

# Now, compose and send your message.
$mg->sendMessage($config->domain, array('from'    => $config->from,
                                        'to'      => 'jkim848@gatech.edu',
                                        'subject' => 'The PHP SDK is awesome!',
                                        'text'    => 'It is so simple to send a message.'));
?>
