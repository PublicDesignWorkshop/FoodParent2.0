import * as $ from 'jquery';

let ServerSetting = require('./../../setting/server.json');

let localizationPromise;

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

export function localization(code, language = "en", success, fail) {
  getLocalization(language).then(function(response) {
    if (success) {
      success(response[code]);
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
    }
  });
}
