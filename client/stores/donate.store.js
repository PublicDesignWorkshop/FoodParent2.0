let alt = require('./../alt');
import * as L from 'leaflet';
import moment from 'moment';
import * as _ from 'underscore';
import { browserHistory } from 'react-router';

import { AMOUNTTYPE, NOTETYPE, PICKUPTIME } from './../utils/enum';
import { sortNoteByDateDESC } from './../utils/sort';

let MapSetting = require('./../../setting/map.json');
let ServerSetting = require('./../../setting/server.json');
let DonateActions = require('./../actions/donate.actions');
let FlagStore = require('./../stores/flag.store');
let AuthStore = require('./../stores/auth.store');
let AuthActions = require('./../actions/auth.actions');

import { DonateModel } from './donate.model';


class DonateStore {
  constructor() {
    this.temp = null;
    this.donates = [];
    this.code = 0;
    // Bind action methods to store.
    this.bindListeners({
      handleSetCode: DonateActions.SET_CODE,
      handleFetchedDonates: DonateActions.FETCHED_DONATES,
      handleCreateTempDonate: DonateActions.CREATE_TEMP_DONATE,
      handleUpdatedDonate: DonateActions.UPDATED_DONATE,
      handleCreatedDonate: DonateActions.CREATED_DONATE,
      handleDeletedDonate: DonateActions.DELETED_DONATE,
      handleSetSelected: DonateActions.SET_SELECTED,
    });
    // Expose public methods.
    this.exportPublicMethods({
      getDonate: this.getDonate,
    });
  }
  getDonate(id) {
    let donates = this.getState().donates.filter(donate => donate.id == id);
    if (donates.length == 1) {
      return donates[0];
    }
    return null;
  }
  handleSetCode(code) {
    this.code = code;
  }
  handleFetchedDonates(props) {
    this.donates = [];
    props.forEach((props) => {
      if (props != false) {
        this.donates.push(new DonateModel(props));
      }
    });
    this.code = 200;
  }
  handleCreateTempDonate(locationId) { // id = 0 for new donate.
    // let notes = this.notes.filter(note => note.id == 0);
    // if (notes.length > 0) {
    //   this.notes = _.without(this.notes, ...notes);
    // }
    this.temp = new DonateModel({
      id: "0",
      type: "4",
      location: locationId,
      food: "0",
      tree: "0",
      person: AuthStore.getState().auth.contact,
      comment: "",
      picture: "",
      amount: "0",
      date: moment(new Date()).format(ServerSetting.sServerDateFormat),
    });
    this.temp.editing = true;
    this.code = 200;
  }
  handleSetSelected(id) {
    let donates = this.donates.filter(donate => donate.id == parseInt(id));
    if (donates.length > 0) {
      this.temp = new DonateModel(donates[0].toJSON());
    } else {
      this.temp = null;
    }
    this.code = 200;
  }
  handleUpdatedDonate(props) {
    let donates = this.donates.filter(donate => donate.id == parseInt(props.id));
    if (donates.length == 1) {
      donates[0].update(props);
      // this.temp = new DonateModel(donates[0].toJSON());
    }
    this.donates = this.donates.sort(sortNoteByDateDESC);
    this.code = 200;
  }
  handleCreatedDonate(props) {
    let donates = this.donates.filter(donate => donate.id == parseInt(props.id));
    if (donates.length > 0) {
      donates[0].update(props);
      // this.temp = new DonateModel(donates[0].toJSON());
    } else {
      this.donates.push(new DonateModel(props));
    }
    this.temp = new DonateModel(props);
    this.donates = this.donates.sort(sortNoteByDateDESC);
    this.code = 200;
    setTimeout(function() {
      AuthActions.fetchAuth.defer();
      browserHistory.push({pathname: ServerSetting.uBase + '/recipient/' + props.location, hash: "#history"});
    }.bind(this),0);

  }
  handleDeletedDonate(props) {
    let i = -1;
    for(let j = 0; j < this.donates.length && i==-1; j++) {
      if(this.donates[j].id === parseInt(props.id)) {
        i = j;
      }
    }
    if (i > -1) {
      this.donates.splice(i, 1);
    }
    this.temp = null;
    this.code = 200;
  }
}

module.exports = alt.createStore(DonateStore, 'DonateStore');
