import React from 'react';

import * as L from 'leaflet';
import * as _ from 'underscore';
import 'leaflet.markercluster';
import 'leaflet-canvas-marker';
import 'googletile';
import { browserHistory } from 'react-router';

require('./maps.component.scss');
let MapSetting = require('./../../setting/map.json');
let ServerSetting = require('./../../setting/server.json');

let MapActions = require('./../actions/map.actions');
let MapStore = require('./../stores/map.store');
let FoodActions = require('./../actions/food.actions');
let FoodStore = require('./../stores/food.store');
let FlagActions = require('./../actions/flag.actions');
let FlagStore = require('./../stores/flag.store');
let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');

import { MAPTILE, MAPTYPE } from './../utils/enum';
import { createFocusMarker, createCanvasTreeMarker, createSVGTreeMarker } from './../utils/marker.factory';


export default class MapTree extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.afterRenderMap = this.afterRenderMap.bind(this);
  }
  componentWillMount() {

  }
  componentDidMount () {
    // Intialize leaflet only if not initialized.
    if (!MapStore.isMapExist(MapSetting.sTreeMapId)) {
      this.map = L.map(MapSetting.sTreeMapId, {
          zoomControl: MapSetting.bZoomControl,
          closePopupOnClick: MapSetting.bClosePopupOnClick,
          doubleClickZoom: MapSetting.bDoubleClickZoom,
          touchZoom: MapSetting.bTouchZoom,
          zoomAnimation: MapSetting.bZoomAnimation,
          markerZoomAnimation: MapSetting.bMarkerZoomAnimation,
          minZoom: MapSetting.iMinZoom,
          maxZoom: MapSetting.iMaxZoom,
      }).setView(new L.LatLng(MapSetting.vPosition.x, MapSetting.vPosition.y), MapSetting.iDefaultZoom);
      this.map.invalidateSize(false);
      this.map.whenReady(this.afterRenderMap);
    } else {
      MapActions.setMapType(MAPTYPE.TREE);
      this.map = MapStore.getMapModel(MapSetting.sTreeMapId).map;
      this.flatTileLayer = MapStore.getMapModel(MapSetting.sTreeMapId).flatTileLayer;
      this.satTileLayer = MapStore.getMapModel(MapSetting.sTreeMapId).satTileLayer;
      this.focusLayer = MapStore.getMapModel(MapSetting.sTreeMapId).focusLayer;
      this.markersLayer = MapStore.getMapModel(MapSetting.sTreeMapId).markersLayer;
    }
    this.updateProps(this.props);
    // this.map.closePopup();
  }

  afterRenderMap() {
    // Register map to Flux structure to synchronize React and Leaflet together.
    MapActions.addMap(MapSetting.sTreeMapId, this.map, MAPTYPE.TREE);
    // Define tile maps and store into the MapModel.
    if (!MapStore.getMapModel(MapSetting.sTreeMapId).flatTileLayer) {
      MapStore.getMapModel(MapSetting.sTreeMapId).flatTileLayer = this.flatTileLayer = L.tileLayer(MapSetting.uGrayTileMap + MapSetting.sMapboxAccessToken, {
          minZoom: MapSetting.iMinZoom,
          maxZoom: MapSetting.iMaxZoom,
      });
    }
    if (!MapStore.getMapModel(MapSetting.sTreeMapId).satTileLayer) {
      // Optional tile map address (Mapbox).
      // MapStore.getMapModel(MapSetting.sTreeMapId).satTileLayer = this.satTileLayer = L.tileLayer(MapSetting.uSatTileMap + MapSetting.sMapboxAccessToken, {
      //     minZoom: MapSetting.iMinZoom,
      //     maxZoom: MapSetting.iMaxZoom,
      // });
      MapStore.getMapModel(MapSetting.sTreeMapId).satTileLayer = this.satTileLayer = new L.Google(MapSetting.sGoogleMapTileType, {
        minZoom: MapSetting.iMinZoom,
        maxZoom: MapSetting.iMaxZoom,
      });
    }
    // Add a layer to show the focused area.
    if (!MapStore.getMapModel(MapSetting.sTreeMapId).focusLayer) {
      MapStore.getMapModel(MapSetting.sTreeMapId).focusLayer = this.focusLayer = L.layerGroup();
      this.focusLayer.addTo(this.map);
    }
    // Add a layer for rendering actual markers.
    if (!MapStore.getMapModel(MapSetting.sTreeMapId).markersLayer) {
      // Code Snipet for MarkerClusterGroup
      // MapStore.getMapModel(MapSetting.sTreeMapId).markersLayer = this.markersLayer = new L.MarkerClusterGroup();
      // this.markersLayer.initialize({
      //   spiderfyOnMaxZoom: MapSetting.bSpiderfyOnMaxZoom,
      //   showCoverageOnHover: MapSetting.bShowCoverageOnHover,
      //   zoomToBoundsOnClick: MapSetting.bZoomToBoundsOnClick,
      //   removeOutsideVisibleBounds: MapSetting.bRemoveOutsideVisibleBounds,
      //   maxClusterRadius: MapSetting.iMaxClusterRadius,
      //   disableClusteringAtZoom: MapSetting.iDisableClusteringAtZoom
      // });
      MapStore.getMapModel(MapSetting.sTreeMapId).markersLayer = this.markersLayer = new L.layerGroup();
      this.markersLayer.addTo(this.map);
    }
    // Add leaflet map event listeners.
  }
  renderMapTile() {
    // Choose the right map tile
    if (MapStore.getMapTile(MapSetting.sTreeMapId) == MAPTILE.FLAT) {
      if (!this.map.hasLayer(this.flatTileLayer)) {
        this.flatTileLayer.addTo(this.map);
        this.map.removeLayer(this.satTileLayer);
      }
    } else if (MapStore.getMapTile(MapSetting.sTreeMapId) == MAPTILE.SATELLITE) {
      if (!this.map.hasLayer(this.satTileLayer)) {
        this.map.addLayer(this.satTileLayer);
        this.map.removeLayer(this.flatTileLayer);
      }
    }
  }
  renderFocusMarker(location) {
    if (location) {
      if (this.focusLayer.getLayers().length == 0) {
        let marker = createFocusMarker(location);
        this.focusLayer.addLayer(marker);
      } else {
        this.focusLayer.getLayers()[0].setLatLng(location);
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
    if (nextProps.selected != this.props.selected) {
      this.renderPopup(TreeStore.getTree(nextProps.selected));
    }
  }
  componentWillUnmount() {

  }
  updateProps(props) {
    this.renderMapTile();
    if (this.props.location && props.location != null && this.props.location.lat != props.location.lat && this.props.location.lng != props.location.lng) {
      this.renderFocusMarker(props.location);
    }
    let temp = TreeStore.getState().temp;
    if (TreeStore.getState().code == 200 && (props.selected == null || props.selected != this.props.selected)) {
      this.renderMarkers(props.trees, props.selected);
    } else if (TreeStore.getState().code == 200 && temp && (temp.editing != null || !temp.editing)) {
      this.renderActiveMarker(temp);
      if (TreeStore.getState().code == 200 && temp && temp.id == 0) {
        this.renderMarkers(props.trees, props.selected);
      }
    }
  }
  renderPopup(tree) {
    if (tree != null) {
      let markers = this.markersLayer.getLayers();
      let bFound = false;
      let i = 0;
      for (; i < markers.length && !bFound; i++) {
        if (markers[i].options.id == tree.id) {
          bFound = true;
          markers[i].openPopup();
          let zoom = Math.max(this.map.getZoom(), MapSetting.iFocusZoom);
          // Move the map slight off from the center using CRS projection
          let point: L.Point = L.CRS.EPSG3857.latLngToPoint(new L.LatLng(tree.lat, tree.lng), zoom);
          let rMap = document.getElementById(MapSetting.sTreeMapId);
          if (rMap.clientWidth > rMap.clientHeight) {
            point.x += this.map.getSize().x * 0.15;
          } else {
            //point.y += this.map.getSize().y * 0.15;
          }
          let location: L.LatLng = L.CRS.EPSG3857.pointToLatLng(point, zoom);
          setTimeout(function() {
            this.map.setView(location, zoom, {animate: MapStore.getLoaded(MapSetting.sTreeMapId)});
            MapActions.setLoaded.defer(MapSetting.sTreeMapId, true);
          }.bind(this), 250);
        }
      }
    }
  }
  renderActiveMarker(tree) {  // tree in this case = TreeStore.getState().temp
    var markers = this.markersLayer.getLayers();
    let bFound = false;
    for (let i = 0; i < markers.length && !bFound; i++) {
      if (tree.editing) {
        if (tree && markers[i].options.id == tree.id) {
        // if (tree && markers[i].options.id == tree.id) {
          this.removeMarker(markers[i], this.markersLayer);
          markers = _.without(markers, markers[i]);
          bFound = true;
        }
      } else {
        if (tree && markers[i].options.id == tree.id && markers[i].options.draggable == true) {
        // if (tree && markers[i].options.id == tree.id) {
          this.removeMarker(markers[i], this.markersLayer);
          markers = _.without(markers, markers[i]);
          bFound = true;
        }
      }
    }
    if (!bFound && tree.id == 0) {
      bFound = true;
    }
    if (bFound) {
      let marker = this.addMarker(tree, tree.id, tree.editing);
      tree.marker = marker;
      marker.openPopup();

      let zoom = Math.max(this.map.getZoom(), MapSetting.iFocusZoom);
      // Move the map slight off from the center using CRS projection
      let point: L.Point = L.CRS.EPSG3857.latLngToPoint(new L.LatLng(tree.lat, tree.lng), zoom);
      let rMap = document.getElementById(MapSetting.sTreeMapId);
      if (rMap.clientWidth > rMap.clientHeight) {
        point.x += this.map.getSize().x * 0.15;
      } else {
        //point.y += this.map.getSize().y * 0.15;
      }
      let location: L.LatLng = L.CRS.EPSG3857.pointToLatLng(point, zoom);
      if (tree.id != 0) {
        setTimeout(function() {
          this.map.setView(location, zoom, {animate: MapStore.getLoaded(MapSetting.sTreeMapId)});
          // if (!MapStore.getLoaded(MapSetting.sTreeMapId))
          //   MapActions.setLoaded.defer(MapSetting.sTreeMapId, true);
        }.bind(this), 250);
      }
    }
  }
  renderMarkers(trees, selected) {
    if (__DEV__) {
      console.log(`Map Tree - renderMarkers() with ${trees.length} trees`);
    }
    var markers = this.markersLayer.getLayers();
    //this.markersLayer._featureGroup._layers
    //this.focusLayer._layers

    // Remove unnecessary markers.
    for (let i = 0; i < markers.length;) {
      let bFound = false;
      // trees.forEach((tree) => {
      //   if (tree.id == markers[i].options.id && tree.food == markers[i].options.food && markers[i].getLatLng().lat == tree.lat && markers[i].getLatLng().lng == tree.lng) {
      //     bFound = true;
      //   }
      // });
      if (markers[i].options.type == "svg" && markers[i].options.id == selected) {
        bFound = true;
      }
      if (markers[i].options.type == "canvas") {
        bFound = false;
      }
      if (!bFound) {
        this.removeMarker(markers[i], this.markersLayer);
        markers = _.without(markers, markers[i]);
        i--;
      }
      i++;
    }

    // Add new markers.
    trees.forEach((tree) => {
      let bFound = false;
      for (let i = 0; i < markers.length && !bFound; i++) {
        if (tree.id == markers[i].options.id) {
          bFound = true;
        }
      }
      if (tree.id != 0 && !bFound) {
        this.addMarker(tree, selected, false);
      }
    });
  }
  addMarker(tree, selected, editable) {
    let marker;
    if (editable) {
      marker = createSVGTreeMarker(tree, true);
      marker.openPopup();
    } else {
      if (selected == tree.id) {
        marker = createSVGTreeMarker(tree, false);
      } else {
        marker = createCanvasTreeMarker(tree);
      }
    }
    if (marker) {
      this.markersLayer.addLayer(marker);
    }
    return marker;
  }
  removeMarker(marker, layer) {
    marker.off('click');
    layer.removeLayer(marker);
  }
  render () {
    return (
      <div></div>
    );
  }
}
