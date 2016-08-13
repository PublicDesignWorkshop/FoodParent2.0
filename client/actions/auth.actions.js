let alt = require('../alt');
import { browserHistory } from 'react-router';

let ServerSetting = require('./../../setting/server.json');
let AuthSource = require('./../sources/auth.source');

let MapActions = require('./../actions/map.actions');
let MapStore = require('./../stores/map.store');
let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
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
        // displayErrorMessage(localization(code));
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
        displayErrorMessage(localization(code));
        this.setCode(code);
      });
    }
  }
  processedLogout() {
    return (dispatch) => {
      dispatch();
      browserHistory.push({pathname: ServerSetting.uBase + '/'});
      // treeActions.fetchTrees();
      // foodActions.fetchFoods();
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
        // displayErrorMessage(localization(code));
        this.setCode(code);
      });
    }
  }
  processedLogin(props: IAuthProps) {
    return (dispatch) => {
      dispatch(props);
      if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
        if (TreeStore.getState().selected) {
          browserHistory.replace({pathname: ServerSetting.uBase + '/tree/' + TreeStore.getState().selected});
          TreeActions.fetchTrees();
        } else {
          browserHistory.replace({pathname: ServerSetting.uBase + '/'});
          TreeActions.fetchTrees();
        }
        // this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + parseInt(searchText)});
      } else if (MapStore.getState().latestMapType == MAPTYPE.DONATION) {
        // this.context.router.push({pathname: ServerSetting.uBase + '/recipient/' + parseInt(searchText)});
      }
    }
  }
}

module.exports = alt.createActions(AuthActions);
