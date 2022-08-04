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
import { createSVGTreeMarker } from './../utils/marker.factory';


export default class MapTree extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.afterRenderMap = this.afterRenderMap.bind(this);
  }
  componentWillMount() {

  }
  componentDidMount () {
    // Intialize leaflet only if not initialized.
    if (!MapStore.isMapExist(MapSetting.sMapId)) {
      this.map = L.map(MapSetting.sMapId, {
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
      this.map = MapStore.getMapModel(MapSetting.sMapId).map;
      this.satTileLayer = MapStore.getMapModel(MapSetting.sMapId).satTileLayer;
      this.markersLayer = MapStore.getMapModel(MapSetting.sMapId).markersLayer;
    }
    // this.updateProps(this.props);
  }

  afterRenderMap() {
    // Register map to Flux structure to synchronize React and Leaflet together.
    MapActions.addMap(MapSetting.sMapId, this.map, MAPTYPE.TREE);
    if (!MapStore.getMapModel(MapSetting.sMapId).satTileLayer) {
      // Optional tile map address (Mapbox).
      // MapStore.getMapModel(MapSetting.sMapId).satTileLayer = this.satTileLayer = L.tileLayer(MapSetting.uSatTileMap + MapSetting.sMapboxAccessToken, {
      //    minZoom: MapSetting.iMinZoom,
      //    maxZoom: MapSetting.iMaxZoom,
      // });
      MapStore.getMapModel(MapSetting.sMapId).satTileLayer = this.satTileLayer = new L.Google(MapSetting.sGoogleMapTileType, {
        minZoom: MapSetting.iMinZoom,
        maxZoom: MapSetting.iMaxZoom,
      });
    }
    // Add a layer for rendering actual markers.
    if (!MapStore.getMapModel(MapSetting.sMapId).markersLayer) {
      MapStore.getMapModel(MapSetting.sMapId).markersLayer = this.markersLayer = new L.layerGroup();
      this.markersLayer.addTo(this.map);
    }
    // Add leaflet map event listeners.
  }
  renderMapTile() {
    // Choose the right map tile
    if (!this.map.hasLayer(this.satTileLayer)) {
      this.map.addLayer(this.satTileLayer);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
    // this.renderPopup(nextProps.tree);
  }
  componentWillUnmount() {

  }
  updateProps(props) {
    this.renderMapTile();
    if (props.tree) {
      this.renderActiveMarker(props.tree);
    }
  }
  renderActiveMarker(tree) {  // tree in this case = TreeStore.getState().temp
    let marker = this.addMarker(tree, tree.id, false);
    marker.openPopup();
    if (tree.id != 0) {
      setTimeout(function() {
        this.map.setView(new L.LatLng(tree.lat, tree.lng), MapSetting.iFocusZoom, {animate: MapStore.getLoaded(MapSetting.sMapId)});
      }.bind(this), 250);
    }
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
