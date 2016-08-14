let alt = require('../alt');
import { browserHistory } from 'react-router';

let ServerSetting = require('./../../setting/server.json');
let AuthSource = require('./../sources/auth.source');

let MapActions = require('./../actions/map.actions');
let MapStore = require('./../stores/map.store');
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');

import { localization } from './../utils/localization';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
import { MAPTYPE } from './../utils/enum';


class AuthActions {
  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }
  fetchAuth() {
    return (dispatch) => {
      dispatch();
      this.setCode(90);
      AuthSource.fetchAuth().then((response) => {
        this.fetchedAuth(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  fetchedAuth(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  processLogout() {
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
      this.setCode(90);
      AuthSource.processLogout().then(() => {
        this.processedLogout();
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  processedLogout() {
    return (dispatch) => {
      dispatch();
      TreeActions.fetchTrees();
    }
  }
  processLogin(contact, password) {
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
      this.setCode(90);
      AuthSource.processLogin(contact, password).then((response) => {
        this.processedLogin(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  processedLogin(props: IAuthProps) {
    return (dispatch) => {
      dispatch(props);
    }
  }
}

module.exports = alt.createActions(AuthActions);
