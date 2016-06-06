import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import { noteActions } from './../actions/note.actions';
import { noteStore, NoteModel, NoteState, NoteType, AmountType } from './../stores/note.store';


let NoteSource = {
  fetchNotesFromTreeIds(treeIds: Array<number>): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "notes.php",
        type: 'GET',
        data: {
          treeIds: treeIds.toString(),
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.notes);
          } else {
            reject(response.code);
          }
        },
        error: function(response) {
          reject(response.status);
        }
      });
    })
  },
  createNote(note: NoteModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "note.php",
        type: 'POST',
        data: JSON.stringify(note.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.note);
          } else {
            reject(response.code);
          }
        },
        error: function(response) {
          reject(response.status);
        }
      });
    })
  },
  updateNote(note: NoteModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (note.getAmountType() == AmountType.KG) {
        note.setAmount(note.getAmount() * Settings.fKGToG);
      } else if (note.getAmountType() == AmountType.LBS) {
        note.setAmount(note.getAmount() * Settings.fLBSTOG);
      }
      note.setAmountType(AmountType.G);
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "note.php",
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(note.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.notes[0]);
          } else {
            reject(response.code);
          }
        },
        error: function(response) {
          reject(response.status);
        }
      });
    })
  },
  deleteNote(note: NoteModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "note.php",
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(note.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.notes[0]);
          } else {
            reject(response.code);
          }
        },
        error: function(response) {
          reject(response.status);
        }
      });
    })
  },

  //
  //
  //
  //
  //
  // deleteNote(): AltJS.SourceModel<NoteModel> {
  //   return {
  //     remote(state: NoteState, remove?: NoteModel) {
  //       return new Promise<NoteModel>((resolve, reject) => {
  //         //console.log(tree.toJSON());
  //         $.ajax({
  //           url: Settings.uBaseName + Settings.uServer + "note.php",
  //           type: 'DELETE',
  //           contentType: 'application/json',
  //           data: JSON.stringify(remove.toJSON()),
  //           dataType: "json",
  //           success: function(response) {
  //             resolve(remove.toJSON());
  //           },
  //           error: function(response) {
  //             console.log(response);
  //             reject(response);
  //           }
  //         });
  //       })
  //     },
  //     local(state: NoteState): NoteModel {
  //       //TODO : Figure out why local doesn't work =(
  //       return null;
  //     },
  //     success: noteActions.deleteNote,
  //     error: noteActions.failed,
  //     loading: noteActions.loading,
  //     shouldFetch:() => true
  //   };
  // }

  //
  // updateNote(): AltJS.SourceModel<NoteModel> {
  //   return {
  //     remote(state: NoteState, update?: NoteModel) {
  //       if (update.getAmountType() == AmountType.KG) {
  //         update.setAmount(update.getAmount() * Settings.fKGToG);
  //       } else if (update.getAmountType() == AmountType.LBS) {
  //         update.setAmount(update.getAmount() * Settings.fLBSTOG);
  //       }
  //       update.setAmountType(AmountType.G);
  //       return new Promise<NoteModel>((resolve, reject) => {
  //         //console.log(tree.toJSON());
  //         $.ajax({
  //           url: Settings.uBaseName + Settings.uServer + "note.php",
  //           type: 'PUT',
  //           contentType: 'application/json',
  //           data: JSON.stringify(update.toJSON()),
  //           dataType: "json",
  //           success: function(response) {
  //             resolve(response[0]);
  //           },
  //           error: function(response) {
  //             console.log(response);
  //             reject(response);
  //           }
  //         });
  //       })
  //     },
  //     local(state: NoteState): NoteModel {
  //       //TODO : Figure out why local doesn't work =(
  //       return null;
  //     },
  //     success: noteActions.updateNote,
  //     error: noteActions.failed,
  //     loading: noteActions.loading,
  //     shouldFetch:() => true
  //   };
  // },


};

export const noteSource = NoteSource;
