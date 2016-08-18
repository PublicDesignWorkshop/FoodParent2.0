let alt = require('./../alt');
import * as L from 'leaflet';
import moment from 'moment';
import * as _ from 'underscore';
import { browserHistory } from 'react-router';

import { AMOUNTTYPE, NOTETYPE, PICKUPTIME } from './../utils/enum';
import { sortNoteByDateDESC } from './../utils/sort';

let MapSetting = require('./../../setting/map.json');
let ServerSetting = require('./../../setting/server.json');
let NoteActions = require('./../actions/note.actions');
let FlagStore = require('./../stores/flag.store');
let MapStore = require('./../stores/map.store');
let AuthActions = require('./../actions/auth.actions');

import { NoteModel } from './note.model';


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
      handleUpdatedNote: NoteActions.UPDATED_NOTE,
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
    this.code = 200;
  }
  handleUpdatedNote(props) {
    let notes = this.notes.filter(note => note.id == parseInt(props.id));
    if (notes.length == 1) {
      notes[0].update(props);
    }
    this.notes = this.notes.sort(sortNoteByDateDESC);
    this.code = 200;
  }
}

module.exports = alt.createStore(NoteStore, 'NoteStore');
