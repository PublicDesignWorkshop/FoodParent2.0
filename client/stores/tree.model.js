import $ from 'jquery';
let alt = require('./../alt');
import * as L from 'leaflet';
import moment from 'moment';
import * as _ from 'underscore';
import { browserHistory } from 'react-router';

let MapSetting = require('./../../setting/map.json');
let ServerSetting = require('./../../setting/server.json');

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
      dead: this.dead,
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
    this.ownership = parseInt(props.public);  // ownership (public or private).
    this.dead = parseInt(props.dead);         // 1: dead, 0: alive.
    this.owner = parseInt(props.owner);       // id of the person who creates this tree.
    this.updated = moment(props.updated);
    if (!this.updated.isValid()) {
      this.updated = moment(new Date());
    }
    this.flags = props.flag.split(',').map((flag: string) => {
      return parseInt(flag);
    });
    this.parents = props.parent.split(',').map((flag: string) => {
      return parseInt(flag);
    });
    this.rate = parseInt(props.rate);
    this.editing = null;
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
  addParent(id) {
    if (this.parents.indexOf(id) == -1) {
      this.parents.push(id);
    }
  }
  removeParent(id) {
    this.parents = _.without(this.parents, id);
  }
  isDead() {
    if (this.dead) {
      return true;
    }
    return false;
  }
}
