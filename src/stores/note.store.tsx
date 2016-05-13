import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';
import * as L from 'leaflet';

var Settings = require('./../constraints/settings.json');
import { noteActions } from './../actions/note.actions';
import { AbstractStore } from './../stores/abstract.store';
import { noteSource } from './../sources/note.source';
import { foodStore } from './food.store';

export enum PickupTime {
  NONE, EARLY, PROPER, LATE
}
export enum NoteType {
  NONE, CHANGE, POST, PICKUP
}
export enum AmountType {
  NONE, G, KG, LBS
}

export interface INoteProps {
  id: string;
  type: string;
  tree: string;
  person: string;
  comment: string;
  picture: string;
  rate: string;
  amount: string;
  proper: string;
  date: string;
  atype: string;
}

export class NoteModel {
  id: number;
  type: NoteType;
  tree: number;
  person: number;
  comment: string;
  rate: number;
  amount: number;
  proper: PickupTime;
  date: moment.Moment;
  images: Array<string>;
  atype: AmountType;

  constructor(props: INoteProps) {
    let self: NoteModel = this;
    self.update(props);
  }
  public update(props: INoteProps) {
    let self: NoteModel = this;
    self.id = parseInt(props.id);
    self.type = parseInt(props.type);
    self.tree = parseInt(props.tree);
    self.person = parseInt(props.person);
    self.comment = props.comment;
    self.rate = parseInt(props.rate);
    self.amount = parseFloat(props.amount);
    self.proper = parseInt(props.proper);
    self.date = moment(props.date);
    if (props.picture && props.picture != "") {
      self.images = props.picture.split(',').map((image: string) => {
        return image;
      });
    } else {
      self.images = new Array<string>();
    }
    self.atype = parseInt(props.atype);
  }
  public toJSON(): any {
    let self: NoteModel = this;
    // TODO:: Convert Amount Type
    return {
      id: self.id,
      type: self.type,
      tree: self.tree,
      person: self.person,
      comment: self.comment,
      picture: self.images.toString(),
      rate: self.rate,
      amount: self.amount,
      proper: self.proper,
      date: self.date.format(Settings.sServerDateFormat)
    }
  }
  public getId(): number {
    return this.id
  }
  public getTreeId(): number {
    return this.tree;
  }
  public setTreeId(tree: number): void {
    this.tree = tree;
  }
  public getPersonId(): number {
    return this.person;
  }
  public setPersonId(person: number): void {
    this.person = person;
  }
  public getNoteType(): NoteType {
    return this.type;
  }
  public setNoteType(type: NoteType): void {
    this.type = type;
  }
  public getComment(): string {
    return this.comment;
  }
  public setComment(comment: string): void {
    this.comment = comment;
  }
  public getImages(): Array<string> {
    return this.images;
  }
  public setImages(images: Array<string>): void {
    this.images = images;
  }
  public getImage(index: number): string {
    return this.images[index];
  }
  public addImage(filename: string): void {
    this.images.push(filename);
  }
  public getRate(): number {
    return this.rate;
  }
  public setRate(rate: number): void {
    this.rate = rate;
  }
  public getAmount(): number {
    return this.amount;
  }
  public setAmount(amount: number): void {
    this.amount = amount;
  }
  public getPicupTime(): number {
    return this.proper;
  }
  public setPicupTime(proper: PickupTime): void {
    this.proper = proper;
  }
  public getAmountType(): number {
    return this.atype;
  }
  public setAmountType(atype: AmountType): void {
    this.atype = atype;
  }
  public getDate(): moment.Moment {
    return this.date;
  }
  public setDate(date: moment.Moment): void {
    this.date = date;
  }
  public setCoverImage(filename: string): void {
    let i = this.images.indexOf(filename);
    if (i > -1) {
      this.images.splice(i, 1);
    }
    this.images.unshift(filename);
  }
}

export interface NoteState {
  notes: Array<NoteModel>;
  errorMessage: string;
}

interface NoteExtendedStore extends AltJS.AltStore<NoteState> {
  getNote(id: number): NoteModel;
  addNote(note: NoteModel): void;
  fetchNotes(): void;
  updateNote(update: NoteModel): void;
  createNote(create: NoteModel): void;
  isLoading(): boolean;
}

class NoteStore extends AbstractStore<NoteState> {
  private notes: Array<NoteModel>;
  private errorMessage: string;
  constructor() {
    super();
    let self: NoteStore = this;
    if (!self.notes) {
      self.notes = new Array<NoteModel>();
    }
    self.errorMessage = null;
    //TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleFetchNotes: noteActions.fetchNotes,
      handleUpdateNote: noteActions.updateNote,
      handleCreateNote: noteActions.createNote,
      handleLoading: noteActions.loading,
      handleFailed: noteActions.failed,
    });
    self.exportPublicMethods({
      getNote: self.getNote,
      addNote: self.addNote,
    });
    self.exportAsync(noteSource);
  }
  handleFetchNotes(notesProps: Array<INoteProps>) {
    let self: NoteStore = this;
    console.warn("Handle Fetch Notes");
    if (!self.notes) {
      self.notes = new Array<NoteModel>();
    }
    notesProps.forEach((props: INoteProps) => {
      self.notes.push(new NoteModel(props));
    });
    self.errorMessage = null;
  }
  handleUpdateNote(noteProps: INoteProps) {
    let self: NoteStore = this;
    console.warn("Handle Update Note");
    let notes = self.notes.filter(note => note.getId() == parseInt(noteProps.id));
    if (notes.length == 1) {
      notes[0].update(noteProps);
    }
  }
  handleCreateNote(noteProps: INoteProps) {
    let self: NoteStore = this;
    console.warn("Handle Create Note");
    console.log(noteProps);
    self.notes.push(new NoteModel(noteProps));
    self.errorMessage = "e600";
    setTimeout(function() {
      self.errorMessage = null;
    }, Settings.iErrorMessageDuration);
  }
  handleLoading(errorMessage: string) {
    let self: NoteStore = this;
    self.errorMessage = errorMessage;
  }
  handleFailed(errorMessage: string) {
    let self: NoteStore = this;
    console.warn("Handle Note Failed");
    self.errorMessage = errorMessage;
  }
  getNote(id: number): NoteModel {
    let self: NoteStore = this;
    let notes = self.getState().notes.filter(note => note.getId() == id);
    if (notes.length == 1) {
      return notes[0];
    }
    return null;
  }
  addNote(note: NoteModel): void {
    let self: NoteStore = this;
    let notes = self.getState().notes;
    let i = -1;
    for(let j = 0; j < notes.length; j++) {
      if(notes[j].getId() === note.getId()) {
        i = j;
      }
    }
    if (i > -1) {
      notes = notes.splice(i, 1);
    }
    notes.push(note);
    console.log(notes.length);
  }
}

export const noteStore: NoteExtendedStore = alt.createStore<NoteState>(NoteStore) as NoteExtendedStore;
