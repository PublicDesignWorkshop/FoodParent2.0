import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { TreeModel } from './../stores/tree.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';

interface ITreeActions {
  fetchTrees(trees: Array<TreeModel>);
  updateTree(tree: TreeModel): void;
  createTree(tree: TreeModel): void;
  failed(errorMessage: any);
  loading(): void;
}

class TreeActions extends AbstractActions implements ITreeActions {
  fetchTrees(trees: Array<TreeModel>) {
    let self: TreeActions = this;
    console.warn("Fetch Trees");
    removeLoading();
    return trees;
  }
  updateTree(tree: TreeModel) {
    let self: TreeActions = this;
    console.warn("Update Tree");
    removeLoading();
    return tree;
    //return (dispatch) => {
    //  // we dispatch an event here so we can have "loading" state.
    //  dispatch({tree: tree, updatedTree: updatedTree});
    //}
  }
  createTree(tree: TreeModel) {
    let self: TreeActions = this;
    console.warn("Create Tree");
    removeLoading();
    return tree;
    //return (dispatch) => {
    //  // we dispatch an event here so we can have "loading" state.
    //  dispatch({tree: tree, updatedTree: updatedTree});
    //}
  }
  failed(errorMessage:any) {
    let self: TreeActions = this;
    console.warn("Tree Failed");
    removeLoading();
    return errorMessage;
  }
  loading() {
    let self: TreeActions = this;
    addLoading();
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
    }
  }
}

export const treeActions = alt.createActions<ITreeActions>(TreeActions);
