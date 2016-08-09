import $ from 'jquery';

let ServerSetting = require('./../../setting/server.json');

export let calcSeasonPromise;

export function updateSeason() {
  // Create promise for importing the json file only one time over the program.
  calcSeasonPromise = calcSeasonPromise || $.getJSON(ServerSetting.uBase + ServerSetting.uServer + "calcseason.php");
  return calcSeasonPromise.then(function(response) {
    return response;
  })
}

/* Code snipet of promise callback handler. */
// export function updateSeason(success, fail) {
//   calcSeason().then(function(response) {
//     if (success) {
//       success(response.code);
//     }
//   }).catch(function(response) {
//     if (__DEV__) {
//        if (response.status == 200) {
//          console.error(`Failed to update season data. This could happen either because the file doesn't exist, or the internet is disconnected.`);
//        } else {
//          console.error(`Failed to update season data. Error code: ${response.status}`);
//        }
//     }
//     if (fail) {
//       fail(response.status);
//     }
//   });
// }
