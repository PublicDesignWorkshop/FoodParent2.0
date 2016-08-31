import $ from 'jquery';
let alt = require('./../alt');
import * as L from 'leaflet';
import moment from 'moment';
import * as _ from 'underscore';
import { browserHistory } from 'react-router';

let MapSetting = require('./../../setting/map.json');
let ServerSetting = require('./../../setting/server.json');
let TreeActions = require('./../actions/tree.actions');
let FlagStore = require('./../stores/flag.store');
let MapStore = require('./../stores/map.store');
let DonateStore = require('./../stores/donate.store');
let AuthActions = require('./../actions/auth.actions');

import { TreeModel } from './tree.model';

class TreeStore {
  constructor() {
    this.selected = null;
    this.temp = null;
    this.trees = [];
    this.code = 0;
    // Bind action methods to store.
    this.bindListeners({
      handleFetchedTree: TreeActions.FETCHED_TREE,
      handleFetchedTrees: TreeActions.FETCHED_TREES,
      handleSetCode: TreeActions.SET_CODE,
      handleSetEditing: TreeActions.SET_EDITING,
      handleSetSelected: TreeActions.SET_SELECTED,
      handleRefresh: TreeActions.REFRESH,
      handleCreateTempTree: TreeActions.CREATE_TEMP_TREE,
      handleCreatedTree: TreeActions.CREATED_TREE,
      handleUpdatedTree: TreeActions.UPDATED_TREE,
      handleDeletedTree: TreeActions.DELETED_TREE,
      handleReset: TreeActions.RESET,
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
  handleFetchedTree(props) {
    if (props) {
      let trees = this.trees.filter(tree => tree.id == parseInt(props.id));
      if (trees.length > 0) {
        trees[0] = new TreeModel(props);
      } else {
        this.trees.push(new TreeModel(props));
      }
      this.selected = parseInt(props.id);
      this.temp = new TreeModel(props);
      this.temp.editing = null;
    }
    this.code = 200;
  }
  handleFetchedTrees(props) {
    if (props) {
      this.trees = [];
      props.forEach((props) => {
        let tree = new TreeModel(props);
        if (DonateStore.getState().temp) {
          if ($.inArray(tree.id, DonateStore.getState().temp.trees) != -1) {
            tree.checked = true;
          }
        }
        this.trees.push(tree);
      });
    }
    this.code = 200;
  }
  handleSetCode(code) {
    this.code = code;
  }
  handleSetSelected(id) {
    this.selected = id;
    let trees = this.trees.filter(tree => tree.id == parseInt(id));
    if (trees.length > 0) {
      this.temp = new TreeModel(trees[0].toJSON());
      this.temp.editing = null;
    } else {
      this.temp = null;
    }
    this.code = 200;
  }
  handleSetEditing(props) {
    this.selected = props.id;
    let trees = this.trees.filter(tree => tree.id == parseInt(props.id));
    if (trees.length > 0) {
      this.temp = new TreeModel(trees[0].toJSON());
      this.temp.editing = props.editing;
    } else {
      this.temp = null;
    }
    this.code = 200;
  }
  handleRefresh() {
    this.code = 200;
  }
  handleCreateTempTree() { // id = 0 for new tree.
    let trees = this.trees.filter(tree => tree.id == 0);
    if (trees.length > 0) {
      this.trees = _.without(this.trees, ...trees);
    }
    let location = new L.LatLng(MapSetting.vPosition.x, MapSetting.vPosition.y);
    if (MapStore.getMapModel(MapSetting.sMapId)) {
      let map = MapStore.getMapModel(MapSetting.sMapId).map;
      let zoom = map.getZoom();
      let center = new L.LatLng(map.getCenter().lat, map.getCenter().lng);
      let point = L.CRS.EPSG3857.latLngToPoint(center, zoom);
      let rMap = document.getElementById(MapSetting.sMapId);
      if (rMap.clientWidth > rMap.clientHeight) {
        point.x -= map.getSize().x * 0.15;
      } else {
        //point.y += this.map.getSize().y * 0.15;
      }
      location = L.CRS.EPSG3857.pointToLatLng(point, zoom);
    }
    this.temp = new TreeModel({
      id: "0",
      lat: location.lat,
      lng: location.lng,
      food: "0",
      flag: "0",
      public: "1",
      dead: "0",
      description: "",
      address: "",
      owner: "0",
      parent: "0",
      rate: "-1",
      updated: moment(new Date()).format(ServerSetting.sServerDateFormat),
    });
    this.trees.push(this.temp);
    this.temp.editing = true;
    this.selected = 0;
    this.code = 200;
  }
  handleCreatedTree(props) {
    this.trees.push(new TreeModel(props));
    this.code = 200;
    setTimeout(function() {
      AuthActions.fetchAuth.defer();
      browserHistory.push({pathname: ServerSetting.uBase + '/tree/' + props.id});
    }.bind(this), 0);

  }
  handleUpdatedTree(props) {
    let trees = this.trees.filter(tree => tree.id == parseInt(props.id));
    if (trees.length == 1) {
      trees[0].update(props);
      this.temp = new TreeModel(trees[0].toJSON());
      this.temp.editing = false;
    }
    this.code = 200;
  }
  handleDeletedTree(props) {
    let i = -1;
    for(let j = 0; j < this.trees.length; j++) {
      if(this.trees[j].id === parseInt(props.id)) {
        i = j;
      }
    }
    if (i > -1) {
      this.trees.splice(i, 1);
    }
    this.temp = null;
    this.code = 200;
    setTimeout(function() {
      browserHistory.push({pathname: ServerSetting.uBase + '/'});
    }, 0);
  }
  handleReset() {
    this.selected = null;
    this.temp = null;
    this.trees = [];
    this.code = 200;
  }
}

module.exports = alt.createStore(TreeStore, 'TreeStore');
