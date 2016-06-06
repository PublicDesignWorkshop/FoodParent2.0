import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';
import * as L from 'leaflet';
import { browserHistory } from 'react-router';
import * as _ from 'underscore';

var Settings = require('./../constraints/settings.json');
import { treeActions } from './../actions/tree.actions';
import { AbstractStore } from './../stores/abstract.store';
import { foodStore } from './food.store';

export interface ITreeProps {
  id: string;
  lat: string;
  lng: string;
  food: string;
  flag: string;
  public: string;
  description: string;
  address: string;
  owner: string;
  parent: string;
  rate: string;
  updated: string;
}

export class TreeModel {
  id: number;
  lat: number;
  lng: number;
  food: number;
  description: string;
  ownership: number;
  address: string;
  owner: number;
  rate: number;
  updated: moment.Moment;
  flags: Array<number>;
  parents: Array<number>;

  constructor(props: ITreeProps) {
    let self: TreeModel = this;
    self.update(props);
  }
  public update(props: ITreeProps) {
    let self: TreeModel = this;
    self.id = parseInt(props.id);
    self.lat = parseFloat(parseFloat(props.lat).toFixed(Settings.iMarkerPrecision));
    self.lng = parseFloat(parseFloat(props.lng).toFixed(Settings.iMarkerPrecision));
    self.food = parseInt(props.food);
    self.description = props.description;
    self.address = props.address;
    self.ownership = parseInt(props.public);
    self.owner = parseInt(props.owner);
    self.updated = moment(props.updated);
    self.flags = props.flag.split(',').map((flag: string) => {
      return parseInt(flag);
    });
    self.parents = props.parent.split(',').map((flag: string) => {
      return parseInt(flag);
    });
    self.rate = parseInt(props.rate);
  }
  public toJSON(): any {
    let self: TreeModel = this;
    return {
      id: self.id,
      lat: self.lat,
      lng: self.lng,
      food: self.food,
      flag: self.flags.toString(),
      description: self.description,
      address: self.address,
      public: self.ownership,
      owner: self.owner,
      parent: self.parents.toString(),
      rate: self.rate,
    }
  }
  public getId(): number {
    return this.id
  }
  public getFoodId(): number {
    return this.food;
  }
  public setFoodId(foodId: number): void {
    this.food = foodId;
  }
  public getLat(): number {
    return this.lat;
  }
  public getLng(): number {
    return this.lng;
  }
  public setLat(lat: number): void {
    this.lat = lat;
  }
  public setLng(lng: number): void {
    this.lng = lng;
  }
  public getLocation(): L.LatLng {
    return new L.LatLng(this.getLat(), this.getLng());
  }
  public getName(): string {
    return ' #' + this.getId();
  }
  public getAddress(): string {
    return this.address;
  }
  public setAddress(address: string): void {
    this.address = address;
  }
  public getDescription(): string {
    return this.description;
  }
  public setDescription(description: string): void {
    this.description = description;
  }
  public getFlags(): Array<number> {
    return this.flags;
  }
  public setFlags(flags: Array<number>): void {
    this.flags = flags;
  }
  public getParents(): Array<number> {
    return _.without(this.parents, 0);
  }
  public setParents(parents: Array<number>): void {
    this.parents = parents;
  }
  public addParent(parentId): void {
    if (this.parents.indexOf(parentId) == -1) {
      this.parents.push(parentId);
    }
  }
  public removeParent(parentId): void {
    this.parents = _.without(this.parents, parentId);
  }
  public getOwner(): number {
    return this.owner;
  }
  public setOwner(owner: number): void {
    this.owner = owner;
  }
  public getOwnership(): number {
    return this.ownership;
  }
  public setOwnership(ownership: number): void {
    this.ownership = ownership;
  }
  public getRate(): number {
    return this.rate;
  }
}

export interface TreeState {
  trees: Array<TreeModel>;
  errorMessage: string;
}

interface TreeExtendedStore extends AltJS.AltStore<TreeState> {
  getTree(id: number): TreeModel;
  // addTree(tree: TreeModel): void;
  // updateTree(update: TreeModel): void;
  // createTree(create: TreeModel): void;
}

class TreeStore extends AbstractStore<TreeState> {
  private trees: Array<TreeModel>;
  private errorMessage: string;
  constructor() {
    super();
    let self: TreeStore = this;
    self.trees = new Array<TreeModel>();
    self.errorMessage = null;
    //TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleFetchedTrees: treeActions.fetchedTrees,
      handleUpdatedTree: treeActions.updatedTree,
      // handleUpdateTree: treeActions.updateTree,
      // handleCreateTree: treeActions.createTree,
      handleFailed: treeActions.failed,
    });
    self.exportPublicMethods({
      getTree: self.getTree,
      // addTree: self.addTree,
    });
  }
  handleFetchedTrees(treesProps: Array<ITreeProps>) {
    let self: TreeStore = this;
    console.warn("- Handle fetched trees -");
    self.trees = new Array<TreeModel>();
    treesProps.forEach((props: ITreeProps) => {
      self.trees.push(new TreeModel(props));
    });
    self.errorMessage = null;
  }
  handleFailed(code: number) {
    let self: TreeStore = this;
    // this.errorMessage = errorMessage;
  }
  getTree(id: number): TreeModel {
    let self: TreeStore = this;
    let trees = self.getState().trees.filter(tree => tree.getId() == id);
    if (trees.length == 1) {
      return trees[0];
    }
    return null;
  }
  handleUpdatedTree(treeProps: ITreeProps) {
    let self: TreeStore = this;
    let trees = self.trees.filter(tree => tree.getId() == parseInt(treeProps.id));
    if (trees.length == 1) {
      trees[0].update(treeProps);
    }
  }














  // handleFetchTrees(treesProps: Array<ITreeProps>) {
  //   let self: TreeStore = this;
  //   console.warn("Handle Fetch Trees");
  //   let tree: TreeModel;
  //   if (self.trees) {
  //     let trees = self.trees.filter(tree => tree.getId() == 0);
  //     if (trees.length > 0) {
  //       tree = trees[0];
  //     }
  //   }
  //   self.trees = new Array<TreeModel>();
  //   if (tree) {
  //     self.trees.push(tree);
  //   }
  //   treesProps.forEach((props: ITreeProps) => {
  //     self.trees.push(new TreeModel(props));
  //   });
  //   self.errorMessage = null;
  // }

  // handleCreateTree(treeProps: ITreeProps) {
  //   let self: TreeStore = this;
  //   console.warn("Handle Create Tree");
  //   console.log(treeProps);
  //   self.trees.push(new TreeModel(treeProps));
  //   browserHistory.replace({pathname: Settings.uBaseName + '/trees/' + treeProps.id});
  // }
  //
  // getTree(id: number): TreeModel {
  //   let self: TreeStore = this;
  //   let trees = self.getState().trees.filter(tree => tree.getId() == id);
  //   if (trees.length == 1) {
  //     return trees[0];
  //   }
  //   return null;
  // }
  // addTree(tree: TreeModel): void {
  //   let self: TreeStore = this;
  //   let trees = self.getState().trees;
  //   let i = -1;
  //   for(let j = 0; j < trees.length; j++) {
  //     if(trees[j].getId() === tree.getId()) {
  //       i = j;
  //     }
  //   }
  //   if (i > -1) {
  //     trees = trees.splice(i, 1);
  //   }
  //   trees.push(tree);
  // }
}

export const treeStore: TreeExtendedStore = alt.createStore<TreeState>(TreeStore) as TreeExtendedStore;
