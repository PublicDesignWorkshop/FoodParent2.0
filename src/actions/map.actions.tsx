import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { MapModel, IMapProps, IMapLocationProps, IMapTileProps, IMapZoomProps, IMapFirstProps } from './../stores/map.store';
import { TileMode } from './../components/map.component';

interface IMapActions {
  addMap(id: string, map: L.Map): IMapProps;
  update(id: string): string;
  panTo(id: string, location: L.LatLng, zoom: number): IMapLocationProps;
  moveTo(id: string, location: L.LatLng, zoom: number): IMapLocationProps;
  setTile(id: string, tile: TileMode): IMapTileProps;
  setZoom(id: string, zoom: number): IMapZoomProps;
  setFirst(id: string, first: boolean): IMapFirstProps;
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
}

export const mapActions = alt.createActions<IMapActions>(MapActions);
