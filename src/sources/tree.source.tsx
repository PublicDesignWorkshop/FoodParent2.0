import * as $ from 'jquery';
import 'es6-promise';

var Settings = require('./../constraints/settings.json');
import { treeActions } from './../actions/tree.actions';
import { treeStore, TreeModel, TreeState } from './../stores/tree.store';


let TreeSource = {
  fetchTrees(id?: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "trees.php",
        type: 'GET',
        data: {
          id: id,
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.trees);
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
  fetchTree(id: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "tree.php",
        type: 'GET',
        data: {
          id: id,
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.tree);
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
  updateTree(tree: TreeModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "tree.php",
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(tree.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.tree);
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
  createTree(tree: TreeModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "tree.php",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(tree.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.tree);
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
  deleteTree(tree: TreeModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "tree.php",
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(tree.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.tree[0]);
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
  //
  //
  //
  // fetchTrees(): AltJS.SourceModel<Array<TreeModel>> {
  //   return {
  //     remote(state: TreeState) {
  //       return new Promise<Array<TreeModel>>((resolve, reject) => {
  //         $.ajax({
  //           url: Settings.uBaseName + Settings.uServer + "trees.php",
  //           data: {
  //
  //           },
  //           success: function(response) {
  //             resolve($.parseJSON(response));
  //           },
  //           error: function(response) {
  //             console.log(response);
  //             reject(response);
  //           }
  //         });
  //       })
  //     },
  //     local(state: TreeState): Array<TreeModel> {
  //       //TODO : Figure out why local doesn't work =(
  //       return null;
  //     },
  //     success: treeActions.fetchTrees,
  //     error: treeActions.failed,
  //     loading: treeActions.loading,
  //     shouldFetch:() => true
  //   };
  // },
  // updateTree(): AltJS.SourceModel<TreeModel> {
  //   return {
  //     remote(state: TreeState, update?: TreeModel) {
  //       console.log(update);
  //       return new Promise<TreeModel>((resolve, reject) => {
  //         //console.log(tree.toJSON());
  //         $.ajax({
  //           url: Settings.uBaseName + Settings.uServer + "tree.php",
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
  //     local(state: TreeState): TreeModel {
  //       //TODO : Figure out why local doesn't work =(
  //       return null;
  //     },
  //     success: treeActions.updateTree,
  //     error: treeActions.failed,
  //     loading: treeActions.loading,
  //     shouldFetch:() => true
  //   };
  // },
  // createTree(): AltJS.SourceModel<TreeModel> {
  //   return {
  //     remote(state: TreeState, create?: TreeModel) {
  //       return new Promise<TreeModel>((resolve, reject) => {
  //         //console.log(tree.toJSON());
  //         $.ajax({
  //           url: Settings.uBaseName + Settings.uServer + "tree.php",
  //           type: 'POST',
  //           contentType: 'application/json',
  //           data: JSON.stringify(create.toJSON()),
  //           dataType: "json",
  //           success: function(response) {
  //             resolve(response);
  //           },
  //           error: function(response) {
  //             console.log(response);
  //             reject(response);
  //           }
  //         });
  //       })
  //     },
  //     local(state: TreeState): TreeModel {
  //       //TODO : Figure out why local doesn't work =(
  //       return null;
  //     },
  //     success: treeActions.createTree,
  //     error: treeActions.failed,
  //     loading: treeActions.loading,
  //     shouldFetch:() => true
  //   };
  // }
};

export const treeSource = TreeSource;
