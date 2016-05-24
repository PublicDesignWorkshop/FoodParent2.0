import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'googletile';
import * as _ from 'underscore';
import * as $ from 'jquery';
import * as moment from 'moment';

import Routes from './../routes';
var Settings = require('./../constraints/settings.json');
import * as styles from './trees.component.css';
import './../../node_modules/leaflet/dist/leaflet.css';
import { TreeModel, treeStore } from './../stores/tree.store';
import { FoodModel, foodStore } from './../stores/food.store';
import { treeActions } from './../actions/tree.actions';
import MarkerComponent from './marker.component';
import { TreesMode } from './trees.component';

export enum TileMode {
  GRAY, SATELLITE
}

export interface IMapProps {
  foods: Array<FoodModel>;
  trees: Array<TreeModel>;
  treeId: number;
  zoom: number;
  onRender: Function;
  onZoom: Function;
  position: L.LatLng;
  offGeo: Function;
  mode: TreesMode;
  tile: TileMode;
}
export interface IMapStatus {

}
export default class MapComponent extends React.Component<IMapProps, IMapStatus> {
  private map: L.Map;
  private grayTileLayer: L.TileLayer;
  private satTileLayer: any;
  private layer: L.MarkerClusterGroup;
  private markers: Array<L.Marker>;
  private userMarker: L.Circle;
  private userCenterMarker: L.Circle;
  private selected: L.Marker;
  private position: L.LatLng;
  private newMarker: L.Marker;
  static contextTypes: any;
  constructor(props : IMapProps) {
    super(props);
    this.state = {

    };
    let self: MapComponent = this;
    self.position = new L.LatLng(Settings.vPosition.x, Settings.vPosition.y);
    self.markers = new Array<L.Marker>();
  }
  public componentDidMount() {
    let self: MapComponent = this;
    self.map = this.map = L.map("map", {
        zoomControl: false,
        closePopupOnClick: false,
        doubleClickZoom: true,
        touchZoom: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
    }).setView(self.position, Settings.iDefaultZoom);
    self.grayTileLayer = L.tileLayer(Settings.uGrayTileMap, {
        minZoom: Settings.iMinZoom,
        maxZoom: Settings.iMaxZoom,
    });
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
    // fetch trees after map is loaded.
    self.map.whenReady(self.afterRenderMap);

  }
  public componentWillUnmount() {
    let self: MapComponent = this;
  }
  public componentWillReceiveProps (nextProps: IMapProps) {
    //this.setState({cid: nextProps.cid});
    let self: MapComponent = this;
    if (nextProps.trees && nextProps.foods.length) {
      self.renderMarkers(nextProps.trees, nextProps);
      self.map.setZoom(nextProps.zoom);
      self.renderUserLocation(nextProps.position);

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
            //self.satTileLayer.addTo(self.map);
            self.map.removeLayer(self.grayTileLayer);
          }
          break;
      }

