import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import { noteActions } from './../actions/note.actions';
import { noteStore, NoteModel, NoteState } from './../stores/note.store';


let NoteSource: AltJS.Source = {
  fetchNotes(): AltJS.SourceModel<Array<NoteModel>> {
    return {
      remote(state: NoteState, treeId: number) {
        return new Promise<Array<NoteModel>>((resolve, reject) => {
          $.ajax({
            url: Settings.uBaseName + Settings.uServer + "notes.php",
            data: {
              treeId: treeId,
            },
            success: function(response) {
              resolve($.parseJSON(response));
            },
            error: function(response) {
              console.log(response);
              reject(response);
            }
          });
        })
      },
      local(state: NoteState): Array<NoteModel> {
        //TODO : Figure out why local doesn't work =(
        return null;
      },
      success: noteActions.fetchNotes,
      error: noteActions.failed,
      loading: noteActions.loading,
      shouldFetch:() => true
    };
  },
  updateNote(): AltJS.SourceModel<NoteModel> {
    return {
      remote(state: NoteState, update?: NoteModel) {
        console.log(update);
        return new Promise<NoteModel>((resolve, reject) => {
          //console.log(tree.toJSON());
          $.ajax({
            url: Settings.uBaseName + Settings.uServer + "note.php",
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(update.toJSON()),
            dataType: "json",
            success: function(response) {
              resolve(response[0]);
            },
            error: function(response) {
              console.log(response);
              reject(response);
            }
          });
        })
      },
      local(state: NoteState): NoteModel {
        //TODO : Figure out why local doesn't work =(
        return null;
      },
      success: noteActions.updateNote,
      error: noteActions.failed,
      loading: noteActions.loading,
      shouldFetch:() => true
    };
  },
  createNote(): AltJS.SourceModel<NoteModel> {
    return {
      remote(state: NoteState, create?: NoteModel) {
        return new Promise<NoteModel>((resolve, reject) => {
          //console.log(tree.toJSON());
          $.ajax({
            url: Settings.uBaseName + Settings.uServer + "note.php",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(create.toJSON()),
            dataType: "json",
            success: function(response) {
              resolve(response);
            },
            error: function(response) {
              console.log(response);
              reject(response);
            }
          });
        })
      },
      local(state: NoteState): NoteModel {
        //TODO : Figure out why local doesn't work =(
        return null;
      },
      success: noteActions.createNote,
      error: noteActions.failed,
      loading: noteActions.loading,
      shouldFetch:() => true
    };
  }
};

export const noteSource = NoteSource;
