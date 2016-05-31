import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { MapModel, IMapProps, IMapLocationProps } from './../stores/map.store';

interface IMapActions {
  addMap(id: string, map: L.Map): IMapProps;
  update(id: string): string;
  panTo(id: string, location: L.LatLng): IMapLocationProps;
  moveTo(id: string, location: L.LatLng): IMapLocationProps;
}

class MapActions extends AbstractActions implements IMapActions {
  addMap(id: string, map: L.Map) {
    let self: MapActions = this;
    return {id, map};
  }
  update(id: string) {
    let self: MapActions = this;
    return id;
  }
  panTo(id: string, location: L.LatLng) {
    let self: MapActions = this;
    return {id, location};
  }
  moveTo(id: string, location: L.LatLng) {
    let self: MapActions = this;
    return {id, location};
  }
}

export const mapActions = alt.createActions<IMapActions>(MapActions);
