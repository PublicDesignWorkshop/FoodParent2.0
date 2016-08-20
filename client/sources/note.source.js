import $ from 'jquery';
let ServerSetting = require('./../../setting/server.json');
import { AMOUNTTYPE, NOTETYPE, PICKUPTIME } from './../utils/enum';
import { NoteModel } from './../stores/note.model';

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
  },
  updateNote(note) {
    let temp = new NoteModel(note.toJSON());
    switch(temp.amountType) {
      case AMOUNTTYPE.LBS:
        temp.amount = temp.amount * ServerSetting.fLBSTOG;
        temp.amountType = AMOUNTTYPE.G;
        break;
      case AMOUNTTYPE.KG:
        temp.amount = temp.amount * ServerSetting.fKGToG;
        temp.amountType = AMOUNTTYPE.G;
        break;
    }
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "note.php",
        type: 'PUT',
        data: JSON.stringify(temp.toJSON()),
        contentType: 'application/json',
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.note);
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
  createNote(note) {
    let temp = new NoteModel(note.toJSON());
    switch(temp.amountType) {
      case AMOUNTTYPE.LBS:
        temp.amount = temp.amount * ServerSetting.fLBSTOG;
        temp.amountType = AMOUNTTYPE.G;
        break;
      case AMOUNTTYPE.KG:
        temp.amount = temp.amount * ServerSetting.fKGToG;
        temp.amountType = AMOUNTTYPE.G;
        break;
    }
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "note.php",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(note.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.note);
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
  deleteNote(note) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "note.php",
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(note.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.notes[0]);
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
};

module.exports = NoteSource;
