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
let AuthStore = require('./../stores/auth.store');
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
      handleCreatedNote: NoteActions.CREATED_NOTE,
      handleDeletedNote: NoteActions.DELETED_NOTE,
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
  handleCreateTempNote(treeId) { // id = 0 for new note.
    // let notes = this.notes.filter(note => note.id == 0);
    // if (notes.length > 0) {
    //   this.notes = _.without(this.notes, ...notes);
    // }
    this.temp = new NoteModel({
      id: "0",
      type: "2",
      tree: treeId,
      person: AuthStore.getState().auth.id,
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
      // this.temp = new NoteModel(notes[0].toJSON());
    }
    this.notes = this.notes.sort(sortNoteByDateDESC);
    this.code = 200;
  }
  handleCreatedNote(props) {
    let notes = this.notes.filter(note => note.id == parseInt(props.id));
    if (notes.length > 0) {
      notes[0].update(props);
      // this.temp = new NoteModel(notes[0].toJSON());
    } else {
      this.notes.push(new NoteModel(props));
      this.temp = new NoteModel(props);
    }
    this.notes = this.notes.sort(sortNoteByDateDESC);
    setTimeout(function() {
      browserHistory.push({pathname: ServerSetting.uBase + '/tree/' + props.tree, hash: "#history"});
    },0);
    this.code = 200;
  }
  handleDeletedNote(props) {
    let i = -1;
    for(let j = 0; j < this.notes.length && i!=-1; j++) {
      if(this.notes[j].getId() === parseInt(props.id)) {
        i = j;
      }
    }
    if (i > -1) {
      this.notes.splice(i, 1);
    }
    this.temp = null;
    this.code = 200;
  }
}

module.exports = alt.createStore(NoteStore, 'NoteStore');
