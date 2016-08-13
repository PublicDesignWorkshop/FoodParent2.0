let alt = require('./../alt');
import moment from 'moment';

let ServerSetting = require('./../../setting/server.json');
let PersonActions = require('./../actions/person.actions');
import { AUTHTYPE } from './../utils/enum';


export class PersonModel {
  constructor(props) {
    this.update(props);
  }
  toJSON() {
    let auth;
    switch(this.auth) {
      case AUTHTYPE.ADMIN:
        auth = 1;
        break;
      case AUTHTYPE.MANAGER:
        auth = 2;
        break;
      case AUTHTYPE.PARENT:
        auth = 3;
        break;
      case AUTHTYPE.GUEST:
        auth = 4;
        break;
    }
    return {
      id: this.id,
      auth: auth,
      name: this.name,
      contact: this.contact,
      neighborhood: this.neighborhood,
      updated: this.updated.format(ServerSetting.sServerDateFormat),
    }
  }
  update(props) {
    this.id = parseInt(props.id);
    switch(parseInt(props.auth)) {
      case 1:
        this.auth = AUTHTYPE.ADMIN;
        break;
      case 2:
        this.auth = AUTHTYPE.MANAGER;
        break;
      case 3:
        this.auth = AUTHTYPE.PARENT;
        break;
      case 4:
        this.auth = AUTHTYPE.GUEST;
        break;
    }
    this.name = props.name;
    this.contact = props.contact;
    this.neighborhood = props.neighborhood;
    this.updated = moment(props.updated);
  }
  getFormattedAuth() {
    switch(this.auth) {
      case AUTHTYPE.ADMIN:
        return "Guest";
      case AUTHTYPE.MANAGER:
        return "Parent";
      case AUTHTYPE.PARENT:
        return "Manager";
      case AUTHTYPE.GUEST:
        return "Admin";
      default:
        return "N/A";
    }
  }
  getFormattedUpdated() {
    return this.updated.format(ServerSetting.sUIDateFormat);
  }
}

class PersonStore {
  constructor() {
    this.user = null;
    this.persons = [];
    this.code = 0;
    // Bind action methods to store.
    this.bindListeners({
      handleFetchedUser: PersonActions.FETCHED_USER,
      handleFetchedPersons: PersonActions.FETCHED_PERSONS,
      handleSetCode: PersonActions.SET_CODE,
    });
    // Expose public methods.
    this.exportPublicMethods({

    });
  }
  handleSetCode(code) {
    this.code = code;
  }
  handleFetchedUser(props) {
    if (props.length > 0) {
      this.user = new PersonModel(props[0]);
    }
    this.code = 200;
  }
  handleFetchedPersons(props) {
    this.persons = [];
    props.forEach((prop) => {
      this.persons.push(new PersonModel(prop));
    });
    self.code = 200;
  }
}

module.exports = alt.createStore(PersonStore, 'PersonStore');
