import { alt } from './../alt';
import * as Alt from 'alt';
import { browserHistory } from 'react-router';
import { AbstractActions } from "./abstract.actions";

var Settings = require('./../constraints/settings.json');
import { TreeModel, ITreeProps } from './../stores/tree.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { treeSource } from './../sources/tree.source';
import { displaySuccessMessage, displayErrorMessage } from './../utils/message';
import { localization } from './../constraints/localization';

interface ITreeActions {
  fetchTrees(id?: number);
  fetchedTrees(treesProps: Array<ITreeProps>);
  updateTree(tree: TreeModel);
  updatedTree(props: ITreeProps);
  adoptTree(tree: TreeModel);
  unadoptTree(tree: TreeModel);
  createTree(tree: TreeModel);
  createdTree(props: ITreeProps);
  deleteTree(tree: TreeModel);
  deletedTree(props: ITreeProps);
  resetTempTree();
  refresh();
  setCode(code: number);
  // createTree(tree: TreeModel): void;
  // loading(): void;
}

class TreeActions extends AbstractActions implements ITreeActions {
  setCode(code: number) {
    let self: TreeActions = this;
    return (dispatch) => {
      dispatch(code);
    }
  }
  fetchTrees(id?: number) {
    let self: TreeActions = this;
    return (dispatch) => {
      addLoading();
      dispatch();
      self.setCode(90);
      treeSource.fetchTrees(id).then((response) => {
        self.fetchedTrees(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  fetchedTrees(treesProps: Array<ITreeProps>) {
    let self: TreeActions = this;
    return (dispatch) => {
      dispatch(treesProps);
    }
  }
  updateTree(tree: TreeModel) {
    let self: TreeActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      self.setCode(92);
      treeSource.updateTree(tree).then((response) => {
        displaySuccessMessage(localization(634));
        self.updatedTree(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  adoptTree(tree: TreeModel) {
    let self: TreeActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      self.setCode(92);
      treeSource.updateTree(tree).then((response) => {
        displaySuccessMessage(localization(638));
        self.updatedTree(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  unadoptTree(tree: TreeModel) {
    let self: TreeActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      self.setCode(92);
      treeSource.updateTree(tree).then((response) => {
        displayErrorMessage(localization(639));
        self.updatedTree(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  updatedTree(props: ITreeProps) {
    let self: TreeActions = this;
    return (dispatch) => {
      dispatch(props);
    }
  }
  createTree(tree: TreeModel) {
    let self: TreeActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      self.setCode(92);
      treeSource.createTree(tree).then((response) => {
        displaySuccessMessage(localization(635));
        self.createdTree(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  createdTree(props: ITreeProps) {
    return (dispatch) => {
      browserHistory.push({pathname: Settings.uBaseName + '/tree/' + props.id});
      dispatch(props);
    }
  }
  resetTempTree() {
    return (dispatch) => {
      dispatch();
    }
  }
  refresh() {
    return (dispatch) => {
      dispatch();
    }
  }
  deleteTree(tree: TreeModel) {
    let self: TreeActions = this;
    return (dispatch) => {
      addLoading();
      dispatch();
      self.setCode(91);
      treeSource.deleteTree(tree).then((response) => {
        displayErrorMessage(localization(637));
        self.deletedTree(tree.toJSON());
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  deletedTree(props: ITreeProps) {
    let self: TreeActions = this;
    return (dispatch) => {
      browserHistory.replace({pathname: Settings.uBaseName + '/'});
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
