let alt = require('../alt');

let MapSetting = require('./../../setting/map.json');
let FlagSource = require('./../sources/flag.source');

import { localization } from './../utils/localization';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';

class FlagActions {
  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }
  fetchFlags() {
    return (dispatch) => {
      dispatch();
      this.setCode(90);
      FlagSource.fetchFlags().then((response) => {
        this.fetchedFlags(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  fetchedFlags(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
}

module.exports = alt.createActions(FlagActions);
