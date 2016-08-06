let alt = require('./../alt');
let MapActions = require('./../actions/map.actions');
import * as L from 'leaflet';

let MapSetting = require('./../../setting/map.json');
import { MAPTILE } from './../utils/enum';

class MapModel {
  constructor(props) {
    this.id = props.id;
    this.map = props.map;
    this.tile = MAPTILE.FLAT;
    this.first = true;
    this.active = true;
  }
  // public getCenter() {
  //   let point: L.Point = L.CRS.EPSG3857.latLngToPoint(this.map.getCenter(), this.map.getZoom());
  //   let rMap = document.getElementById(this.id);
  //   if (rMap.clientWidth > rMap.clientHeight) {
  //     point.x -= this.map.getSize().x * 0.15;
  //   } else {
  //     //point.y += this.map.getSize().y * 0.15;
  //   }
  //   let location: L.LatLng = L.CRS.EPSG3857.pointToLatLng(point, this.map.getZoom());
  //   return location;
  // }
}

class MapStore {
  constructor() {
    this.maps = [];
    this.location = new L.LatLng(MapSetting.vPosition.x, MapSetting.vPosition.y);

    this.bindListeners({
      handleAddMap: MapActions.ADD_MAP,
      handleUpdate: MapActions.UPDATE,
      handlePanTo: MapActions.PAN_TO,
      handleMoveTo: MapActions.MOVE_TO,
      handleSetTile: MapActions.SET_TILE,
      handleSetZoom: MapActions.SET_ZOOM,
      handleSetJustMounted: MapActions.SET_JUST_MOUNTED,
      handleSetActive: MapActions.SET_ACTIVE,
      handleMoveToLocationWithMarker: MapActions.MOVE_TO_LOCATION_WITH_MARKER,
    });

    this.exportPublicMethods({
      getMapModel: this.getMapModel,
      isMapExist: this.isMapExist,
      getMapTile: this.getMapTile,
      getZoom: this.getZoom,
    });
  }

  isMapExist(id) {
    if (this.getState().maps) {
      let maps = this.getState().maps.filter(map => map.id == id);
      if (maps.length == 1) {
        return true;
      }
      return false;
    }
    return false;
  }

  getMapModel(id) {
    if (this.getState().maps) {
      let maps = this.getState().maps.filter(map => map.id == id);
      if (maps.length == 1) {
        return maps[0];
      }
      return null;
    }
    return null;
  }

  getMapTile(id) {
    if (this.getState().maps) {
      let maps = this.getState().maps.filter(map => map.id == id);
      if (maps.length == 1) {
        return maps[0].tile;
      }
      return null;
    }
    return null;
  }

  getZoom(id) {
    if (this.getState().maps) {
      let maps = this.getState().maps.filter(map => map.id == id);
      if (maps.length == 1) {
        return maps[0].map.getZoom();
      }
      return null;
    }
    return null;
  }

  handleAddMap(props) {
    let temp = new MapModel(props);
    let maps = this.maps.filter(map => map.id == temp.id);
    if (maps.length == 0) {
      this.maps.push(temp);
    } else {
      maps[0] = temp;
    }
    this.code = null;
  }
  handleUpdate(id) {

  }
  handlePanTo(props) {
    // let maps = this.maps.filter(map => map.getId() == props.id);
    // if (maps.length == 1) {
    //   let location = new L.LatLng(props.location.lat, props.location.lng);
    //   let point = L.CRS.EPSG3857.latLngToPoint(location, props.zoom);
    //   let rMap = document.getElementById(props.id);
    //   if (rMap.clientWidth > rMap.clientHeight) {
    //     point.x += maps[0].map.getSize().x * 0.15;
    //   } else {
    //     //point.y += maps[0].map.getSize().y * 0.15;
    //   }
    //   location = L.CRS.EPSG3857.pointToLatLng(point, props.zoom);
    //   maps[0].map.panTo(location, props.zoom);
    // }
  }
  handleMoveTo(props) {
    // let maps = this.maps.filter(map => map.getId() == props.id);
    // if (maps.length == 1) {
    //   let location: L.LatLng = new L.LatLng(props.location.lat, props.location.lng);
    //   let point: L.Point = L.CRS.EPSG3857.latLngToPoint(location, props.zoom);
    //   let rMap = document.getElementById(props.id);
    //   if (rMap.clientWidth > rMap.clientHeight) {
    //     point.x += maps[0].map.getSize().x * 0.15;
    //   } else {
    //     //point.y += this.map.getSize().y * 0.15;
    //   }
    //   location = L.CRS.EPSG3857.pointToLatLng(point, props.zoom);
    //   maps[0].map.setView(location, props.zoom);
    // }
  }
  handleSetTile(props) {
    let maps = this.maps.filter(map => map.id == props.id);
    if (maps.length == 1) {
      return maps[0].tile = props.tile;
    }
    return null;
  }
  handleSetZoom(props) {
    let maps = this.maps.filter(map => map.id == props.id);
    if (maps.length == 1) {
      maps[0].map.setZoom(props.zoom);
    }
  }
  handleSetJustMounted(props) {
    // let maps = self.maps.filter(map => map.id == props.id);
    // if (maps.length == 1) {
    //   maps[0].setFirst(props.first);
    // }
  }
  handleSetActive(props) {
    // let maps = self.maps.filter(map => map.id == props.id);
    // if (maps.length == 1) {
    //   maps[0].setActive(props.active);
    // }
  }
  handleMoveToLocationWithMarker(props) {
    let maps = this.maps.filter(map => map.id == props.id);
    if (maps.length == 1) {
      let location: L.LatLng = new L.LatLng(props.location.lat, props.location.lng);
      let point: L.Point = L.CRS.EPSG3857.latLngToPoint(location, props.zoom);
      let rMap = document.getElementById(props.id);
      if (rMap.clientWidth > rMap.clientHeight) {
        point.x += maps[0].map.getSize().x * 0.15;
      } else {
        //point.y += this.map.getSize().y * 0.15;
      }
      location = L.CRS.EPSG3857.pointToLatLng(point, props.zoom);
      maps[0].map.setView(location, props.zoom);
      this.location = props.location;
    }
  }

}

module.exports = alt.createStore(MapStore, 'MapStore');
