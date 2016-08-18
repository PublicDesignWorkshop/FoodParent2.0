import $ from 'jquery';
let ServerSetting = require('./../../setting/server.json');

const NoteSource = {
  fetchNotesFromTreeIds(ids) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "notes.php",
        type: 'GET',
        data: {
          treeIds: ids.toString(),
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.notes);
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

module.exports = NoteSource;
