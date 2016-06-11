import * as $ from 'jquery';
import 'es6-promise';

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
            console.log(response.message);
            reject(response.code);
          }
        },
        error: function(response) {
          console.log(response.statusText);
          reject(response.status);
        }
      });
    })
  },
  createNote(note: NoteModel): Promise<any> {
    if (note.getAmountType() == AmountType.KG) {
      note.setAmount(note.getAmount() * Settings.fKGToG);
    } else if (note.getAmountType() == AmountType.LBS) {
      note.setAmount(note.getAmount() * Settings.fLBSTOG);
    }
    note.setAmountType(AmountType.G);
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "note.php",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(note.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.note);
          } else {
            console.log(response.message);
            reject(response.code);
          }
        },
        error: function(response) {
          console.log(response.statusText);
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
            console.log(response.message);
            reject(response.code);
          }
        },
        error: function(response) {
          console.log(response.statusText);
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
            console.log(response.message);
            reject(response.code);
          }
        },
        error: function(response) {
          console.log(response.statusText);
          reject(response.status);
        }
      });
    })
  },
};

export const noteSource = NoteSource;
