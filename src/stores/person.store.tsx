import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';
import * as L from 'leaflet';
import { browserHistory } from 'react-router';

var Settings = require('./../constraints/settings.json');
import { personActions } from './../actions/person.actions';
import { AbstractStore } from './../stores/abstract.store';
import { AuthStatus } from './../stores/auth.store';

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
  auth: AuthStatus;
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
  public getAuth(): AuthStatus {
    return this.auth;
  }
  public setAuth(auth: AuthStatus): void {
    this.auth = auth;
  }
  public getFormattedAuth(): string {
    if (this.auth == AuthStatus.GUEST) {
      return "Guest";
    } else if (this.auth == AuthStatus.PARENT) {
      return "Parent";
    } else if (this.auth == AuthStatus.MANAGER) {
      return "Manager";
    } else if (this.auth == AuthStatus.ADMIN) {
      return "Admin";
    }
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
  temp: PersonModel;
  persons: Array<PersonModel>;
  errorMessage: string;
}

interface PersonExtendedStore extends AltJS.AltStore<PersonState> {
  getTempPerson(): PersonModel;
}

class PersonStore extends AbstractStore<PersonState> {
  private temp: PersonModel;
  private persons: Array<PersonModel>;
  private errorMessage: string;
  constructor() {
    super();
    let self: PersonStore = this;
    self.persons = new Array<PersonModel>();
    self.temp = new PersonModel({
      id: "0",
      // Some reason, which I don't know, it cannot read the value in a constructor.
      // auth: AuthStatus.GUEST.toString(),
      auth: "4",
      name: "",
      contact: "",
      neighborhood: "",
      updated: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.errorMessage = null;
    // TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleCreatedPerson: personActions.createdPerson,
      handleFetchedPersons: personActions.fetchedPersons,

      
      // handleCreatePerson: personActions.createPerson,
      // handleDeletePerson: personActions.deletePerson,
      // handleLoading: personActions.loading,
      handleFailed: personActions.failed,
    });
    self.exportPublicMethods({
      getTempPerson: self.getTempPerson,
      getPerson: self.getPerson,
      // addPerson: self.addPerson,
    });
    // self.exportAsync(personSource);
  }
  getTempPerson(): PersonModel {
    let self: PersonStore = this;
    return self.getState().temp;
  }
  handleCreatedPerson(personProps: IPersonProps) {
    let self: PersonStore = this;
    self.persons.push(new PersonModel(personProps));
    self.temp = new PersonModel({
      id: "0",
      auth: AuthStatus.PARENT.toString(),
      name: "",
      contact: "",
      neighborhood: "",
      updated: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.errorMessage = null;
  }




  handleFetchedPersons(personProps: Array<IPersonProps>) {
    let self: PersonStore = this;
    self.persons = new Array<PersonModel>();
    personProps.forEach((props: IPersonProps) => {
      self.persons.push(new PersonModel(props));
    });
    self.errorMessage = null;
  }
  handleFailed(code: number) {
    let self: PersonStore = this;
  }



  // handleFetchPersons(personsProps: Array<IPersonProps>) {
  //   let self: PersonStore = this;
  //   console.warn("Handle Fetch Personss");
  //   let person: PersonModel;
  //   if (self.persons) {
  //     let persons = self.persons.filter(person => person.getId() == 0);
  //     if (persons.length > 0) {
  //       person = persons[0];
  //     }
  //   }
  //   self.persons = new Array<PersonModel>();
  //   if (person) {
  //     self.persons.push(person);
  //   }
  //   personsProps.forEach((props: IPersonProps) => {
  //     self.persons.push(new PersonModel(props));
  //   });
  //   self.errorMessage = null;
  // }
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
