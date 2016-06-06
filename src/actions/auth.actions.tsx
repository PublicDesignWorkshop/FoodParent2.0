import { browserHistory } from 'react-router';
import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { AuthModel, IAuthProps } from './../stores/auth.store';
import { IPersonProps } from './../stores/person.store';
import { authSource } from './../sources/auth.source';
import { personSource } from './../sources/person.source';
import { treeActions } from './tree.actions';
import { addLoading, removeLoading } from './../utils/loadingtracker';

var Settings = require('./../constraints/settings.json');

interface IAuthActions {
  fetchAuth();
  updateAuth(props: IAuthProps);
  fetchPerson(id: number);
  updatePerson(props: IPersonProps);
  failed(code: number);
  processLogout();
  updateLogout();
  processLogin(contact: string, password: string);
  updateLogin(props: IAuthProps);
}

class AuthActions extends AbstractActions implements IAuthActions {
  fetchAuth() {
    let self: AuthActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      authSource.fetchAuth().then((response) => {
        removeLoading();
        self.updateAuth({id: response.id, contact: response.contact, auth: response.auth})
      }).catch((code) => {
        self.failed(parseInt(code));
      });
    }
  }
  updateAuth(props: IAuthProps) {
    let self: AuthActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(props);
    }
  }
  fetchPerson(id: number) {
    let self: AuthActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      personSource.fetchPersons([id]).then((response) => {
        removeLoading();
        if (response.length == 1) {
          self.updatePerson(response[0]);
        }
      }).catch((code) => {
        removeLoading();
        self.failed(parseInt(code));
      });
    }
  }
  updatePerson(props: IPersonProps) {
    let self: AuthActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(props);
    }
  }
  processLogout() {
    let self: AuthActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      authSource.processLogout().then(() => {
        removeLoading();
        self.updateLogout();
      }).catch((code) => {
        self.failed(parseInt(code));
      });
    }
  }
  updateLogout() {
    let self: AuthActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
      browserHistory.push({pathname: Settings.uBaseName + '/'});
      treeActions.fetchTrees();
    }
  }
  processLogin(contact: string, password: string) {
    let self: AuthActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      authSource.processLogin(contact, password).then((response) => {
        removeLoading();
        self.updateLogin({id: response.id, auth: response.auth, contact: response.contact});
      }).catch((code) => {
        self.failed(parseInt(code));
      });
    }
  }
  updateLogin(props: IAuthProps) {
    let self: AuthActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(props);
      browserHistory.push({pathname: Settings.uBaseName + '/'});
      treeActions.fetchTrees();
    }
  }
  failed(code: number) {
    let self: AuthActions = this;
  }
}

export const authActions = alt.createActions<IAuthActions>(AuthActions);
