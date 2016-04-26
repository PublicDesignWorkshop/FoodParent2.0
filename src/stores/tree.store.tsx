import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';
import * as L from 'leaflet';

import { treeActions } from './../actions/tree.actions';
import { AbstractStore } from './../stores/abstract.store';
import { treeSource } from './../sources/tree.source';
import { foodStore } from './food.store';

export interface ITreeProps {
  id: string;
  lat: string;
  lng: string;
  food: string;
  type: string;
  flag: string;
  public: string;
  description: string;
  address: string;
  owner: string;
  updated: string;
}

export class TreeModel {
  id: number;
  lat: number;
  lng: number;
  food: number;
  type: number;
  description: string;
  public: number;
  address: string;
  owner: number;
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
    self.lat = parseFloat(props.lat);
    self.lng = parseFloat(props.lng);
    self.food = parseInt(props.food);
    self.type = parseInt(props.type);
    self.description = props.description;
    self.address = props.address;
    self.public = parseInt(props.public);
    self.owner = parseInt(props.owner);
    self.updated = moment(props.updated);
    self.flags = props.flag.split(',').map((flag: string) => {
      return parseInt(flag);
    });
    // TODO: connect with parents
    self.parents = new Array<number>();
  }
  public toJSON(): any {
    let self: TreeModel = this;
    return {
      id: self.id,
      lat: self.lat,
      lng: self.lng,
      food: self.food,
      type: self.type,
      flag: self.flags.toString(),
      description: self.description,
      address: self.address,
      public: self.public,
      owner: self.owner
    }
  }
  public getId(): number {
    return this.id
  }
  public getFoodId(): number {
    return this.food;
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
  public getOwner(): number {
    return this.owner;
  }
  public setOwner(owner: number): void {
    this.owner = owner;
  }
  public getPublic(): number {
    return this.public;
  }
  public setPublic(pub: number): void {
    this.public = pub;
  }
}

export interface TreeState {
  trees: Array<TreeModel>;
  errorMessage: string;
}


interface TreeExtendedStore extends AltJS.AltStore<TreeState> {
  getTree(id: number): TreeModel;
  fetchTrees(): void;
  updateTree(update: TreeModel): void;
  isLoading(): boolean;
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
      handleFetchTrees: treeActions.fetchTrees,
      handleUpdateTree: treeActions.updateTree,
      handleFailed: treeActions.failed,
    });
    self.exportPublicMethods({
      getTree: self.getTree
    });
    self.exportAsync(treeSource);
  }
  handleFetchTrees(treesProps: Array<ITreeProps>) {
    let self: TreeStore = this;
    console.warn("Handle Fetch Trees");
    self.trees = new Array<TreeModel>();
    treesProps.forEach((props: ITreeProps) => {
      self.trees.push(new TreeModel(props));
    });
    self.errorMessage = null;
  }
  handleUpdateTree(treeProps: ITreeProps) {
    let self: TreeStore = this;
    console.warn("Handle Update Tree");
    let trees = self.trees.filter(tree => tree.getId() == parseInt(treeProps.id));
    if (trees.length == 1) {
      trees[0].update(treeProps);
    }
  }
  handleFailed(errorMessage: string) {
    console.warn("Handle Tree Failed");
    this.errorMessage = errorMessage;
  }
  getTree(id: number): TreeModel {
    let self: TreeStore = this;
    let trees = self.getState().trees;
    for(var i = 0; i < trees.length; i++) {
      if(trees[i].id === id) {
        return trees[i];
      }
    }
    return null;
  }
}

export const treeStore: TreeExtendedStore = alt.createStore<TreeState>(TreeStore) as TreeExtendedStore;
