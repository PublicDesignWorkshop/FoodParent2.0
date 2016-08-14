let alt = require('./../alt');
import moment from 'moment';
import { browserHistory } from 'react-router';

let ServerSetting = require('./../../setting/server.json');
let PersonActions = require('./../actions/person.actions');
let AuthActions = require('./../actions/auth.actions');
let TreeActions = require('./../actions/tree.actions');
let MapStore = require('./../stores/map.store');
let TreeStore = require('./../stores/tree.store');

import { AUTHTYPE, MAPTYPE } from './../utils/enum';


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
        return "Admin";
      case AUTHTYPE.MANAGER:
        return "Manager";
      case AUTHTYPE.PARENT:
        return "Parent";
      case AUTHTYPE.GUEST:
        return "Guest";
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
    this.temp = null;
    this.persons = [];
    this.code = 0;
    // Bind action methods to store.
    this.bindListeners({
      handleFetchedUser: PersonActions.FETCHED_USER,
      handleFetchedPersons: PersonActions.FETCHED_PERSONS,
      handleCreateTempPerson: PersonActions.CREATE_TEMP_PERSON,
      handleCreatedPerson: PersonActions.CREATED_PERSON,
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
    this.temp = new PersonModel(props[0]);
    this.code = 200;
  }
  handleFetchedPersons(props) {
    this.persons = [];
    props.forEach((prop) => {
      this.persons.push(new PersonModel(prop));
    });
    self.code = 200;
  }
  handleCreateTempPerson() { // id = 0 for new person.
    this.temp = new PersonModel({
      id: "0",
      auth: "3",  // auth = 3 for Parent
      name: "",
      contact: "",
      neighborhood: "",
      updated: moment(new Date()).format(ServerSetting.sServerDateFormat),
    });
    this.code = 200;
  }
  handleCreatedPerson(props) {
    console.log(props);
    if (props.length > 0) {
      this.user = new PersonModel(props);
    }
    this.temp = new PersonModel(props);
    setTimeout(function() { // Process router on a separate thread because FLUX action shouldn't evoke another action.
      AuthActions.fetchAuth();
    }, 1);
    if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
      if (TreeStore.getState().selected) {
        setTimeout(function() { // Process router on a separate thread because FLUX action shouldn't evoke another action.
          if (this.auth.auth == AUTHTYPE.PARENT) {
            browserHistory.replace({pathname: ServerSetting.uBase + '/tree/' + TreeStore.getState().selected});
          } else {
            TreeActions.fetchTrees();
            browserHistory.replace({pathname: ServerSetting.uBase + '/'});
          }
        }.bind(this), 1);
      } else {
        setTimeout(function() { // Process router on a separate thread because FLUX action shouldn't evoke another action.
          browserHistory.replace({pathname: ServerSetting.uBase + '/'});
        }, 1);
      }
    } else {
      setTimeout(function() { // Process router on a separate thread because FLUX action shouldn't evoke another action.
        browserHistory.replace({pathname: ServerSetting.uBase + '/'});
      }, 1);
    }
    this.code = 200;
  }
}

module.exports = alt.createStore(PersonStore, 'PersonStore');
