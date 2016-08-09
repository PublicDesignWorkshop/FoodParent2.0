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
}

module.exports = alt.createActions(TreeActions);
