import { browserHistory } from 'react-router';
import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { PersonModel, IPersonProps } from './../stores/person.store';
import { personSource } from './../sources/person.source';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { displaySuccessMessage, displayErrorMessage } from './../utils/message';
import { authActions } from './auth.actions';
import { localization } from './../constraints/localization';

var Settings = require('./../constraints/settings.json');

interface IPersonActions {
  createPerson(person: PersonModel);
  createdPerson(props: IPersonProps);
  fetchPersons(ids: Array<number>);
  fetchedPersons(props: Array<IPersonProps>);
  setCode(code: number);
}

class PersonActions extends AbstractActions implements IPersonActions {
  createPerson(person: PersonModel) {
    let self: PersonActions = this;
    return (dispatch) => {
      addLoading();
      dispatch();
      self.setCode(93);
      personSource.createPerson(person).then((response) => {
        displaySuccessMessage(localization(905));
        self.createdPerson(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  createdPerson(props: IPersonProps) {
    return (dispatch) => {
      authActions.fetchAuth();
      setTimeout(function() {
        browserHistory.goBack();
      }, 500);
      dispatch(props);
    }
  }
  fetchPersons(ids: Array<number>) {
    let self: PersonActions = this;
    if (ids != null && ids.length > 0) {
      return (dispatch) => {
        addLoading();
        dispatch();
        personSource.fetchPersons(ids).then((response) => {
          self.fetchedPersons(response);
          removeLoading();
        }).catch((code) => {
          self.setCode(code);
          removeLoading();
        });
      }
    }
    return null;
  }
  fetchedPersons(props: Array<IPersonProps>) {
    let self: PersonActions = this;
    return (dispatch) => {
      dispatch(props);
    }
  }
  setCode(code: number) {
    let self: PersonActions = this;
    return (dispatch) => {
      dispatch(code);
    }
  }












  //
  // updatePerson(person: PersonModel) {
  //   let self: PersonActions = this;
  //   console.warn("Update Person");
  //   removeLoading();
  //   return person;
  //   //return (dispatch) => {
  //   //  // we dispatch an event here so we can have "loading" state.
  //   //  dispatch({tree: tree, updatedTree: updatedTree});
  //   //}
  // }
  //
  // createPerson(person: PersonModel) {
  //   let self: PersonActions = this;
  //   console.warn("Create Person");
  //   removeLoading();
  //   return person;
  //   //return (dispatch) => {
  //   //  // we dispatch an event here so we can have "loading" state.
  //   //  dispatch({tree: tree, updatedTree: updatedTree});
  //   //}
  // }
  // deletePerson(person: PersonModel) {
  //   let self: PersonActions = this;
  //   console.warn("Delete Person");
  //   removeLoading();
  //   return person;
  //   //return (dispatch) => {
  //   //  // we dispatch an event here so we can have "loading" state.
  //   //  dispatch({tree: tree, updatedTree: updatedTree});
  //   //}
  // }
  // failed(errorMessage:any) {
  //   let self: PersonActions = this;
  //   console.warn("Person Failed");
  //   removeLoading();
  //   return errorMessage;
  // }
  // loading() {
  //   let self: PersonActions = this;
  //   addLoading();
  //   return "e300";
  //   // return (dispatch) => {
  //   //   // we dispatch an event here so we can have "loading" state.
  //   //   dispatch();
  //   // }
  // }
}

export const personActions = alt.createActions<IPersonActions>(PersonActions);
