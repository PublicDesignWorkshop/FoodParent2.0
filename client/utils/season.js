import * as $ from 'jquery';

let ServerSetting = require('./../../setting/server.json');

export let calcSeasonPromise;

function calcSeason() {
  // Create promise for importing the json file only one time over the program.
  calcSeasonPromise = calcSeasonPromise || $.getJSON(ServerSetting.uBase + ServerSetting.uServer + "calcseason.php");
  return calcSeasonPromise.then(function(response) {
    return response;
  })
}

export function updateSeason(success, fail) {
  calcSeason().then(function(response) {
    if (success) {
      success(response.code);
    }
  }).catch(function(response) {
    if (__DEV__) {
       if (response.status == 200) {
         console.error(`Failed to update season data. This could happen either because the file doesn't exist, or the internet is disconnected.`);
       } else {
         console.error(`Failed to update season data. Error code: ${response.status}`);
       }
    }
    if (fail) {
      fail(response.status);
    }
  });
}


export function calcRating(success, fail) {
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
