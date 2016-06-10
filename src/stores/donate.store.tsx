import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';
import * as L from 'leaflet';
import { browserHistory } from 'react-router';

var Settings = require('./../constraints/settings.json');
import { donateActions } from './../actions/donate.actions';
import { AbstractStore } from './../stores/abstract.store';
import { foodStore } from './food.store';
import { AmountType } from './note.store';
import { sortDonateByDateDESC } from './../utils/sort';

export interface IDonateProps {
  id: string;
  location: string;
  food: string;
  tree: string;
  person: string;
  comment: string;
  picture: string;
  amount: string;
  date: string;
}

export class DonateModel {
  id: number;
  location: number;
  food: number;
  trees: Array<number>;
  person: number;
  comment: string;
  rate: number;
  amount: number;
  date: moment.Moment;
  images: Array<string>;
  atype: AmountType;

  constructor(props: IDonateProps) {
    let self: DonateModel = this;
    self.update(props);
    self.atype = AmountType.G;
  }
  public update(props: IDonateProps) {
    let self: DonateModel = this;
    self.id = parseInt(props.id);
    self.location = parseInt(props.location);
    self.food = parseInt(props.food);
    if (props.tree && props.tree != "") {
      self.trees = props.tree.split(',').map((treeId: string) => {
        return parseInt(treeId);
      });
    } else {
      self.trees = new Array<number>();
    }
    self.person = parseInt(props.person);
    self.comment = props.comment;
    self.amount = parseFloat(props.amount);
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
    let self: DonateModel = this;
    // TODO:: Convert Amount Type
    return {
      id: self.id,
      location: self.location,
      food: self.food,
      tree: self.trees.toString(),
      person: self.person,
      comment: self.comment,
      picture: self.images.toString(),
      amount: self.amount,
      date: self.date.format(Settings.sServerDateFormat),
    }
  }
  public getId(): number {
    return this.id
  }
  public getLocationId(): number {
    return this.location;
  }
  public setLocationId(location: number): void {
    this.location = location;
  }
  public getFoodId(): number {
    return this.food;
  }
  public setFoodId(food: number): void {
    this.food = food;
  }
  public getPersonId(): number {
    return this.person;
  }
  public setPersonId(person: number): void {
    this.person = person;
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
  public getTrees(): Array<number> {
    return this.trees;
  }
  public setTrees(trees: Array<number>): void {
    this.trees = trees;
  }
  public getTree(index: number): number {
    return this.trees[index];
  }
  public addTree(treeId: number): void {
    this.trees.push(treeId);
  }
  public getAmount(): number {
    return this.amount;
  }
  public setAmount(amount: number): void {
    this.amount = amount;
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

export interface DonateState {
  temp: DonateModel;
  donates: Array<DonateModel>;
  code: any;
}

interface DonateExtendedStore extends AltJS.AltStore<DonateState> {
  getTempDonate(): DonateModel;
  getDonate(id: number): DonateModel;
  getDonatesFromLocationId(locationId: number): Array<DonateModel>;
}

class DonateStore extends AbstractStore<DonateState> {
  private temp: DonateModel;
  private donates: Array<DonateModel>;
  private code: any;
  constructor() {
    super();
    let self: DonateStore = this;
    self.donates = new Array<DonateModel>();
    self.temp = new DonateModel({
      id: "0",
      location: "0",
      food: "0",
      tree: "0",
      person: "0",
      comment: "",
      picture: "",
      amount: "0",
      date: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.code = 200;
    // TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleResetTempDonate: donateActions.resetTempDonate,
      handleFetchedDonates: donateActions.fetchedDonates,
      handleCreatedDonate: donateActions.createdDonate,
      handleUpdatedDonate: donateActions.updatedDonate,
      handleDeletedDonate: donateActions.deletedDonate,
      handleSetCode: donateActions.setCode,
    });
    self.exportPublicMethods({
      getTempDonate: self.getTempDonate,
      getDonate: self.getDonate,
      getDonatesFromLocationId: self.getDonatesFromLocationId,
    });
    // self.exportAsync(noteSource);
  }
  getTempDonate(): DonateModel {
    let self: DonateStore = this;
    return self.getState().temp;
  }
  getDonate(id: number): DonateModel {
    let self: DonateStore = this;
    let donates = self.getState().donates.filter(donate => donate.getId() == id);
    if (donates.length == 1) {
      return donates[0];
    }
    return null;
  }
  getDonatesFromLocationId(locationId: number): Array<DonateModel> {
    let self: DonateStore = this;
    let donates = self.getState().donates.filter(donate => donate.getLocationId() == locationId);
    return donates;
  }
  handleFetchedDonates(donatesProps: Array<IDonateProps>) {
    let self: DonateStore = this;
    self.donates = new Array<DonateModel>();
    donatesProps.forEach((props: IDonateProps) => {
      self.donates.push(new DonateModel(props));
    });
    self.code = 200;
  }
  handleCreatedDonate(donateProps: IDonateProps) {
    let self: DonateStore = this;
    self.donates.push(new DonateModel(donateProps));
    // Reset a new note
    self.temp = new DonateModel({
      id: "0",
      location: "0",
      food: "0",
      tree: "0",
      person: "0",
      comment: "",
      picture: "",
      amount: "0",
      date: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.donates = self.donates.sort(sortDonateByDateDESC);
    self.code = 200;
  }
  handleUpdatedDonate(donateProps: IDonateProps) {
    let self: DonateStore = this;
    let donates = self.donates.filter(donate => donate.getId() == parseInt(donateProps.id));
    if (donates.length == 1) {
      donates[0].update(donateProps);
    }
    self.code = 200;
  }
  handleDeletedDonate(donateProps: IDonateProps) {
    let self: DonateStore = this;
    let i = -1;
    for(let j = 0; j < self.donates.length; j++) {
      if(self.donates[j].getId() === parseInt(donateProps.id)) {
        i = j;
      }
    }
    if (i > -1) {
      self.donates.splice(i, 1);
    }
    self.code = 200;
  }
  handleResetTempDonate() {
    let self: DonateStore = this;
    self.temp = new DonateModel({
      id: "0",
      location: "0",
      food: "0",
      tree: "0",
      person: "0",
      comment: "",
      picture: "",
      amount: "0",
      date: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.code = 200;
  }
  handleSetCode(code: any) {
    let self: DonateStore = this;
    self.code = code;
  }
}

export const donateStore: DonateExtendedStore = alt.createStore<DonateState>(DonateStore) as DonateExtendedStore;
