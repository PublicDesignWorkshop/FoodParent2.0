import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';
import * as L from 'leaflet';
import { browserHistory } from 'react-router';

var Settings = require('./../constraints/settings.json');
import { noteActions } from './../actions/note.actions';
import { AbstractStore } from './../stores/abstract.store';
import { foodStore } from './food.store';
import { sortNoteByDateDESC } from './../utils/sort';
import { NoteType, AmountType, PickupTime } from './../utils/enum';


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
    self.atype = AmountType.G;
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
      date: self.date.format(Settings.sServerDateFormat),
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
  public getFormattedDate(): string {
    return this.date.format(Settings.sUIDateFormat);
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
  temp: NoteModel;
  notes: Array<NoteModel>;
  code: any;
}

interface NoteExtendedStore extends AltJS.AltStore<NoteState> {
  getTempNote(): NoteModel;
  getNote(id: number): NoteModel;
  getNotesFromTreeId(treeId: number): Array<NoteModel>;
}

class NoteStore extends AbstractStore<NoteState> {
  private temp: NoteModel;
  private notes: Array<NoteModel>;
  private code: any;
  constructor() {
    super();
    let self: NoteStore = this;
    self.notes = new Array<NoteModel>();
    self.temp = new NoteModel({
      id: "0",
      type: NoteType.POST.toString(),
      tree: "0",
      person: "0",
      comment: "",
      picture: "",
      rate: "0",
      amount: "0",
      proper: PickupTime.PROPER.toString(),
      date: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.code = 200;
    // TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleResetTempNote: noteActions.resetTempNote,
      handleFetchedNotes: noteActions.fetchedNotes,
      handleCreatedNote: noteActions.createdNote,
      handleUpdatedNote: noteActions.updatedNote,
      handleDeletedNote: noteActions.deletedNote,
      handleSetCode: noteActions.setCode,
    });
    self.exportPublicMethods({
      getTempNote: self.getTempNote,
      getNote: self.getNote,
      getNotesFromTreeId: self.getNotesFromTreeId,
    });
    // self.exportAsync(noteSource);
  }
  getTempNote(): NoteModel {
    let self: NoteStore = this;
    return self.getState().temp;
  }
  getNote(id: number): NoteModel {
    let self: NoteStore = this;
    let notes = self.getState().notes.filter(note => note.getId() == id);
    if (notes.length == 1) {
      return notes[0];
    }
    return null;
  }
  getNotesFromTreeId(treeId: number): Array<NoteModel> {
    let self: NoteStore = this;
    let notes = self.getState().notes.filter(note => note.getTreeId() == treeId);
    return notes;
  }
  handleFetchedNotes(notesProps: Array<INoteProps>) {
    let self: NoteStore = this;
    self.notes = new Array<NoteModel>();
    notesProps.forEach((props: INoteProps) => {
      self.notes.push(new NoteModel(props));
    });
    self.code = 200;
  }
  handleCreatedNote(noteProps: INoteProps) {
    let self: NoteStore = this;
    self.notes.push(new NoteModel(noteProps));
    // Reset a new note
    self.temp = new NoteModel({
      id: "0",
      type: NoteType.POST.toString(),
      tree: "0",
      person: "0",
      comment: "",
      picture: "",
      rate: "0",
      amount: "0",
      proper: PickupTime.PROPER.toString(),
      date: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.notes = self.notes.sort(sortNoteByDateDESC);
    self.code = 200;
  }
  handleUpdatedNote(noteProps: INoteProps) {
    let self: NoteStore = this;
    let notes = self.notes.filter(note => note.getId() == parseInt(noteProps.id));
    if (notes.length == 1) {
      notes[0].update(noteProps);
    }
    self.code = 200;
  }
  handleDeletedNote(noteProps: INoteProps) {
    let self: NoteStore = this;
    let i = -1;
    for(let j = 0; j < self.notes.length; j++) {
      if(self.notes[j].getId() === parseInt(noteProps.id)) {
        i = j;
      }
    }
    if (i > -1) {
      self.notes.splice(i, 1);
    }
    self.code = 200;
  }
  handleResetTempNote() {
    let self: NoteStore = this;
    self.temp = new NoteModel({
      id: "0",
      type: NoteType.POST.toString(),
      tree: "0",
      person: "0",
      comment: "",
      picture: "",
      rate: "0",
      amount: "0",
      proper: PickupTime.PROPER.toString(),
      date: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.code = 200;
  }
  handleSetCode(code: any) {
    let self: NoteStore = this;
    self.code = code;
  }
}

export const noteStore: NoteExtendedStore = alt.createStore<NoteState>(NoteStore) as NoteExtendedStore;
