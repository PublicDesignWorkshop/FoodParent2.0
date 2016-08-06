import * as $ from 'jquery';

let ServerSetting = require('./../../setting/server.json');

export let localizationPromise;

function getLocalization(language: string) {
  let cl = "en";
  if (language != null) {
    if (language == "KO" || language == "ko") {
      cl = "ko";
    }
  }
  // Create promise for importing the json file only one time over the program.
  localizationPromise = localizationPromise || $.getJSON(ServerSetting.uBase + ServerSetting.uSetting + "localization-" + cl + ".json");
  return localizationPromise.then(function(response) {
    return response;
  })
}

export function localization(code, language = "en", success, fail): void {
  getLocalization(language).then(function(response) {
    if (success) {
      success(response[code]);
    } else {
      return response[code];
    }
  }).catch(function(response) {
    if (__DEV__) {
       if (response.status == 200) {
         console.error(`Failed to import localization data. This could happen either because the file doesn't exist, or the internet is disconnected.`);
       } else {
         console.error(`Failed to import localization data. Error code: ${response.status}`);
       }
    }
    if (fail) {
      fail(response.status);
    } else {
      return response.status;
    }
  });

  // let cl = "en";
  // if (language == "KO" || language == "ko") {
  //   cl = "ko";
  // }
  //
  // $.ajax({
  //   url: ServerSetting.uBase + ServerSetting.uSetting + "localization-" + cl + ".json",
  //   type: "GET",
  //   data: {},
  //   cache: true,
  //   dataType: "json",
  //   success: function (response, textStatus, jqXHR) {
  //     localization = response;
  //     if (success) {
  //       success();
  //     }
  //   },
  //   error: function (jqXHR, textStatus, errorThrown) {
  //     if (fail) {
  //       fail(jqXHR);
  //     }
  //   }
  // });
}
