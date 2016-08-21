import $ from 'jquery';
let ServerSetting = require('./../../setting/server.json');

const AuthSource = {
  fetchAuth() {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "logincheck.php",
        type: 'GET',
        data: {},
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve({id: response.id, contact: response.contact, auth: response.auth, trees: response.trees, notes: response.notes});
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
  },
  processLogout() {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "logout.php",
        type: "GET",
        data: {},
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response);
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
    })
  },
  processLogin(contact, password) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "login.php",
        type: "POST",
        data: {
          'contact': contact,
          'p': password,
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve({id: response.id, contact: response.contact, auth: response.auth, trees: response.trees});
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
    })
  }
};

module.exports = AuthSource;
