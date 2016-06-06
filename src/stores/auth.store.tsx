import * as ReactDOM from 'react-dom';
import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';
import * as L from 'leaflet';
import { browserHistory } from 'react-router';

var Settings = require('./../constraints/settings.json');
import { authActions } from './../actions/auth.actions';
import { AbstractStore } from './../stores/abstract.store';
import { IPersonProps, PersonModel } from './../stores/person.store';

export enum AuthStatus {
  NONE, ADMIN, MANAGER, PARENT, GUEST
}

export interface IAuthProps {
  id: string;
  contact: string;
  auth: string;
}

export class AuthModel {
  private id: number;
  private contact: string;
  private auth: AuthStatus;
  constructor(props: IAuthProps) {
    let self: AuthModel = this;
    self.id = parseInt(props.id);
    self.contact = props.contact;
    self.auth = parseInt(props.auth);
  }
  public getId(): number {
    return this.id;
  }
  public getContact(): string {
    return this.contact;
  }
  public getAuth(): AuthStatus {
    return this.auth;
  }
  public getIsAdmin(): boolean {
    if (this.auth == AuthStatus.ADMIN) {
      return true;
    }
    return false;
  }
  public getIsManager(): boolean {
    if (this.auth == AuthStatus.ADMIN || this.auth == AuthStatus.MANAGER) {
      return true;
    }
    return false;
  }
  public getIsParent(): boolean {
    if (this.auth == AuthStatus.PARENT) {
      return true;
    }
    return false;
  }
  public getIsGuest(): boolean {
    if (this.auth == AuthStatus.GUEST) {
      return true;
    }
    return false;
  }
}

export interface AuthState {
  auth: AuthModel;
  person: PersonModel;
  errorMessage: string;
}

interface AuthExtendedStore extends AltJS.AltStore<AuthState> {
  getAuth(): AuthModel;
}

class AuthStore extends AbstractStore<AuthState> {
  private auth: AuthModel;
  private person: PersonModel;
  private errorMessage: string;
  constructor() {
    super();
    let self: AuthStore = this;
    self.auth = new AuthModel({id: "0", contact: "", auth: AuthStatus.GUEST.toString()});
    self.person = new PersonModel({
      id: "0",
      auth: AuthStatus.GUEST.toString(),
      name: "",
      contact: "",
      neighborhood: "",
      updated: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.errorMessage = null;
    // TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleUpdateAuth: authActions.updateAuth,
      handleUpdatePerson: authActions.updatePerson,
      handleUpdateLogout: authActions.updateLogout,
      handleUpdateLogin: authActions.updateLogin,
    });
    self.exportPublicMethods({
      getAuth: self.getAuth,
      getPerson: self.getPerson,
    });
  }
  handleUpdateAuth(props: IAuthProps) {
    let self: AuthStore = this;
    self.auth = new AuthModel(props);
    self.errorMessage = null;
  }
  getAuth() {
    let self: AuthStore = this;
    return self.getState().auth;
  }
  handleUpdatePerson(props: IPersonProps) {
    let self: AuthStore = this;
    self.person = new PersonModel(props);
    self.errorMessage = null;
  }
  handleUpdateLogout() {
    let self: AuthStore = this;
    self.auth = new AuthModel({id: "0", contact: "", auth: AuthStatus.GUEST.toString()});
    self.person = new PersonModel({
      id: "0",
      auth: AuthStatus.GUEST.toString(),
      name: "",
      contact: "",
      neighborhood: "",
      updated: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.errorMessage = null;
  }
  handleUpdateLogin(props: IAuthProps) {
    let self: AuthStore = this;
    self.auth = new AuthModel(props);
    self.errorMessage = null;
  }
  getPerson() {
    let self: AuthStore = this;
    return self.getState().person;
  }
}

export const authStore: AuthExtendedStore = alt.createStore<AuthState>(AuthStore) as AuthExtendedStore;
