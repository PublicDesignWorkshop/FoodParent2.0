let alt = require('./../alt');
import $ from 'jquery';
import moment from 'moment';

let AuthActions = require('./../actions/auth.actions');
import { AUTHTYPE } from './../utils/enum';


export class AuthModel {
  constructor(props) {
    this.update(props);
  }
  toJSON() {
    let auth;
    switch(this.auth) {
      case AUTHTYPE.ADMIN:
        auth = 1;
        break;
      case AUTHTYPE.MANAGER:
        auth = 2;
        break;
      case AUTHTYPE.PARENT:
        auth = 3;
        break;
      case AUTHTYPE.GUEST:
        auth = 4;
        break;
    }
    return {
      id: this.id,
      contact: this.contact,
      auth: auth,
      trees: this.trees,
    }
  }
  update(props) {
    this.id = parseInt(props.id);
    this.contact = props.contact;
    switch(parseInt(props.auth)) {
      case 1:
        this.auth = AUTHTYPE.ADMIN;
        break;
      case 2:
        this.auth = AUTHTYPE.MANAGER;
        break;
      case 3:
        this.auth = AUTHTYPE.PARENT;
        break;
      case 4:
        this.auth = AUTHTYPE.GUEST;
        break;
    }
    this.trees = [];
    if (props.trees) {
      this.trees = props.trees.split(',').map((tree) => {
        return parseInt(tree);
      });
    }
  }
  isManager() {
    switch(this.auth) {
      case AUTHTYPE.ADMIN:
        return true;
      case AUTHTYPE.MANAGER:
        return true;
      case AUTHTYPE.PARENT:
        return false;
      case AUTHTYPE.GUEST:
        return false;
      default:
        return false;
    }
  }
  isRecentlyAddedByUser(treeId) {
    if ($.inArray(treeId, this.trees) > -1) {
      return true;
    }
    return false;
  }
  canEditTree(treeId) {
    if (this.isManager()) {
      return true;
    }
    if (this.isRecentlyAddedByUser(treeId)) {
      return true;
    }
    return false;
  }
}

class AuthStore {
  constructor() {
    this.auth = null;
    this.code = 0;
    // Bind action methods to store.
    this.bindListeners({
      handleFechedAuth: AuthActions.FETCHED_AUTH,
      handleProcessedLogout: AuthActions.PROCESSED_LOGOUT,
      handleProcessedLogin: AuthActions.PROCESSED_LOGIN,
    });
    // Expose public methods.
    this.exportPublicMethods({

    });
  }
  handleFechedAuth(props) {
    this.auth = new AuthModel(props);
    this.code = 200;
    console.log(this.auth);
  }
  handleProcessedLogout() {
    this.auth = new AuthModel({id: "0", contact: "", auth: 4, trees: null});
    this.code = 200;
    console.log(this.auth);
  }
  handleProcessedLogin(props) {
    this.auth = new AuthModel(props);
    this.code = 200;
    console.log(this.auth);
  }
}

module.exports = alt.createStore(AuthStore, 'AuthStore');
