import $ from 'jquery';
let ServerSetting = require('./../../setting/server.json');

const FoodSource = {
  fetchFoods() {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "foods.php",
        type: 'GET',
        data: {},
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.foods);
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

module.exports = FoodSource;
