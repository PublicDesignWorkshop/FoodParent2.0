import * as ReactDOM from 'react-dom';
import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';
import * as L from 'leaflet';
import { browserHistory } from 'react-router';

var Settings = require('./../constraints/settings.json');
import { mapActions } from './../actions/map.actions';
import { AbstractStore } from './../stores/abstract.store';
import { TileMode } from './../components/map.component';

export interface IMapProps {
  id: string;
  map: L.Map;
}
export interface IMapLocationProps {
  id: string;
  location: L.LatLng;
  zoom: number;
}
export interface IMapTileProps {
  id: string;
  tile: TileMode;
}
export interface IMapZoomProps {
  id: string;
  zoom: number;
}
export interface IMapFirstProps {
  id: string;
  first: boolean;
}
export interface IMapActiveProps {
  id: string;
  active: boolean;
}

export class MapModel {
  id: string;
  map: L.Map;
  tile: TileMode;
  first: boolean;
  active: boolean;
  constructor(props: IMapProps) {
    let self: MapModel = this;
    self.id = props.id;
    self.map = props.map;
    self.tile = TileMode.GRAY;
    self.first = true;
    self.active = true;
  }
  public getId(): string {
    return this.id;
  }
  public getMap(): L.Map {
    return this.map;
  }
  public getTile(): TileMode {
    return this.tile;
  }
  public setTile(tile: TileMode) {
    this.tile = tile;
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
  public setZoom(zoom: number): void {
    this.map.setZoom(zoom);
  }
  public getZoom(): number {
    return this.map.getZoom();
  }
  public setFirst(first: boolean): void {
    this.first = first;
  }
  public getFirst(): boolean {
    return this.first;
  }
  public setActive(active: boolean): void {
    this.active = active;
  }
  public getActive(): boolean {
    return this.active;
  }
}

export interface MapState {
  maps: Array<MapModel>;
  position: L.LatLng;
  errorMessage: string;
}

interface MapExtendedStore extends AltJS.AltStore<MapState> {
  // addMap(id: string, map: L.Map): void;
  getMap(id: string): L.Map;
  getCenter(id: string): L.LatLng;
  getZoom(id: string): number;
  getTile(id: string): TileMode;
  getFirst(id: string): boolean;
  getActive(id: string): boolean;
}

class MapStore extends AbstractStore<MapState> {
  private maps: Array<MapModel>;
  private position: L.LatLng;
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
      handleSetTile: mapActions.setTile,
      handleSetZoom: mapActions.setZoom,
      handleSetFirst: mapActions.setFirst,
      handleSetActive: mapActions.setActive,
      handleMovedToUserLocation: mapActions.movedToUserLocation,
    });
    self.exportPublicMethods({
      getMap: self.getMap,
      getCenter: self.getCenter,
      getZoom: self.getZoom,
      getTile: self.getTile,
      getFirst: self.getFirst,
      getActive: self.getActive,
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
    if (self.getState().maps) {
      let maps = self.getState().maps.filter(map => map.getId() == id);
      if (maps.length == 1) {
        return maps[0].getZoom();
      }
      return Settings.iDefaultZoom;
    }
    return Settings.iDefaultZoom;
  }
  handleUpdate(id: string) {

  }
  handleMoveTo(props: IMapLocationProps) {
    let self: MapStore = this;
    let maps = self.maps.filter(map => map.getId() == props.id);
    if (maps.length == 1) {
      let location: L.LatLng = new L.LatLng(props.location.lat, props.location.lng);
      let point: L.Point = L.CRS.EPSG3857.latLngToPoint(location, props.zoom);
      let rMap = document.getElementById(props.id);
      if (rMap.clientWidth > rMap.clientHeight) {
        point.x += maps[0].map.getSize().x * 0.15;
      } else {
        //point.y += self.map.getSize().y * 0.15;
      }
      location = L.CRS.EPSG3857.pointToLatLng(point, props.zoom);
      maps[0].map.setView(location, props.zoom);
    }
  }
  handlePanTo(props: IMapLocationProps) {
    let self: MapStore = this;
    let maps = self.maps.filter(map => map.getId() == props.id);
    if (maps.length == 1) {
      let location: L.LatLng = new L.LatLng(props.location.lat, props.location.lng);
      let point: L.Point = L.CRS.EPSG3857.latLngToPoint(location, props.zoom);
      let rMap = document.getElementById(props.id);
      if (rMap.clientWidth > rMap.clientHeight) {
        point.x += maps[0].map.getSize().x * 0.15;
      } else {
        //point.y += self.map.getSize().y * 0.15;
      }
      location = L.CRS.EPSG3857.pointToLatLng(point, props.zoom);
      maps[0].map.panTo(location, props.zoom);
    }
  }
  handleMovedToUserLocation(props: IMapLocationProps) {
    let self: MapStore = this;
    let maps = self.maps.filter(map => map.getId() == props.id);
    if (maps.length == 1) {
      let location: L.LatLng = new L.LatLng(props.location.lat, props.location.lng);
      let point: L.Point = L.CRS.EPSG3857.latLngToPoint(location, props.zoom);
      let rMap = document.getElementById(props.id);
      if (rMap.clientWidth > rMap.clientHeight) {
        point.x += maps[0].map.getSize().x * 0.15;
      } else {
        //point.y += self.map.getSize().y * 0.15;
      }
      location = L.CRS.EPSG3857.pointToLatLng(point, props.zoom);
      maps[0].map.setView(location, props.zoom);
      self.position = props.location;
    }
  }




  getTile(id: string): TileMode {
    let self: MapStore = this;
    if (self.getState().maps) {
      let maps = self.getState().maps.filter(map => map.getId() == id);
      if (maps.length == 1) {
        return maps[0].getTile();
      }
      return TileMode.GRAY;
    }
    return TileMode.GRAY;
  }
  handleSetTile(props: IMapTileProps) {
    let self: MapStore = this;
    let maps = self.maps.filter(map => map.getId() == props.id);
    if (maps.length == 1) {
      return maps[0].setTile(props.tile);
    }
    return null;
  }
  handleSetZoom(props: IMapZoomProps) {
    let self: MapStore = this;
    let maps = self.maps.filter(map => map.getId() == props.id);
    if (maps.length == 1) {
      return maps[0].setZoom(props.zoom);
    }
    return null;
  }
  handleSetFirst(props: IMapFirstProps) {
    let self: MapStore = this;
    let maps = self.maps.filter(map => map.getId() == props.id);
    if (maps.length == 1) {
      maps[0].setFirst(props.first);
    }
  }
  getFirst(id: string) {
    let self: MapStore = this;
    let maps = self.getState().maps.filter(map => map.getId() == id);
    if (maps.length == 1) {
      return maps[0].getFirst();
    }
  }
  handleSetActive(props: IMapActiveProps) {
    let self: MapStore = this;
    let maps = self.maps.filter(map => map.getId() == props.id);
    if (maps.length == 1) {
      maps[0].setActive(props.active);
    }
  }
  getActive(id: string) {
    let self: MapStore = this;
    let maps = self.getState().maps.filter(map => map.getId() == id);
    if (maps.length == 1) {
      return maps[0].getActive();
    }
  }
}

export const mapStore: MapExtendedStore = alt.createStore<MapState>(MapStore) as MapExtendedStore;
