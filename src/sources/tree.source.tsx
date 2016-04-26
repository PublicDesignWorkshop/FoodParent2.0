import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import { treeActions } from './../actions/tree.actions';
import { treeStore, TreeModel, TreeState } from './../stores/tree.store';


let TreeSource: AltJS.Source = {
  fetchTrees(): AltJS.SourceModel<Array<TreeModel>> {
    return {
      remote(state: TreeState) {
        return new Promise<Array<TreeModel>>((resolve, reject) => {
          $.ajax({
            url: Settings.uBaseName + Settings.uServer + "trees.php",
            data: {

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
      local(state: TreeState): Array<TreeModel> {
        //TODO : Figure out why local doesn't work =(
        return null;
      },
      success: treeActions.fetchTrees,
      error: treeActions.failed,
      loading: treeActions.loading,
      shouldFetch:() => true
    };
  },
  updateTree(): AltJS.SourceModel<TreeModel> {
    return {
      remote(state: TreeState, update?: TreeModel) {
        return new Promise<TreeModel>((resolve, reject) => {
          //console.log(tree.toJSON());
          $.ajax({
            url: Settings.uBaseName + Settings.uServer + "tree.php",
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
      local(state: TreeState): TreeModel {
        //TODO : Figure out why local doesn't work =(
        return null;
      },
      success: treeActions.updateTree,
      error: treeActions.failed,
      loading: treeActions.loading,
      shouldFetch:() => true
    };
  }
};

export const treeSource = TreeSource;
