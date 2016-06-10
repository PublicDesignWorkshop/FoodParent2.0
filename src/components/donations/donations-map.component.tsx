import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'googletile';
import * as _ from 'underscore';
import * as $ from 'jquery';
import * as moment from 'moment';

import Routes from './../../routes';
var Settings = require('./../../constraints/settings.json');
import './../../../node_modules/leaflet/dist/leaflet.css';
import * as styles from './donations.component.css';
import { locationStore, LocationModel, LocationState } from './../../stores/location.store';
import { locationActions } from './../../actions/location.actions';
import MarkerComponent from './../marker.component';
import { DonationsMode } from './donations.component';

import { mapActions } from './../../actions/map.actions';
import { mapStore } from './../../stores/map.store';

export enum TileMode {
  GRAY, SATELLITE
}

export interface IMapProps {
  locations?: Array<LocationModel>;
  tempLocation?: LocationModel;
  tile?: TileMode;
  // zoom?: number;
  locationId: number;
  mode: DonationsMode;
  onRender: Function;
  position?: L.LatLng;
}
export interface IMapStatus {

}
export default class MapComponent extends React.Component<IMapProps, IMapStatus> {
  static contextTypes: any;
  private map: L.Map;
  private grayTileLayer: L.TileLayer;
  private satTileLayer: any;
  private layer: L.MarkerClusterGroup;
  private markers: Array<L.Marker>;
  private selected: L.Marker;
  private newMarker: L.Marker;
  private userMarker: L.Circle;
  private userCenterMarker: L.Circle;

