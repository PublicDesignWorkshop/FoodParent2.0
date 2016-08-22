let alt = require('./../alt');
import * as L from 'leaflet';
import moment from 'moment';
import * as _ from 'underscore';
import { browserHistory } from 'react-router';


let MapSetting = require('./../../setting/map.json');
let ServerSetting = require('./../../setting/server.json');
let LocationActions = require('./../actions/location.actions');
let FlagStore = require('./../stores/flag.store');
let MapStore = require('./../stores/map.store');
let AuthActions = require('./../actions/auth.actions');


export class LocationModel {
  constructor(props) {
    this.update(props);
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      lat: this.lat,
      lng: this.lng,
      description: this.description,
      address: this.address,
    }
  }
  update(props) {
    this.id = parseInt(props.id);
    this.name = props.name;
    this.lat = parseFloat(parseFloat(props.lat).toFixed(MapSetting.iMarkerPrecision));
    this.lng = parseFloat(parseFloat(props.lng).toFixed(MapSetting.iMarkerPrecision));
    this.description = props.description;
    this.address = props.address;
    this.updated = moment(props.updated);
    // Editing value will decide to what kind of marker to put on the map.
    this.editing = null;
  }
  getLocation() {
    return new L.LatLng(this.lat, this.lng);
  }
}

class LocationStore {
  constructor() {
    this.selected = null;
    this.temp = null;
    this.locations = [];
    this.code = 0;
    // Bind action methods to store.
    this.bindListeners({
      handleFetchedLocations: LocationActions.FETCHED_LOCATIONS,
      handleSetCode: LocationActions.SET_CODE,
      handleSetEditing: LocationActions.SET_EDITING,
      handleSetSelected: LocationActions.SET_SELECTED,
      handleRefresh: LocationActions.REFRESH,
      handleCreateTempLocation: LocationActions.CREATE_TEMP_LOCATION,
      handleCreatedLocation: LocationActions.CREATED_LOCATION,
      handleUpdatedLocation: LocationActions.UPDATED_LOCATION,
      handleDeletedLocation: LocationActions.DELETED_LOCATION,
    });
    // Expose public methods.
    this.exportPublicMethods({
      getLocation: this.getLocation,
    });
  }
  getLocation(id) {
    let locations = this.getState().locations.filter(location => location.id == id);
    if (locations.length == 1) {
      return locations[0];
    }
    return null;
  }
  handleFetchedLocations(props) {
    if (props.props) {
      this.locations = [];
      props.props.forEach((props) => {
        this.locations.push(new LocationModel(props));
      });
    }
    this.selected = props.id;
    let locations = this.locations.filter(location => location.id == parseInt(props.id));
    if (locations.length > 0) {
      this.temp = new LocationModel(locations[0].toJSON());
      this.temp.editing = null;
    } else {
      this.temp = null;
    }
    this.code = 200;
  }
  handleSetCode(code) {
    this.code = code;
  }
  handleSetSelected(id) {
    this.selected = id;
    let locations = this.locations.filter(location => location.id == parseInt(id));
    if (locations.length > 0) {
      this.temp = new LocationModel(locations[0].toJSON());
      this.temp.editing = null;
    } else {
      this.temp = null;
    }
    this.code = 200;
  }
  handleSetEditing(props) {
    this.selected = props.id;
    let locations = this.locations.filter(location => location.id == parseInt(props.id));
    if (locations.length > 0) {
      this.temp = new LocationModel(locations[0].toJSON());
      this.temp.editing = props.editing;
    } else {
      this.temp = null;
    }
    this.code = 200;
  }
  handleRefresh() {
    this.code = 200;
  }
  handleCreateTempLocation() { // id = 0 for new location.
    let locations = this.loations.filter(location => location.id == 0);
    if (locations.length > 0) {
      this.locations = _.without(this.locations, ...locations);
    }
    let location = new L.LatLng(MapSetting.vPosition.x, MapSetting.vPosition.y);
    if (MapStore.getMapModel(MapSetting.sRecipeintMapId)) {
      let map = MapStore.getMapModel(MapSetting.sRecipeintMapId).map;
      let zoom = map.getZoom();
      let center = new L.LatLng(map.getCenter().lat, map.getCenter().lng);
      let point = L.CRS.EPSG3857.latLngToPoint(center, zoom);
      let rMap = document.getElementById(MapSetting.sRecipeintMapId);
      if (rMap.clientWidth > rMap.clientHeight) {
        point.x -= map.getSize().x * 0.15;
      } else {
        //point.y += this.map.getSize().y * 0.15;
      }
      location = L.CRS.EPSG3857.pointToLatLng(point, zoom);
    }
    this.temp = new LocationModel({
      id: "0",
      lat: location.lat,
      lng: location.lng,
      name: "",
      description: "",
      address: "",
      updated: moment(new Date()).format(ServerSetting.sServerDateFormat),
    });
    this.locations.push(this.temp);
    this.temp.editing = true;
    this.selected = 0;
    this.code = 200;
  }
  handleCreatedLocation(props) {
    this.locations.push(new LocationModel(props));
    this.code = 200;
    AuthActions.fetchAuth.defer();
    browserHistory.push({pathname: ServerSetting.uBase + '/recipient/' + props.id});
  }
  handleUpdatedLocation(props) {
    let locations = this.locations.filter(location => location.id == parseInt(props.id));
    if (locations.length == 1) {
      locations[0].update(props);
      this.temp = new LocationModel(locations[0].toJSON());
      this.temp.editing = false;
    }
    this.code = 200;
  }
  handleDeletedLocation(props) {
    let i = -1;
    for(let j = 0; j < this.locations.length; j++) {
      if(this.locations[j].id === parseInt(props.id)) {
        i = j;
      }
    }
    if (i > -1) {
      this.locations.splice(i, 1);
    }
    this.temp = null;
    this.code = 200;
    browserHistory.push({pathname: ServerSetting.uBase + '/recipients'});
  }
}

module.exports = alt.createStore(LocationStore, 'LocationStore');
