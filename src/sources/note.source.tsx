import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import { noteActions } from './../actions/note.actions';
import { noteStore, NoteModel, NoteState, NoteType, AmountType } from './../stores/note.store';


let NoteSource: AltJS.Source = {
  fetchNotesFromTreeIds(): AltJS.SourceModel<Array<NoteModel>> {
    return {
      remote(state: NoteState, treeIds?: Array<number>) {
        return new Promise<Array<NoteModel>>((resolve, reject) => {
          $.ajax({
            url: Settings.uBaseName + Settings.uServer + "notes.php",
            type: 'GET',
            data: {
              treeIds: treeIds.toString(),
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
      success: noteActions.fetchNotesFromTreeIds,
      error: noteActions.failed,
      loading: noteActions.loading,
      shouldFetch:() => true
    };
  },
  updateNote(): AltJS.SourceModel<NoteModel> {
    return {
      remote(state: NoteState, update?: NoteModel) {
        if (update.getAmountType() == AmountType.KG) {
          update.setAmount(update.getAmount() * Settings.fKGToG);
        } else if (update.getAmountType() == AmountType.LBS) {
          update.setAmount(update.getAmount() * Settings.fLBSTOG);
        }
        update.setAmountType(AmountType.G);
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
        if (create.getAmountType() == AmountType.KG) {
          create.setAmount(create.getAmount() * Settings.fKGToG);
        } else if (create.getAmountType() == AmountType.LBS) {
          create.setAmount(create.getAmount() * Settings.fLBSTOG);
        }
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
