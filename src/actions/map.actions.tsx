import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";

var Settings = require('./../constraints/settings.json');
import { MapModel, IMapProps, IMapLocationProps, IMapTileProps, IMapZoomProps, IMapFirstProps, IMapActiveProps } from './../stores/map.store';
import { TileMode } from './../components/map.component';
import { addLoading, removeLoading } from './../utils/loadingtracker';

interface IMapActions {
  addMap(id: string, map: L.Map): IMapProps;
  update(id: string): string;
  panTo(id: string, location: L.LatLng, zoom: number): IMapLocationProps;
  moveTo(id: string, location: L.LatLng, zoom: number): IMapLocationProps;
  moveToWithMarker(id: string, location: L.LatLng, zoom: number): IMapLocationProps;
  setTile(id: string, tile: TileMode): IMapTileProps;
  setZoom(id: string, zoom: number): IMapZoomProps;
  setFirst(id: string, first: boolean): IMapFirstProps;
  setActive(id: string, active: boolean): IMapActiveProps;
  moveToUserLocation(id: string);
  movedToUserLocation(id: string, location: L.LatLng, zoom: number): IMapLocationProps;
}

class MapActions extends AbstractActions implements IMapActions {
  addMap(id: string, map: L.Map): IMapProps {
    let self: MapActions = this;
    return {id, map};
  }
  update(id: string): string {
    let self: MapActions = this;
    return id;
  }
  panTo(id: string, location: L.LatLng, zoom: number): IMapLocationProps {
    let self: MapActions = this;
    return {id, location, zoom};
  }
  moveTo(id: string, location: L.LatLng, zoom: number): IMapLocationProps {
    let self: MapActions = this;
    return {id, location, zoom};
  }
  setTile(id: string, tile: TileMode): IMapTileProps {
    let self: MapActions = this;
    return {id, tile};
  }
  setZoom(id: string, zoom: number): IMapZoomProps {
    let self: MapActions = this;
    return {id, zoom};
  }
  setFirst(id: string, first: boolean): IMapFirstProps {
    return {id, first};
  }
  setActive(id: string, active: boolean): IMapActiveProps {
    return {id, active};
  }
  moveToUserLocation(id: string) {
    let self: MapActions = this;
    return (dispatch) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position: Position) {
          let location = new L.LatLng(position.coords.latitude, position.coords.longitude);
          self.movedToUserLocation(id, location, Settings.iFocusZoom);
        }, null);
      }
    }
  }
  movedToUserLocation(id: string, location: L.LatLng, zoom: number): IMapLocationProps {
    let self: MapActions = this;
    return {id: id, location: location, zoom: zoom};
  }
  moveToWithMarker(id: string, location: L.LatLng, zoom: number): IMapLocationProps {
    let self: MapActions = this;
    return {id, location, zoom};
  }
}

export const mapActions = alt.createActions<IMapActions>(MapActions);