      switch(nextProps.mode) {
        case TreesMode.TREEDETAIL:
          if (self.newMarker) {
            self.map.removeLayer(self.newMarker);
            self.newMarker = null;
          }
          break;
        case TreesMode.TREEADDMARKER:
          var point: L.Point = L.CRS.EPSG3857.latLngToPoint(self.map.getCenter(), self.props.zoom);
          var rMap = ReactDOM.findDOMNode(self.refs['map']);
          if (rMap.clientWidth > rMap.clientHeight) {
            point.x -= self.map.getSize().x * 0.15;
          } else {
            //point.y += self.map.getSize().y * 0.15;
          }
          if (!self.newMarker) {
            var tree: TreeModel = new TreeModel({
              id: "0",
              lat: L.CRS.EPSG3857.pointToLatLng(point, self.props.zoom).lat + "",
              lng: L.CRS.EPSG3857.pointToLatLng(point, self.props.zoom).lng + "",
              food: "1",
              flag: "0",
              public: "1",
              description: "",
              address: "",
              owner: "0",
              parent: "0",
              rate: "-1",
              updated: moment(new Date()).format(Settings.sServerDateFormat),
            });
            treeStore.addTree(tree);
            self.newMarker = MarkerComponent.createTemporaryMarker(L.CRS.EPSG3857.pointToLatLng(point, self.props.zoom));
            self.map.addLayer(self.newMarker);
            self.newMarker.openPopup();
          }
          break;
      }
    }
  }
  private renderMarkers = (trees: Array<TreeModel>, props: IMapProps) => {
    let self: MapComponent = this;
    console.warn("renderMarkers");
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

    // Remove unnecessary markers
    for (let i = 0; i < self.markers.length;) {
      let bFound: boolean = false;
      trees.forEach((tree: TreeModel) => {
        if (tree.getId() == self.markers[i].options.id) {
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

    // Open tree info popup if the hash address has an existing tree id
    let bFound: boolean = false;
    if (props.treeId) {
      for (let i = 0; i < self.markers.length; i++) {
        if (self.markers[i].options.id == props.treeId) {
          bFound = true;
          if(self.markers[i].getPopup()._isOpen === true) {
            // popup already open
          } else {
            // popup not open
            self.markers[i].openPopup();
          }
          break;
        }
      }
    }
    if (props.treeId != 0 && !bFound) {
      self.map.closePopup();
    }
  }

  private addMarker(tree: TreeModel, editable: boolean): void {
    let self: MapComponent = this;
    let marker: L.Marker;
    let food: FoodModel = foodStore.getFood(tree.getFoodId());
    if (food) {
      if (editable) {
        marker = MarkerComponent.createEditableMarker(food, tree);
      } else {
        marker = MarkerComponent.createUneditableMarker(food, tree);
      }
      if (marker) {
        /*
        marker.on('click', function() {
          console.log(self.selected);
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
      self.context.router.push({pathname: Settings.uBaseName + '/'});
      //self.props.onZoom(Settings.iFocusZoom);
      setTimeout(function() {
        var point: L.Point = L.CRS.EPSG3857.latLngToPoint(position, self.props.zoom);
        var rMap = ReactDOM.findDOMNode(self.refs['map']);
        self.map.panTo(L.CRS.EPSG3857.pointToLatLng(point, self.props.zoom));
      }, 250);
      self.props.offGeo();
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
    document.querySelector('.leaflet-bottom.leaflet-left').innerHTML = '<div class="leaflet-control-attribution leaflet-control"><div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a></div></div>';
    self.map.on("moveend", self.afterMoveMap);
    self.map.on('popupopen', function (event: any) {
      setTimeout(function() {
        var marker: L.Marker = event.popup._source;
        self.selected = marker;
        self.selected._bringToFront();

        // Move the map slight off from the center using CRS projection
        var point: L.Point = L.CRS.EPSG3857.latLngToPoint(self.selected.getLatLng(), self.props.zoom);
        var rMap = ReactDOM.findDOMNode(self.refs['map']);
        if (rMap.clientWidth > rMap.clientHeight) {
          point.x += self.map.getSize().x * 0.15;
        } else {
          //point.y += self.map.getSize().y * 0.15;
        }
        self.map.panTo(L.CRS.EPSG3857.pointToLatLng(point, self.props.zoom));
        //self.context.router.push({pathname: Settings.uBaseName + '/trees/' + self.selected.options.id});
      }, 250);
    });
    self.map.on('popupclose', function (event: any) {
      self.selected = null;
    });
    self.map.on('zoomend', function (event: any) {
      self.props.onZoom(event.target._zoom);
    });
    self.props.onRender();
  }

  private afterMoveMap = () => {
    var self: MapComponent = this;
  }
  render() {
    let self: MapComponent = this;
    return (
      <div id="map" ref="map" className={styles.map}></div>
    );
  }
}

MapComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
