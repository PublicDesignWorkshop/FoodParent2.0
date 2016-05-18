import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');

export function sendMailFromParent(mailfrom: string, subject: string, message: string, success?: any, fail?: any, error?: any) {
  console.log("---------sendMailFromParent---------");
  $.ajax({
    url: Settings.uBaseName + Settings.uServer + "mailfrom_" + Settings.sMailserversuffix + ".php",
    type: "POST",
    data: {
      'from': mailfrom,
      'subject': subject,
      'message': message,
    },
    cache: false,
    dataType: "json",
    success: function (response, textStatus, jqXHR) {
      if (parseInt(response.code) == 400) {   // Logged in
        if (success) {
          success(response);
        }
      } else {   // Not logged in
        if (fail) {
          fail(response.code);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (error) {
        fail(jqXHR);
      }
    }
  });
}
