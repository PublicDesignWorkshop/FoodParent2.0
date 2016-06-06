import { browserHistory } from 'react-router';
import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { PersonModel, IPersonProps } from './../stores/person.store';
import { personSource } from './../sources/person.source';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { displaySuccessMessage, displayErrorMessage } from './../utils/message';
import { authActions } from './auth.actions';

var Settings = require('./../constraints/settings.json');

interface IPersonActions {
  createPerson(person: PersonModel, success: string, error: string);
  createdPerson(props: IPersonProps);

  fetchPersons(ids: Array<number>);
  fetchedPersons(props: Array<IPersonProps>);
  // failed(code: number): void;
  // createPerson(person: PersonModel): void;
  // deletePerson(person: PersonModel): void;
  failed(errorMessage: any);
  // loading(): void;
}

class PersonActions extends AbstractActions implements IPersonActions {
  createPerson(person: PersonModel, success: string, error: string) {
    let self: PersonActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      personSource.createPerson(person).then((response) => {
        removeLoading();
        displaySuccessMessage(success);
        self.createdPerson(response);
      }).catch((code) => {
        removeLoading();
        displayErrorMessage(error);
        self.failed(parseInt(code));
      });
    }
  }
  createdPerson(props: IPersonProps) {
    return (dispatch) => {
      authActions.fetchAuth();
      setTimeout(function() {
        browserHistory.goBack();
      }, 500);
      // we dispatch an event here so we can have "loading" state.
      dispatch(props);
    }
  }

  fetchPersons(ids: Array<number>) {
    let self: PersonActions = this;
    if (ids != null && ids.length > 0) {
      return (dispatch) => {
        // we dispatch an event here so we can have "loading" state.
        addLoading();
        dispatch();
        personSource.fetchPersons(ids).then((response) => {
          removeLoading();
          self.fetchedPersons(response);
        }).catch((code) => {
          removeLoading();
          self.failed(parseInt(code));
        });
      }
    }
    return null;
  }
  fetchedPersons(props: Array<IPersonProps>) {
    let self: PersonActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(props);
    }
  }
  failed(code: number) {
    let self: PersonActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
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
