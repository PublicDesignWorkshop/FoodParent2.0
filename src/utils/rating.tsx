import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');

export function calcRating(success?: any, fail?: any, error?: any) {
  $.ajax({
    url: Settings.uBaseName + Settings.uServer + "calcrating.php",
    type: "GET",
    data: {

    },
    cache: false,
    dataType: "json",
    success: function (response, textStatus, jqXHR) {
      if (parseInt(response.code) == 200) {   // Logged in
        if (success) {
          success(response);
        }
      } else {   // Not logged in
        if (fail) {
          console.log(response.code);
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
