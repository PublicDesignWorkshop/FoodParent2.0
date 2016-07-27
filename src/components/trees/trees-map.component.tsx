import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import Routes from './../../routes';

import * as L from 'leaflet';
import * as leafletImage from 'leaflet-image';
import 'leaflet.markercluster';
import 'googletile';
import * as _ from 'underscore';
import * as moment from 'moment';

import './../../../node_modules/leaflet/dist/leaflet.css';
import * as styles from './trees.component.css';
var Settings = require('./../../constraints/settings.json');

import MarkerFactory from './../../utils/marker.factory';

import { TreeModel } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { FlagModel } from './../../stores/flag.store';
import { mapStore } from './../../stores/map.store';
import { mapActions } from './../../actions/map.actions';

import { TreesMode, TileMode } from './../../utils/enum';

export interface ITreesMapProps {
  foods?: Array<FoodModel>;
  trees?: Array<TreeModel>;
  flags?: Array<FlagModel>;
  tempTree?: TreeModel;
  tile?: TileMode;
  treeId: number;
  mode: TreesMode;
  onRender: Function;
  position?: L.LatLng;
}
export interface ITreesMapStatus {

}

export default class TreesMapComponent extends React.Component<ITreesMapProps, ITreesMapStatus> {
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
  constructor(props : ITreesMapProps) {
    super(props);
    this.state = {

    };
    let self: TreesMapComponent = this;
    self.markers = new Array<L.Marker>();
  }
  public componentDidMount() {
    let self: TreesMapComponent = this;
    self.map = this.map = L.map("map", {
        zoomControl: false,
        closePopupOnClick: false,
        doubleClickZoom: true,
        touchZoom: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
    }).setView(new L.LatLng(Settings.vPosition.x, Settings.vPosition.y), Settings.iDefaultZoom);
    self.grayTileLayer = L.tileLayer(Settings.uGrayTileMap + Settings.sMapboxAccessToken, {
        minZoom: Settings.iMinZoom,
        maxZoom: Settings.iMaxZoom,
    });

    // Optional tile map address (Mapbox).
    // self.satTileLayer = L.tileLayer(Settings.uSatTileMap + Settings.sMapboxAccessToken, {
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
      if (!self.props.treeId) {
        mapActions.setFirst('map', false);
      }
    }, Settings.iPopupDelay);
  }
  public componentWillUnmount() {
    let self: TreesMapComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreesMapProps) {
    let self: TreesMapComponent = this;
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

    if (nextProps.foods.length && nextProps.flags.length) {
      switch(nextProps.mode) {
        case TreesMode.TREEADDMARKER:
        case TreesMode.TREEADDINFO:
          if (nextProps.tempTree) {
            var point: L.Point = L.CRS.EPSG3857.latLngToPoint(self.map.getCenter(), self.map.getZoom());
            var rMap = ReactDOM.findDOMNode(self.refs['map']);
            if (rMap.clientWidth > rMap.clientHeight) {
              point.x -= self.map.getSize().x * 0.15;
            } else {
              //point.y += self.map.getSize().y * 0.15;
            }
            if (!self.newMarker) {
              let location: L.LatLng = L.CRS.EPSG3857.pointToLatLng(point, self.map.getZoom());
              nextProps.tempTree.setLat(location.lat);
              nextProps.tempTree.setLng(location.lng);
              self.newMarker = MarkerFactory.createTemporaryMarker(nextProps.tempTree);
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
      self.renderMarkers(nextProps.trees, nextProps);
      self.renderUserLocation(nextProps.position);
    }
  }
  private renderMarkers = (trees: Array<TreeModel>, props: ITreesMapProps) => {
    let self: TreesMapComponent = this;
    // Remove unnecessary markers
    for (let i = 0; i < self.markers.length;) {
      let bFound: boolean = false;
      trees.forEach((tree: TreeModel) => {
        if (tree.getId() == self.markers[i].options.id && tree.getFoodId() == self.markers[i].options.food && self.markers[i].getLatLng().lat == tree.getLat() && self.markers[i].getLatLng().lng == tree.getLng()) {
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

    trees.forEach((tree: TreeModel) => {
      let bFound: boolean = false;
      for (let i = 0; i < self.markers.length && !bFound; i++) {
        if (tree.getId() == self.markers[i].options.id) {
          bFound = true;
        }
      }
      if (tree.getId() != 0 && !bFound) {
        self.addMarker(tree, false);
      }
    });

    if (self.newMarker) {
      self.newMarker.setLatLng(props.tempTree.getLocation());
    }

    // Open tree info popup if the hash address has an existing tree id
    let bFound: boolean = false;
    if (props.treeId) {
      if (self.selected != null && self.selected.options.id != props.treeId) {
        setTimeout(function() {
          mapActions.setFirst('map', true);
        }, 0);
      }
      for (let i = 0; i < self.markers.length; i++) {
        if (self.markers[i].options.id == props.treeId) {
          bFound = true;
          if(self.markers[i].getPopup()._isOpen === true && self.selected && self.selected.options.id == props.treeId) {
            // When popup is already open.
          } else {
            setTimeout(function() {
              self.markers[i].openPopup();
            }, Settings.iPopupDelay);
            if (mapStore.getFirst('map')) {
              // popup is not open
              setTimeout(function() {
                mapActions.setFirst('map', false);
              }, 0);
              var marker: L.Marker = self.markers[i];
              self.selected = marker;
              // Move the map slight off from the center using CRS projection
              var point: L.Point = L.CRS.EPSG3857.latLngToPoint(self.selected.getLatLng(), Settings.iFocusZoom);
              var rMap = ReactDOM.findDOMNode(self.refs['map']);
              if (rMap.clientWidth > rMap.clientHeight) {
                point.x += self.map.getSize().x * 0.15;
              } else {
                //point.y += self.map.getSize().y * 0.15;
              }
              let location: L.LatLng = L.CRS.EPSG3857.pointToLatLng(point, Settings.iFocusZoom);
              self.map.setView(location, Settings.iFocusZoom, {animate: false});
            }
          }
          break;
        }
      }
    } else {
      self.selected = null;
    }
    if (props.mode != TreesMode.TREEADDMARKER && props.mode != TreesMode.TREEADDINFO && !bFound) {
      self.map.closePopup();
    }
  }

  private addMarker(tree: TreeModel, editable: boolean): void {
    let self: TreesMapComponent = this;
    let marker: L.Marker;
    let food: FoodModel = foodStore.getFood(tree.getFoodId());
    if (food) {
      if (editable) {
        marker = MarkerFactory.createEditableMarker(food, tree);
      } else {
        marker = MarkerFactory.createUneditableMarker(food, tree);
      }
      if (marker) {
        self.markers.push(marker);
        self.layer.addLayer(marker);
      }
    }
  }

  private removeMarker(marker: L.Marker): void {
      let self: TreesMapComponent = this;
      self.layer.removeLayer(marker);
  }

  private renderUserLocation(position: L.LatLng): void {
    let self: TreesMapComponent = this;
    if (position) {
      /// TEST code
      // html2canvas(document.querySelector('#map')).then(function(canvas) {
      //   document.querySelector('#png-container').appendChild(canvas);
      // });
      html2canvas(document.querySelector('.leaflet-zoom-animated')).then(function(canvas) {
        document.body.appendChild(canvas);
      });
      // var svgString = new XMLSerializer().serializeToString(document.querySelector('#map'));
      // var canvas = document.getElementById("canvas");
      // var ctx = canvas.getContext("2d");
      // var DOMURL = self.URL || self.webkitURL || self;
      // var img = new Image();
      // var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
      // var url = DOMURL.createObjectURL(svg);
      // img.onload = function() {
      //     ctx.drawImage(img, 0, 0);
      //     var png = canvas.toDataURL("image/png");
      //     document.querySelector('#png-container').innerHTML = '<img src="'+png+'"/>';
      //     DOMURL.revokeObjectURL(png);
      // };
      // img.src = url;

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
    }
  }

  private afterRenderMap = () => {
    let self: TreesMapComponent = this;
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
    self.map.on("moveend", self.afterMoveMap);
    self.map.on('popupopen', function (event: any) {
      if (!mapStore.getFirst('map')) {
        var marker: L.Marker = event.popup._source;
        self.selected = marker;
        self.selected._bringToFront();
        // Move the map slight off from the center using CRS projection
        var point: L.Point = L.CRS.EPSG3857.latLngToPoint(self.selected.getLatLng(), mapStore.getZoom('map'));
        var rMap = ReactDOM.findDOMNode(self.refs['map']);
        if (rMap.clientWidth > rMap.clientHeight) {
          point.x += self.map.getSize().x * 0.15;
        } else {
          //point.y += self.map.getSize().y * 0.15;
        }
        let location: L.LatLng = L.CRS.EPSG3857.pointToLatLng(point, mapStore.getZoom('map'));
        self.map.setView(location, mapStore.getZoom('map'), {animate: true});
      }
    });
    self.map.on('popupclose', function (event: any) {
      self.selected = null;
      // self.context.router.push({pathname: Settings.uBaseName + '/'});
    });
    self.props.onRender();
    mapActions.addMap('map', self.map);
  }

  private afterMoveMap = () => {
    var self: TreesMapComponent = this;
    // Update mapStore to update address of the map when the map is dragged (not activated to decrease the number of reverse-geo api calls).
    // if (mapStore.getActive('map')) {
    //   setTimeout(function() {
    //     mapActions.update('map');
    //   }, 0);
    // }
  }
  render() {
    let self: TreesMapComponent = this;
    return (
      <div id="map" ref="map" className={styles.map}></div>
    );
  }
}

TreesMapComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
