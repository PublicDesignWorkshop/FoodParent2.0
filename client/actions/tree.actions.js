let alt = require('../alt');

let TreeSource = require('./../sources/tree.source');


class TreeActions {
  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }
  refresh() {
    return (dispatch) => {
      dispatch();
    }
  }
  createTempTree() {
    return (dispatch) => {
      dispatch();
    }
  }
  fetchTree(id) {
    return (dispatch) => {
      dispatch();
      this.setCode(90); // check the 'errorlist.xlsx' to find the code list.
      TreeSource.fetchTree(id).then((response) => {
        this.fetchedTree(response);
      }).catch((code) => {
        // displayErrorMessage(localization(code));
        this.setCode(code);
      });
    }
  }
  fetchedTree(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  fetchTrees(id = -1) {
    return (dispatch) => {
      dispatch();
      this.setCode(90);
      TreeSource.fetchTrees(id).then((response) => {
        this.fetchedTrees(response);
      }).catch((code) => {
        // displayErrorMessage(localization(code));
        this.setCode(code);
      });
    }
  }
  fetchedTrees(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  setSelected(id) {
    return (dispatch) => {
      dispatch(id);
    }
  }
  setEditing(id, editing){
    return (dispatch) => {
      dispatch({id, editing});
    }
  }
  refresh() {
    return (dispatch) => {
      dispatch();
    }
  }
  createTree(tree) {
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
      this.setCode(92);
      TreeSource.createTree(tree).then((response) => {
        // displaySuccessMessage(localization(635));
        this.createdTree(response);
      }).catch((code) => {
        // displayErrorMessage(localization(code));
        this.setCode(code);
      });
    }
  }
  createdTree(props) {
    return (dispatch) => {
      // browserHistory.push({pathname: Settings.uBaseName + '/tree/' + props.id});
      // authActions.fetchAuth();
      dispatch(props);
    }
  }
  updateTree(tree) {
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
      this.setCode(92);
      TreeSource.updateTree(tree).then((response) => {
        // displaySuccessMessage(localization(634));
        this.updatedTree(response);
      }).catch((code) => {
        // displayErrorMessage(localization(code));
        this.setCode(code);
      });
    }
  }
  updatedTree(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  deleteTree(tree) {
    return (dispatch) => {
      dispatch();
      this.setCode(91);
      TreeSource.deleteTree(tree).then((response) => {
        // displayErrorMessage(localization(637));
        this.deletedTree(tree.toJSON());
      }).catch((code) => {
        // displayErrorMessage(localization(code));
        this.setCode(code);
      });
    }
  }
  deletedTree(props: ITreeProps) {
    return (dispatch) => {
      // browserHistory.replace({pathname: Settings.uBaseName + '/'});
      dispatch(props);
    }
  }
}

module.exports = alt.createActions(TreeActions);