  constructor(props : IMapProps) {
    super(props);
    this.state = {

    };
    let self: MapComponent = this;
    self.markers = new Array<L.Marker>();
  }
  public componentDidMount() {
    let self: MapComponent = this;
    self.map = this.map = L.map("map-donation", {
        zoomControl: false,
        closePopupOnClick: false,
        doubleClickZoom: true,
        touchZoom: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
    }).setView(new L.LatLng(Settings.vPosition.x, Settings.vPosition.y), Settings.iDefaultZoom);
    self.grayTileLayer = L.tileLayer(Settings.uGrayTileMap, {
        minZoom: Settings.iMinZoom,
        maxZoom: Settings.iMaxZoom,
    });
    // Optional tile map address.
    // self.satTileLayer = L.tileLayer(Settings.uSatTileMap, {
    //     minZoom: Settings.iMinZoom,
    //     maxZoom: Settings.iMaxZoom,
    // });
    self.satTileLayer = new L.Google(Settings.sGoogleMapTileType, {
      minZoom: Settings.iMinZoom,
      maxZoom: Settings.iMaxZoom,
    });
    self.grayTileLayer.addTo(self.map);
    self.map.invalidateSize(false);
    self.map.whenReady(self.afterRenderMap);
    setTimeout(function() {
      if (!self.props.locationId) {
        mapActions.setFirst('map-donation', false);
      }
    }, Settings.iPopupDelay);
  }
  public componentWillUnmount() {
    let self: MapComponent = this;
  }
  public componentWillReceiveProps (nextProps: IMapProps) {
    let self: MapComponent = this;
    if (nextProps.locations.length) {
      switch(nextProps.tile) {
        case TileMode.GRAY:
          if (!self.map.hasLayer(self.grayTileLayer)) {
            self.grayTileLayer.addTo(self.map);
            self.map.removeLayer(self.satTileLayer);
          }
          break;
        case TileMode.SATELLITE:
          if (!self.map.hasLayer(self.satTileLayer)) {
            self.map.addLayer(self.satTileLayer);
            self.map.removeLayer(self.grayTileLayer);
          }
          break;
      }

      // self.map.setZoom(nextProps.zoom);
      // self.renderUserLocation(nextProps.position);
      switch(nextProps.mode) {
        case DonationsMode.LOCATIONADDMARKER:
        case DonationsMode.LOCATIONADDINFO:
          if (nextProps.tempLocation) {
            var point: L.Point = L.CRS.EPSG3857.latLngToPoint(self.map.getCenter(), self.map.getZoom());
            var rMap = ReactDOM.findDOMNode(self.refs['map-donation']);
            if (rMap.clientWidth > rMap.clientHeight) {
              point.x -= self.map.getSize().x * 0.15;
            } else {
              //point.y += self.map.getSize().y * 0.15;
            }
            if (!self.newMarker) {
              let location: L.LatLng = L.CRS.EPSG3857.pointToLatLng(point, self.map.getZoom());
              nextProps.tempLocation.setLat(location.lat);
              nextProps.tempLocation.setLng(location.lng);
              self.newMarker = MarkerComponent.createTemporaryLocationMarker(nextProps.tempLocation);
              self.map.addLayer(self.newMarker);
              self.newMarker.openPopup();
            }
          }
          break;
        default:
          if (self.newMarker) {
            self.map.removeLayer(self.newMarker);
            self.newMarker = null;
          }
        break;
      }
      self.renderMarkers(nextProps.locations, nextProps);
      self.renderUserLocation(nextProps.position);
    }
  }
  private renderMarkers = (locations: Array<LocationModel>, props: IMapProps) => {
    let self: MapComponent = this;
    // Remove unnecessary markers
    for (let i = 0; i < self.markers.length;) {
      let bFound: boolean = false;
      locations.forEach((location: LocationModel) => {
        if (location.getId() == self.markers[i].options.id && self.markers[i].getLatLng().lat == location.getLat() && self.markers[i].getLatLng().lng == location.getLng()) {
          bFound = true;
        }
      });
      if (!bFound) {
        self.removeMarker(self.markers[i]);
        self.markers = _.without(self.markers, self.markers[i]);
        i--;
      }
      i++;
    }

    locations.forEach((location: LocationModel) => {
      let bFound: boolean = false;
      for (let i = 0; i < self.markers.length && !bFound; i++) {
        if (location.getId() == self.markers[i].options.id) {
          bFound = true;
        }
      }
      if (location.getId() != 0 && !bFound) {
        self.addMarker(location, false);
      }
    });

    if (self.newMarker) {
      self.newMarker.setLatLng(props.tempLocation.getLocation());
    }

    // Open tree info popup if the hash address has an existing tree id
    let bFound: boolean = false;
    if (props.locationId) {
      if (self.selected != null && self.selected.options.id != props.locationId) {
        setTimeout(function() {
          mapActions.setFirst('map-donation', true);
        }, 0);
      }
      for (let i = 0; i < self.markers.length; i++) {
        if (self.markers[i].options.id == props.locationId) {
          bFound = true;
          // setTimeout(function() {
          //   let marker: L.Marker = self.markers[i];
          //   self.selected = marker;
          //   self.selected._bringToFront();
          //   mapActions.moveTo('map', self.selected.getLatLng(), Settings.iFocusZoom);
          //   //self.context.router.push({pathname: Settings.uBaseName + '/trees/' + self.selected.options.id});
          // }, Settings.iPopupDelay);
          if(self.markers[i].getPopup()._isOpen === true && self.selected && self.selected.options.id == props.locationId) {
            // popup is already open
          } else {
            setTimeout(function() {
              self.markers[i].openPopup();
            }, Settings.iPopupDelay);
            if (mapStore.getFirst('map-donation')) {
              // popup is not open
              setTimeout(function() {
                mapActions.setFirst('map-donation', false);
              }, 0);
              var marker: L.Marker = self.markers[i];
              self.selected = marker;
              // self.selected._bringToFront();
              // Move the map slight off from the center using CRS projection
              var point: L.Point = L.CRS.EPSG3857.latLngToPoint(self.selected.getLatLng(), Settings.iFocusZoom);
              var rMap = ReactDOM.findDOMNode(self.refs['map-donation']);
              if (rMap.clientWidth > rMap.clientHeight) {
                point.x += self.map.getSize().x * 0.15;
              } else {
                //point.y += self.map.getSize().y * 0.15;
              }
              let location: L.LatLng = L.CRS.EPSG3857.pointToLatLng(point, Settings.iFocusZoom);
              self.map.setView(location, Settings.iFocusZoom, {animate: false});
              // mapActions.moveTo('map', location, mapStore.getZoom('map'));
              //self.context.router.push({pathname: Settings.uBaseName + '/trees/' + self.selected.options.id});
            }
          }
          break;
        }
      }
    } else {
      self.selected = null;
    }
    if (props.mode != DonationsMode.LOCATIONADDMARKER && props.mode != DonationsMode.LOCATIONADDINFO && !bFound) {
      self.map.closePopup();
    }
  }

