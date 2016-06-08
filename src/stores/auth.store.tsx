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
  code: any;
}

interface AuthExtendedStore extends AltJS.AltStore<AuthState> {
  getAuth(): AuthModel;
}

class AuthStore extends AbstractStore<AuthState> {
  private auth: AuthModel;
  private person: PersonModel;
  code: any;
  constructor() {
    super();
    let self: AuthStore = this;
    self.auth = new AuthModel({id: "0", contact: "", auth: AuthStatus.GUEST.toString()});
    self.code = 200;
    // TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleFechedAuth: authActions.fetchedAuth,
      handleFechedPerson: authActions.fetchedPerson,
      handleProcessedLogout: authActions.processedLogout,
      handleProcessedLogin: authActions.processedLogin,
      handleSetCode: authActions.setCode,
    });
    self.exportPublicMethods({
      getAuth: self.getAuth,
      getPerson: self.getPerson,
    });
  }
  getAuth() {
    let self: AuthStore = this;
    return self.getState().auth;
  }
  getPerson() {
    let self: AuthStore = this;
    return self.getState().person;
  }
  handleFechedAuth(props: IAuthProps) {
    let self: AuthStore = this;
    self.auth = new AuthModel(props);
    self.code = 200;
  }
  handleFechedPerson(props: IPersonProps) {
    let self: AuthStore = this;
    self.person = new PersonModel(props);
    self.code = 200;
  }
  handleProcessedLogout() {
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
    self.code = 200;
  }
  handleProcessedLogin(props: IAuthProps) {
    let self: AuthStore = this;
    self.auth = new AuthModel(props);
    self.code = 200;
  }
  handleSetCode(code: any) {
    let self: AuthStore = this;
    self.code = code;
  }
}

export const authStore: AuthExtendedStore = alt.createStore<AuthState>(AuthStore) as AuthExtendedStore;
