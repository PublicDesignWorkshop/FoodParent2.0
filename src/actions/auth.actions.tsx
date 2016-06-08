import { browserHistory } from 'react-router';
import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";

var Settings = require('./../constraints/settings.json');
import { AuthModel, IAuthProps } from './../stores/auth.store';
import { IPersonProps } from './../stores/person.store';
import { authSource } from './../sources/auth.source';
import { personSource } from './../sources/person.source';
import { treeActions } from './tree.actions';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { displaySuccessMessage, displayErrorMessage } from './../utils/message';
import { localization } from './../constraints/localization';

interface IAuthActions {
  fetchAuth();
  fetchedAuth(props: IAuthProps);
  fetchPerson(id: number);
  fetchedPerson(props: IPersonProps);
  processLogout();
  processedLogout();
  processLogin(contact: string, password: string);
  processedLogin(props: IAuthProps);
  setCode(code: number);
}

class AuthActions extends AbstractActions implements IAuthActions {
  fetchAuth() {
    let self: AuthActions = this;
    return (dispatch) => {
      addLoading();
      dispatch();
      self.setCode(90);
      authSource.fetchAuth().then((response) => {
        self.fetchedAuth({id: response.id, contact: response.contact, auth: response.auth})
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  fetchedAuth(props: IAuthProps) {
    let self: AuthActions = this;
    return (dispatch) => {
      dispatch(props);
    }
  }
  fetchPerson(id: number) {
    let self: AuthActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      self.setCode(90);
      personSource.fetchPersons([id]).then((response) => {
        if (response.length > 0) {
          self.fetchedPerson(response[0]);
        }
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  fetchedPerson(props: IPersonProps) {
    let self: AuthActions = this;
    return (dispatch) => {
      dispatch(props);
    }
  }
  processLogout() {
    let self: AuthActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      self.setCode(90);
      authSource.processLogout().then(() => {
        self.processedLogout();
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  processedLogout() {
    let self: AuthActions = this;
    return (dispatch) => {
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
      dispatch();
      self.setCode(90);
      authSource.processLogin(contact, password).then((response) => {
        self.processedLogin({id: response.id, auth: response.auth, contact: response.contact});
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  processedLogin(props: IAuthProps) {
    let self: AuthActions = this;
    return (dispatch) => {
      dispatch(props);
      browserHistory.push({pathname: Settings.uBaseName + '/'});
      treeActions.fetchTrees();
    }
  }
  setCode(code: number) {
    let self: AuthActions = this;
    return (dispatch) => {
      dispatch(code);
    }
  }
}

export const authActions = alt.createActions<IAuthActions>(AuthActions);
