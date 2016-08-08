import $ from 'jquery';
let ServerSetting = require('./../../setting/server.json');

const TreeSource = {
  fetchTrees(id = -1) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "trees.php",
        type: 'GET',
        data: {},
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.trees);
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

module.exports = TreeSource;
