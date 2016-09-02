let alt = require('../alt');

let TreeSource = require('./../sources/tree.source');
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
import { localization } from './../utils/localization';


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
        if (response === false) {
          displayFailMessage(localization(65));
        }
        this.fetchedTree(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
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
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  fetchedTrees(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }


  fetchTreesFromContact(personId) {
    return (dispatch) => {
      dispatch();
      this.setCode(90);
      TreeSource.fetchTreesFromContact(personId).then((response) => {
        this.fetchedTreesFromContact(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  fetchedTreesFromContact(props) {
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
  // Create a new tree item in the database, and add the tree id in a browser cookie so that user can edit for 15 minues after adding a tree.
  createTree(tree) {
    if (tree.food == 0) {
      displayFailMessage(localization(643));
      this.setCode(643);
    } else {
      return (dispatch) => {
        // we dispatch an event here so we can have "loading" state.
        dispatch();
        this.setCode(92);
        TreeSource.createTree(tree).then((response) => {
          displaySuccessMessage(localization(635));
          this.createdTree(response);
        }).catch((code) => {
          displayFailMessage(localization(code));
          if (__DEV__) {
            console.error(localization(code));
          }
          this.setCode(code);
        });
      }
    }
  }
  createdTree(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  updateTree(tree) {
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
      this.setCode(92);
      TreeSource.updateTree(tree).then((response) => {
        displaySuccessMessage(localization(634));
        this.updatedTree(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
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
        displayFailMessage(localization(637));
        this.deletedTree(tree.toJSON());
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  deletedTree(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  reset() {
    return (dispatch) => {
      dispatch();
    }
  }
}

module.exports = alt.createActions(TreeActions);
