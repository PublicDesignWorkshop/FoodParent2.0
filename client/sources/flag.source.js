import $ from 'jquery';
let ServerSetting = require('./../../setting/server.json');

const FlagSource = {
  fetchFlags() {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "flags.php",
        type: 'GET',
        data: {},
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.flags);
          } else {
            if (__DEV__) {
              console.error(response.message);
            }
            reject(response.code);
          }
        },
        error: function(response) {
          if (__DEV__) {
            console.error(response.statusText);
          }
          reject(response.status);
        }
      });
    });
  }
};

module.exports = FlagSource;
