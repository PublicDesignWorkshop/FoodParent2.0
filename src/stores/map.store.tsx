import * as ReactDOM from 'react-dom';
import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';
import * as L from 'leaflet';
import { browserHistory } from 'react-router';

var Settings = require('./../constraints/settings.json');
import { mapActions } from './../actions/map.actions';
import { AbstractStore } from './../stores/abstract.store';

export interface IMapProps {
  id: string;
  map: L.Map;
}
export interface IMapLocationProps {
  id: string;
  location: L.LatLng;
}

export class MapModel {
  id: string;
  map: L.Map;
  constructor(props: IMapProps) {
    let self: MapModel = this;
    self.id = props.id;
    self.map = props.map;
  }
  public getId(): string {
    return this.id;
  }
  public getMap(): L.Map {
    return this.map;
  }
  public getCenter(): L.LatLng {
    let self: MapModel = this;
    var point: L.Point = L.CRS.EPSG3857.latLngToPoint(self.map.getCenter(), self.map.getZoom());
    let rMap = document.getElementById(self.id);
    if (rMap.clientWidth > rMap.clientHeight) {
      point.x -= self.map.getSize().x * 0.15;
    } else {
      //point.y += self.map.getSize().y * 0.15;
    }
    let location: L.LatLng = L.CRS.EPSG3857.pointToLatLng(point, self.map.getZoom());
    return location;
  }
  public getZoom(): number {
    return this.map.getZoom();
  }
}

export interface MapState {
  maps: Array<MapModel>;
  errorMessage: string;
}

interface MapExtendedStore extends AltJS.AltStore<MapState> {
  // addMap(id: string, map: L.Map): void;
  getMap(id: string): L.Map;
  getCenter(id: string): L.LatLng;
  getZoom(id: string): number;
}

class MapStore extends AbstractStore<MapState> {
  private maps: Array<MapModel>;
  private errorMessage: string;
  constructor() {
    super();
    let self: MapStore = this;
    if (!self.maps) {
      self.maps = new Array<MapModel>();
    }
    self.errorMessage = null;
    // TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleAddMap: mapActions.addMap,
      handleMoveTo: mapActions.moveTo,
      handlePanTo: mapActions.panTo,
      handleUpdate: mapActions.update,
    });
    self.exportPublicMethods({
      getMap: self.getMap,
      getCenter: self.getCenter,
      getZoom: self.getZoom,
    });
  }
  handleAddMap(props: IMapProps) {
    let self: MapStore = this;
    let model: MapModel = new MapModel(props);

    let maps = self.maps.filter(map => map.getId() == model.getId());
    if (maps.length == 0) {
      self.maps.push(model);
    }
    self.errorMessage = null;
  }
  getMap(id: string): L.Map {
    let self: MapStore = this;
    let maps = self.getState().maps.filter(map => map.getId() == id);
    if (maps.length == 1) {
      return maps[0].map;
    }
    return null;
  }
  getCenter(id: string): L.LatLng {
    let self: MapStore = this;
    let maps = self.getState().maps.filter(map => map.getId() == id);
    if (maps.length == 1) {
      return maps[0].getCenter();
    }
    return null;
  }
  getZoom(id: string): number {
    let self: MapStore = this;
    let maps = self.getState().maps.filter(map => map.getId() == id);
    if (maps.length == 1) {
      return maps[0].getZoom();
    }
    return null;
  }
  handleUpdate(id: string) {
    
  }
  handleMoveTo(props: IMapLocationProps) {
    let self: MapStore = this;
    let maps = self.maps.filter(map => map.getId() == props.id);
    if (maps.length == 1) {
      let location: L.LatLng = new L.LatLng(props.location.lat, props.location.lng);
      let point: L.Point = L.CRS.EPSG3857.latLngToPoint(location, maps[0].map.getZoom());
      let rMap = document.getElementById(props.id);
      if (rMap.clientWidth > rMap.clientHeight) {
        point.x += maps[0].map.getSize().x * 0.15;
      } else {
        //point.y += self.map.getSize().y * 0.15;
      }
      location = L.CRS.EPSG3857.pointToLatLng(point, maps[0].map.getZoom());
      maps[0].map.setView(location);
    }
  }
  handlePanTo(props: IMapLocationProps) {
    let self: MapStore = this;
    let maps = self.maps.filter(map => map.getId() == props.id);
    if (maps.length == 1) {
      let location: L.LatLng = new L.LatLng(props.location.lat, props.location.lng);
      let point: L.Point = L.CRS.EPSG3857.latLngToPoint(location, maps[0].map.getZoom());
      let rMap = document.getElementById(props.id);
      if (rMap.clientWidth > rMap.clientHeight) {
        point.x += maps[0].map.getSize().x * 0.15;
      } else {
        //point.y += self.map.getSize().y * 0.15;
      }
      location = L.CRS.EPSG3857.pointToLatLng(point, maps[0].map.getZoom());
      maps[0].map.panTo(location);
    }
  }
}

export const mapStore: MapExtendedStore = alt.createStore<MapState>(MapStore) as MapExtendedStore;
