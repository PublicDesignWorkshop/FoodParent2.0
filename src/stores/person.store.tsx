import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';
import * as L from 'leaflet';
import { browserHistory } from 'react-router';

var Settings = require('./../constraints/settings.json');
import { personActions } from './../actions/person.actions';
import { AbstractStore } from './../stores/abstract.store';
import { personSource } from './../sources/person.source';
import { LogInStatus } from './../components/app.component';

export enum PersonType {
  NONE, CHANGE, POST, PICKUP
}

export interface IPersonProps {
  id: string;
  auth: string;
  name: string;
  contact: string;
  neighborhood: string;
  updated: string;
}

export class PersonModel {
  id: number;
  auth: LogInStatus;
  name: string;
  contact: string;
  neighborhood: string;
  updated: moment.Moment;

  constructor(props: IPersonProps) {
    let self: PersonModel = this;
    self.update(props);
  }
  public update(props: IPersonProps) {
    let self: PersonModel = this;
    self.id = parseInt(props.id);
    self.auth = parseInt(props.auth);
    self.name = props.name;
    self.contact = props.contact;
    self.neighborhood = props.neighborhood;
    self.updated = moment(props.updated);
  }
  public toJSON(): any {
    let self: PersonModel = this;
    return {
      id: self.id,
      auth: self.auth,
      name: self.name,
      contact: self.contact,
      neighborhood: self.neighborhood,
      updated: self.updated.format(Settings.sServerDateFormat),
    }
  }
  public getId(): number {
    return this.id
  }
  public getLogInStatus(): LogInStatus {
    return this.auth;
  }
  public setLogInStatus(login: LogInStatus): void {
    this.auth = login;
  }
  public getName(): string {
    return this.name;
  }
  public setName(name: string): void {
    this.name = name;
  }
  public getContact(): string {
    return this.contact;
  }
  public setContact(contact: string): void {
    this.contact = contact;
  }
  public getNeighborhood(): string {
    return this.neighborhood;
  }
  public setNeighborhood(neighborhood: string): void {
    this.neighborhood = neighborhood;
  }
  public getUpdated(): moment.Moment {
    return this.updated;
  }
  public setUpdated(updated: moment.Moment): void {
    this.updated = updated;
  }
  public getFormattedUpdated(): string {
    return this.updated.format(Settings.sUIDateFormat);
  }
}

export interface PersonState {
  persons: Array<PersonModel>;
  errorMessage: string;
}

interface PersonExtendedStore extends AltJS.AltStore<PersonState> {
  getPerson(id: number): PersonModel;
  addPerson(person: PersonModel): void;
  fetchPersons(ids: Array<number>): void;
  updatePerson(person: PersonModel): void;
  createPerson(person: PersonModel): void;
  deletePerson(person: PersonModel): void;
  isLoading(): boolean;
}

class PersonStore extends AbstractStore<PersonState> {
  private persons: Array<PersonModel>;
  private errorMessage: string;
  constructor() {
    super();
    let self: PersonStore = this;
    if (!self.persons) {
      self.persons = new Array<PersonModel>();
    }
    self.errorMessage = null;
    // TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleFetchPersons: personActions.fetchPersons,
      handleUpdatePerson: personActions.updatePerson,
      handleCreatePerson: personActions.createPerson,
      handleDeletePerson: personActions.deletePerson,
      handleLoading: personActions.loading,
      handleFailed: personActions.failed,
    });
    self.exportPublicMethods({
      getPerson: self.getPerson,
      addPerson: self.addPerson,
    });
    self.exportAsync(personSource);
  }
  handleFetchPersons(personsProps: Array<IPersonProps>) {
    let self: PersonStore = this;
    console.warn("Handle Fetch Personss");
    let person: PersonModel;
    if (self.persons) {
      let persons = self.persons.filter(person => person.getId() == 0);
      if (persons.length > 0) {
        person = persons[0];
      }
    }
    self.persons = new Array<PersonModel>();
    if (person) {
      self.persons.push(person);
    }
    personsProps.forEach((props: IPersonProps) => {
      self.persons.push(new PersonModel(props));
    });
    self.errorMessage = null;
  }
  handleUpdatePerson(personProps: IPersonProps) {
    let self: PersonStore = this;
    console.warn("Handle Update Person");
    let persons = self.persons.filter(person => person.getId() == parseInt(personProps.id));
    if (persons.length == 1) {
      persons[0].update(personProps);
    }
    self.errorMessage = "e704";
    setTimeout(function() {
      self.errorMessage = null;
    }, Settings.iErrorMessageDuration);
  }
  handleCreatePerson(personProps: IPersonProps) {
    let self: PersonStore = this;
    console.warn("Handle Create Person");
    self.persons.push(new PersonModel(personProps));
    self.errorMessage = "e700";
    setTimeout(function() {
      self.errorMessage = null;
    }, Settings.iErrorMessageDuration);

    // Reset a new person
    let person: PersonModel = new PersonModel({
      id: "0",
      auth: LogInStatus.PARENT.toString(),
      name: "",
      contact: "",
      neighborhood: "",
      updated: moment(new Date()).format(Settings.sServerDateFormat),
    });
    let i = -1;
    for(let j = 0; j < self.persons.length; j++) {
      if(self.persons[j].getId() === person.getId()) {
        i = j;
      }
    }
    if (i > -1) {
      self.persons.splice(i, 1);
    }
    self.persons.push(person);
    // self.context.router.push({pathname: window.location.pathname});
    location.reload();
    // browserHistory.push({pathname: Settings.uBaseName + '/trees/' + tree.getId()});
  }
  handleDeletePerson(personProps: IPersonProps) {
    let self: PersonStore = this;
    let i = -1;
    for(let j = 0; j < self.persons.length; j++) {
      if(self.persons[j].getId() === parseInt(personProps.id)) {
        i = j;
      }
    }
    if (i > -1) {
      self.persons.splice(i, 1);
    }
  }
  handleLoading(errorMessage: string) {
    let self: PersonStore = this;
    self.errorMessage = errorMessage;
  }
  handleFailed(errorMessage: string) {
    let self: PersonStore = this;
    console.warn("Handle Person Failed");
    self.errorMessage = errorMessage;
  }
  getPerson(id: number): PersonModel {
    let self: PersonStore = this;
    let persons = self.getState().persons.filter(person => person.getId() == id);
    if (persons.length == 1) {
      return persons[0];
    }
    return null;
  }
  addPerson(person: PersonModel): void {
    let self: PersonStore = this;
    let persons = self.getState().persons;
    let i = -1;
    for(let j = 0; j < persons.length; j++) {
      if(persons[j].getId() === person.getId()) {
        i = j;
      }
    }
    if (i > -1) {
      persons.splice(i, 1);
    }
    persons.push(person);
  }
}

export const personStore: PersonExtendedStore = alt.createStore<PersonState>(PersonStore) as PersonExtendedStore;
