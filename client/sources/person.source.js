import $ from 'jquery';
let ServerSetting = require('./../../setting/server.json');

const PersonSource = {
  fetchPersons(ids) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "persons.php",
        type: 'GET',
        data: {
          ids: ids.toString(),
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.persons);
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

module.exports = PersonSource;
