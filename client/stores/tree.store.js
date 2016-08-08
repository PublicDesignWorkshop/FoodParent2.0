let alt = require('./../alt');
import * as L from 'leaflet';
import moment from 'moment';
import * as _ from 'underscore';

let MapSetting = require('./../../setting/map.json');
let ServerSetting = require('./../../setting/server.json');
let TreeActions = require('./../actions/tree.actions');
let FlagStore = require('./../stores/flag.store');


export class TreeModel {
  constructor(props) {
    this.update(props);
  }
  toJSON() {
    return {
      id: this.id,
      lat: this.lat,
      lng: this.lng,
      food: this.food,
      flag: this.flags.toString(),
      description: this.description,
      address: this.address,
      public: this.ownership,
      owner: this.owner,
      parent: this.parents.toString(),
      rate: this.rate,
    }
  }
  update(props) {
    this.id = parseInt(props.id);
    this.lat = parseFloat(parseFloat(props.lat).toFixed(MapSetting.iMarkerPrecision));
    this.lng = parseFloat(parseFloat(props.lng).toFixed(MapSetting.iMarkerPrecision));
    this.food = parseInt(props.food);
    this.description = props.description;
    this.address = props.address;
    this.ownership = parseInt(props.public);
    this.owner = parseInt(props.owner);
    this.updated = moment(props.updated);
    this.flags = props.flag.split(',').map((flag: string) => {
      return parseInt(flag);
    });
    this.parents = props.parent.split(',').map((flag: string) => {
      return parseInt(flag);
    });
    this.rate = parseInt(props.rate);
  }
  getLocation() {
    return new L.LatLng(this.lat, this.lng);
  }
  getName() {
    return ' #' + this.id;
  }
  // Need to use the getParents() to eliminate dummy (id = 0) parent (the dummy parent id comes from the server).
  getParents() {
    return _.without(this.parents, 0);
  }
  addParent(id): void {
    if (this.parents.indexOf(id) == -1) {
      this.parents.push(id);
    }
  }
  removeParent(id): void {
    this.parents = _.without(this.parents, id);
  }
}

class TreeStore {
  constructor() {
    this.selected = null;
    // this.selected = new TreeModel({
    //   id: "0",
    //   lat: MapSetting.vPosition.x,
    //   lng: MapSetting.vPosition.y,
    //   food: "0",
    //   flag: "0",
    //   public: "1",
    //   description: "",
    //   address: "",
    //   owner: "0",
    //   parent: "0",
    //   rate: "-1",
    //   updated: moment(new Date()).format(ServerSetting.sServerDateFormat),
    // });
    this.trees = [];
    this.code = 200;
    // Bind action methods to store.
    this.bindListeners({
      handleRefresh: TreeActions.REFRESH,
      handleFetchedTrees: TreeActions.FETCHED_TREES,
      handleSetCode: TreeActions.SET_CODE,
      handleSetSelected: TreeActions.SET_SELECTED,
    });
    // Expose public methods.
    this.exportPublicMethods({
      getTree: this.getTree,
    });
  }
  getTree(id): TreeModel {
    let trees = this.getState().trees.filter(tree => tree.id == id);
    if (trees.length == 1) {
      return trees[0];
    }
    return null;
  }
  handleRefresh() {
    this.code = 200;
  }
  handleFetchedTrees(props) {
    this.trees = [];
    props.forEach((props) => {
      this.trees.push(new TreeModel(props));
    });
    this.code = 200;
  }
  handleSetCode(code) {
    this.code = code;
  }
  handleSetSelected(id) {
    this.selected = id;
    this.code = 200;
  }
}

module.exports = alt.createStore(TreeStore, 'TreeStore');
