import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { PersonModel } from './../stores/person.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';

interface IPersonActions {
  fetchPersons(persons: Array<PersonModel>);
  updatePerson(person: PersonModel): void;
  createPerson(person: PersonModel): void;
  deletePerson(person: PersonModel): void;
  failed(errorMessage: any);
  loading(): void;
}

class PersonActions extends AbstractActions implements IPersonActions {
  fetchPersons(persons: Array<PersonModel>) {
    let self: PersonActions = this;
    console.warn("Fetch Persons");
    removeLoading();
    return persons;
  }
  updatePerson(person: PersonModel) {
    let self: PersonActions = this;
    console.warn("Update Person");
    removeLoading();
    return person;
    //return (dispatch) => {
    //  // we dispatch an event here so we can have "loading" state.
    //  dispatch({tree: tree, updatedTree: updatedTree});
    //}
  }
  createPerson(person: PersonModel) {
    let self: PersonActions = this;
    console.warn("Create Person");
    removeLoading();
    return person;
    //return (dispatch) => {
    //  // we dispatch an event here so we can have "loading" state.
    //  dispatch({tree: tree, updatedTree: updatedTree});
    //}
  }
  deletePerson(person: PersonModel) {
    let self: PersonActions = this;
    console.warn("Delete Person");
    removeLoading();
    return person;
    //return (dispatch) => {
    //  // we dispatch an event here so we can have "loading" state.
    //  dispatch({tree: tree, updatedTree: updatedTree});
    //}
  }
  failed(errorMessage:any) {
    let self: PersonActions = this;
    console.warn("Person Failed");
    removeLoading();
    return errorMessage;
  }
  loading() {
    let self: PersonActions = this;
    addLoading();
    return "e300";
    // return (dispatch) => {
    //   // we dispatch an event here so we can have "loading" state.
    //   dispatch();
    // }
  }
}

export const personActions = alt.createActions<IPersonActions>(PersonActions);
