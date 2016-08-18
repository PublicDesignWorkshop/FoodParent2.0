let alt = require('./../alt');
import * as L from 'leaflet';
import moment from 'moment';
import * as _ from 'underscore';
import { browserHistory } from 'react-router';

import { AMOUNTTYPE, NOTETYPE, PICKUPTIME } from './../utils/enum';

let MapSetting = require('./../../setting/map.json');
let ServerSetting = require('./../../setting/server.json');
let NoteActions = require('./../actions/note.actions');
let FlagStore = require('./../stores/flag.store');
let MapStore = require('./../stores/map.store');
let AuthActions = require('./../actions/auth.actions');


export class NoteModel {
  constructor(props) {
    this.update(props);
  }
  toJSON() {
    let amount;
    switch(this.amountType) {
      case AMOUNTTYPE.LBS:
        amount = this.amount * ServerSetting.fLBSTOG;
        break;
      case AMOUNTTYPE.KG:
        amount = this.amount * ServerSetting.fKGToG;
        break;
      default:
        amount = this.amount;
        break;
    }
    let type;
    switch(this.type) {
      case NOTETYPE.CHANGE:
        type = 1;
        break;
      case NOTETYPE.UPDATE:
        type = 2;
        break;
      case NOTETYPE.PICKUP:
        type = 3;
        break;
    }
    let proper;
    switch(this.proper) {
      case PICKUPTIME.EARLY:
        proper = 1;
        break;
      case PICKUPTIME.PROPER:
        proper = 2;
        break;
      case PICKUPTIME.LATE:
        proper = 3;
        break;
    }
    return {
      id: this.id,
      type: type,
      tree: this.tree,
      person: this.person,
      comment: this.comment,
      picture: this.comment.toString(),
      rate: this.rate,
      amount: amount,
      proper: proper,
      date: this.date.format(ServerSetting.sServerDateFormat),
    }
  }
  update(props) {
    this.id = parseInt(props.id);
    switch(parseInt(props.type)) {
      case 1:
        this.type = NOTETYPE.CHANGE;
        break;
      case 2:
        this.type = NOTETYPE.UPDATE;
        break;
      case 3:
        this.type = NOTETYPE.PICKUP;
        break;
    }
    this.tree = parseInt(props.tree);
    this.person = parseInt(props.person);
    this.comment = props.comment;
    this.rate = parseInt(props.rate);
    this.amountType = AMOUNTTYPE.LBS;
    this.amount = parseFloat(props.amount) * ServerSetting.fGToLBS;
    switch(parseInt(props.proper)) {
      case 1:
        this.proper = PICKUPTIME.EARLY;
        break;
      case 2:
        this.proper = PICKUPTIME.PROPER;
        break;
      case 3:
        this.proper = PICKUPTIME.LATE;
        break;
    }
    this.date = moment(props.date);
    if (props.picture && props.picture != "") {
      this.images = props.picture.split(',').map((image) => {
        return image;
      });
    } else {
      this.images = [];
    }
  }
  addImage(filename) {
    this.images.push(filename);
  }
  removeImage(filename) {
    // this.images = $.grep(this.images, function(value) {
    //   return value != filename;
    // });
    this.images = _.without(this.images, filename);
  }
  getFormattedDate() {
    return this.date.format(ServerSetting.sUIDateFormat);
  }
  setCoverImage(filename) {
    let i = this.images.indexOf(filename);
    if (i > -1) {
      this.images.splice(i, 1);
    }
    this.images.unshift(filename);
  }
}

class NoteStore {
  constructor() {
    this.temp = null;
    this.notes = [];
    this.code = 0;
    // Bind action methods to store.
    this.bindListeners({
      handleSetCode: NoteActions.SET_CODE,
      handleFetchedNotes: NoteActions.FETCHED_NOTES,
      handleCreateTempNote: NoteActions.CREATE_TEMP_NOTE,
      handleSetSelected: NoteActions.SET_SELECTED,
    });
    // Expose public methods.
    this.exportPublicMethods({
      getNote: this.getNote,
    });
  }
  getNote(id) {
    let notes = this.getState().notes.filter(note => note.id == id);
    if (notes.length == 1) {
      return notes[0];
    }
    return null;
  }
  handleSetCode(code) {
    this.code = code;
  }
  handleFetchedNotes(props) {
    this.notes = [];
    props.forEach((props) => {
      this.notes.push(new NoteModel(props));
    });
    this.code = 200;
  }
  handleCreateTempNote() { // id = 0 for new note.
    // let notes = this.notes.filter(note => note.id == 0);
    // if (notes.length > 0) {
    //   this.notes = _.without(this.notes, ...notes);
    // }
    this.temp = new NoteModel({
      id: "0",
      type: "2",
      tree: "0",
      person: "0",
      comment: "",
      picture: "",
      rate: "0",
      amount: "0",
      proper: "2",
      date: moment(new Date()).format(ServerSetting.sServerDateFormat),
    });
    this.code = 200;
  }
  handleSetSelected(id) {
    let notes = this.notes.filter(note => note.id == parseInt(id));
    if (notes.length > 0) {
      this.temp = new NoteModel(notes[0].toJSON());
    } else {
      this.temp = null;
    }
    console.log(this.temp);
    this.code = 200;
  }
}

module.exports = alt.createStore(NoteStore, 'NoteStore');
