import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { TreeModel, ITreeProps } from './../stores/tree.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { treeSource } from './../sources/tree.source';
import { displaySuccessMessage, displayErrorMessage } from './../utils/message';

interface ITreeActions {
  fetchTrees();
  fetchedTrees(treesProps: Array<ITreeProps>);
  updateTree(tree: TreeModel, success: string, error: string);
  updatedTree(props: ITreeProps);
  failed(code: number);
  // createTree(tree: TreeModel): void;
  // loading(): void;
}

class TreeActions extends AbstractActions implements ITreeActions {
  fetchTrees() {
    let self: TreeActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      treeSource.fetchTrees().then((response) => {
        removeLoading();
        self.fetchedTrees(response);
      }).catch((code) => {
        self.failed(parseInt(code));
      });
    }
  }
  fetchedTrees(treesProps: Array<ITreeProps>) {
    let self: TreeActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(treesProps);
    }
  }
  failed(code: number) {
    let self: TreeActions = this;
  }
  updateTree(tree: TreeModel, success: string, error: string) {
    let self: TreeActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      treeSource.updateTree(tree).then((response) => {
        removeLoading();
        displaySuccessMessage(success);
        self.updatedTree(response);
      }).catch((code) => {
        displayErrorMessage(error);
        self.failed(parseInt(code));
      });
    }
  }
  updatedTree(props: ITreeProps) {
    let self: TreeActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(props);
    }
  }
  // createTree(tree: TreeModel) {
  //   let self: TreeActions = this;
  //   console.warn("Create Tree");
  //   removeLoading();
  //   return tree;
  //   //return (dispatch) => {
  //   //  // we dispatch an event here so we can have "loading" state.
  //   //  dispatch({tree: tree, updatedTree: updatedTree});
  //   //}
  // }
  // failed(errorMessage:any) {
  //   let self: TreeActions = this;
  //   console.warn("Tree Failed");
  //   removeLoading();
  //   return errorMessage;
  // }
  // loading() {
  //   let self: TreeActions = this;
  //   addLoading();
  //   return (dispatch) => {
  //     // we dispatch an event here so we can have "loading" state.
  //     dispatch();
  //   }
  // }
}

export const treeActions = alt.createActions<ITreeActions>(TreeActions);
