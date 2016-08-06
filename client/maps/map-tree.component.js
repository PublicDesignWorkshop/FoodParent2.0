import React from 'react';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'googletile';

require('./maps.component.scss');
let MapSetting = require('./../../setting/map.json');
let MapActions = require('./../actions/map.actions');
let MapStore = require('./../stores/map.store');
import { MAPTILE, MAPTYPE } from './../utils/enum';
import { createFocusMarker } from './../utils/marker.factory';
import { updateSeason } from './../utils/season';


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
      this.map = MapStore.getMapModel(MapSetting.sTreeMapId).map;
      this.flatTileLayer = MapStore.getMapModel(MapSetting.sTreeMapId).flatTileLayer;
      this.satTileLayer = MapStore.getMapModel(MapSetting.sTreeMapId).satTileLayer;
      this.focusLayer = MapStore.getMapModel(MapSetting.sTreeMapId).focusLayer;
      this.markersLayer = MapStore.getMapModel(MapSetting.sTreeMapId).markersLayer;
    }
    this.renderMapTile();
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
      MapStore.getMapModel(MapSetting.sTreeMapId).markersLayer = this.markersLayer = new L.MarkerClusterGroup();
      this.markersLayer.initialize({
        spiderfyOnMaxZoom: MapSetting.bSpiderfyOnMaxZoom,
        showCoverageOnHover: MapSetting.bShowCoverageOnHover,
        zoomToBoundsOnClick: MapSetting.bZoomToBoundsOnClick,
        removeOutsideVisibleBounds: MapSetting.bRemoveOutsideVisibleBounds,
        maxClusterRadius: MapSetting.iMaxClusterRadius,
        disableClusteringAtZoom: MapSetting.iDisableClusteringAtZoom
      });
      this.markersLayer.addTo(this.map);
    }
    // Update season trees
    updateSeason(function(success) {

    }, function(fail) {

    })
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
    this.renderMapTile();
    if (this.props.location && nextProps.location != null && this.props.location.lat != nextProps.location.lat && this.props.location.lng != nextProps.location.lng) {
      this.renderFocusMarker(nextProps.location);
    }
  }
  componentWillUnmount() {

  }
  render () {
    return (
      <div></div>
    );
  }
}