  private addMarker(location: LocationModel, editable: boolean): void {
    let self: MapComponent = this;
    let marker: L.Marker;
    if (editable) {
      // marker = MarkerComponent.createEditableMarker(food, tree);
    } else {
      marker = MarkerComponent.createUneditableLocationMarker(location);
    }
    if (marker) {
      /*
      marker.on('click', function() {
        s(self.selected);
        if (self.selected) {
          MarkerComponent.changeToNormalMarker(self.selected);
        }
        self.selected = marker;
        MarkerComponent.changeToBigMarker(self.selected);
        self.selected._bringToFront();
      });
      */
      self.markers.push(marker);
      self.layer.addLayer(marker);
    }
  }
  private removeMarker(marker: L.Marker): void {
      let self: MapComponent = this;
      self.layer.removeLayer(marker);
  }

  private renderUserLocation(position: L.LatLng): void {
    let self: MapComponent = this;
    if (position) {
      if (self.userMarker) {
        self.userMarker.setLatLng(position);
      } else {
        self.userMarker = new L.Circle(position, 10, {
          stroke: true,
          color: "rgb(0, 0, 0)",
          opacity: 0.75,
          weight: 4,
        });
        self.map.addLayer(self.userMarker);
      }
      if (self.userCenterMarker) {
        self.userCenterMarker.setLatLng(position);
      } else {
        self.userCenterMarker = new L.Circle(position, 1, {
          stroke: true,
          color: "rgb(0, 0, 0)",
          opacity: 0.75,
          fill: true,
          fillColor: "rgb(0, 0, 0)",
          fillOpacity: 0.75,
          weight: 4,
        });
        self.map.addLayer(self.userCenterMarker);
      }
      // // self.context.router.push({pathname: Settings.uBaseName + '/'});
      // var point: L.Point = L.CRS.EPSG3857.latLngToPoint(position, self.map.getZoom());
      // self.map.setView(L.CRS.EPSG3857.pointToLatLng(point, self.map.getZoom()), Settings.iFocusZoom, {animate: false});
    }
  }

  private afterRenderMap = () => {
    let self: MapComponent = this;
    self.layer = new L.MarkerClusterGroup();
    self.layer.initialize({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      maxClusterRadius: Settings.iMaxClusterRadius,
      disableClusteringAtZoom: Settings.iDisableClusteringAtZoom
    });
    self.layer.addTo(self.map);
    // document.querySelector('.leaflet-bottom.leaflet-left').innerHTML = '<div class="leaflet-control-attribution leaflet-control"><div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a></div></div>';
    self.map.on("moveend", self.afterMoveMap);
    self.map.on('popupopen', function (event: any) {
      if (!mapStore.getFirst('map-donation')) {
        var marker: L.Marker = event.popup._source;
        self.selected = marker;
        self.selected._bringToFront();
        // Move the map slight off from the center using CRS projection
        var point: L.Point = L.CRS.EPSG3857.latLngToPoint(self.selected.getLatLng(), mapStore.getZoom('map-donation'));
        var rMap = ReactDOM.findDOMNode(self.refs['map-donation']);
        if (rMap.clientWidth > rMap.clientHeight) {
          point.x += self.map.getSize().x * 0.15;
        } else {
          //point.y += self.map.getSize().y * 0.15;
        }
        let location: L.LatLng = L.CRS.EPSG3857.pointToLatLng(point, mapStore.getZoom('map-donation'));
        //mapActions.moveTo('map', location, mapStore.getZoom('map'));
        self.map.setView(location, mapStore.getZoom('map-donation'), {animate: true});
        //self.context.router.push({pathname: Settings.uBaseName + '/trees/' + self.selected.options.id});
      }
    });
    self.map.on('popupclose', function (event: any) {
      self.selected = null;
      // self.context.router.push({pathname: Settings.uBaseName + '/'});
    });
    self.map.on('zoomend', function (event: any) {
      // self.props.onZoom(event.target._zoom);
    });
    self.props.onRender();
    mapActions.addMap('map-donation', self.map);
  }

  private afterMoveMap = () => {
    var self: MapComponent = this;
    // Update mapStore to update address of the map when the map is dragged.
    // if (mapStore.getActive('map')) {
    //   setTimeout(function() {
    //     mapActions.update('map');
    //   }, 0);
    // }
  }
  render() {
    let self: MapComponent = this;
    return (
      <div id="map-donation" ref="map-donation" className={styles.map}></div>
    );
  }
}

MapComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
