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
let LocationActions = require('./../actions/location.actions');
let LocationStore = require('./../stores/location.store');

import { MAPTILE, MAPTYPE } from './../utils/enum';
import { createFocusMarkerLocation, createSVGLocationMarker } from './../utils/marker.factory';


export default class MapRecipient extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.afterRenderMap = this.afterRenderMap.bind(this);
  }
  componentWillMount() {

  }
  componentDidMount () {
    // Intialize leaflet only if not initialized.
    if (!MapStore.isMapExist(MapSetting.sRecipeintMapId)) {
      this.map = L.map(MapSetting.sRecipeintMapId, {
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
      this.map = MapStore.getMapModel(MapSetting.sRecipeintMapId).map;
      this.flatTileLayer = MapStore.getMapModel(MapSetting.sRecipeintMapId).flatTileLayer;
      this.satTileLayer = MapStore.getMapModel(MapSetting.sRecipeintMapId).satTileLayer;
      this.focusLayer = MapStore.getMapModel(MapSetting.sRecipeintMapId).focusLayer;
      this.markersLayer = MapStore.getMapModel(MapSetting.sRecipeintMapId).markersLayer;
    }
    this.updateProps(this.props);
    this.map.closePopup();
  }

  afterRenderMap() {
    // Register map to Flux structure to synchronize React and Leaflet together.
    MapActions.addMap(MapSetting.sRecipeintMapId, this.map, MAPTYPE.DONATION);
    // Define tile maps and store into the MapModel.
    if (!MapStore.getMapModel(MapSetting.sRecipeintMapId).flatTileLayer) {
      MapStore.getMapModel(MapSetting.sRecipeintMapId).flatTileLayer = this.flatTileLayer = L.tileLayer(MapSetting.uGrayTileMap + MapSetting.sMapboxAccessToken, {
          minZoom: MapSetting.iMinZoom,
          maxZoom: MapSetting.iMaxZoom,
      });
    }
    if (!MapStore.getMapModel(MapSetting.sRecipeintMapId).satTileLayer) {
      // Optional tile map address (Mapbox).
      // MapStore.getMapModel(MapSetting.sRecipeintMapId).satTileLayer = this.satTileLayer = L.tileLayer(MapSetting.uSatTileMap + MapSetting.sMapboxAccessToken, {
      //     minZoom: MapSetting.iMinZoom,
      //     maxZoom: MapSetting.iMaxZoom,
      // });
      MapStore.getMapModel(MapSetting.sRecipeintMapId).satTileLayer = this.satTileLayer = new L.Google(MapSetting.sGoogleMapTileType, {
        minZoom: MapSetting.iMinZoom,
        maxZoom: MapSetting.iMaxZoom,
      });
    }
    // Add a layer to show the focused area.
    if (!MapStore.getMapModel(MapSetting.sRecipeintMapId).focusLayer) {
      MapStore.getMapModel(MapSetting.sRecipeintMapId).focusLayer = this.focusLayer = L.layerGroup();
      this.focusLayer.addTo(this.map);
    }
    // Add a layer for rendering actual markers.
    if (!MapStore.getMapModel(MapSetting.sRecipeintMapId).markersLayer) {
      // Code Snipet for MarkerClusterGroup
      // MapStore.getMapModel(MapSetting.sRecipeintMapId).markersLayer = this.markersLayer = new L.MarkerClusterGroup();
      // this.markersLayer.initialize({
      //   spiderfyOnMaxZoom: MapSetting.bSpiderfyOnMaxZoom,
      //   showCoverageOnHover: MapSetting.bShowCoverageOnHover,
      //   zoomToBoundsOnClick: MapSetting.bZoomToBoundsOnClick,
      //   removeOutsideVisibleBounds: MapSetting.bRemoveOutsideVisibleBounds,
      //   maxClusterRadius: MapSetting.iMaxClusterRadius,
      //   disableClusteringAtZoom: MapSetting.iDisableClusteringAtZoom
      // });
      MapStore.getMapModel(MapSetting.sRecipeintMapId).markersLayer = this.markersLayer = new L.layerGroup();
      this.markersLayer.addTo(this.map);
    }
    // Add leaflet map event listeners.
  }
  renderMapTile() {
    // Choose the right map tile
    if (MapStore.getMapTile(MapSetting.sRecipeintMapId) == MAPTILE.FLAT) {
      if (!this.map.hasLayer(this.flatTileLayer)) {
        this.flatTileLayer.addTo(this.map);
        this.map.removeLayer(this.satTileLayer);
      }
    } else if (MapStore.getMapTile(MapSetting.sRecipeintMapId) == MAPTILE.SATELLITE) {
      if (!this.map.hasLayer(this.satTileLayer)) {
        this.map.addLayer(this.satTileLayer);
        this.map.removeLayer(this.flatTileLayer);
      }
    }
  }
  renderFocusMarker(position) {
    if (position) {
      if (this.focusLayer.getLayers().length == 0) {
        let marker = createFocusMarkerLocation(position);
        this.focusLayer.addLayer(marker);
      } else {
        this.focusLayer.getLayers()[0].setLatLng(position);
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
    if (nextProps.selected != this.props.selected) {
      this.renderPopup(LocationStore.getLocation(nextProps.selected));
    }
  }
  componentWillUnmount() {

  }
  updateProps(props) {
    this.renderMapTile();
    if (this.props.position && props.position != null && this.props.position.lat != props.position.lat && this.props.position.lng != props.position.lng) {
      this.renderFocusMarker(props.position);
    }
    let temp = LocationStore.getState().temp;
    if (LocationStore.getState().code == 200 && (props.selected == null || props.selected != this.props.selected)) {
      this.renderMarkers(props.locations, props.selected);
    } else if (LocationStore.getState().code == 200 && temp && (temp.editing != null || !temp.editing)) {
      this.renderActiveMarker(temp);
      if (LocationStore.getState().code == 200 && temp && temp.id == 0) {
        this.renderMarkers(props.locations, props.selected);
      }
    }
  }
  renderPopup(location) {
    if (location != null) {
      let markers = this.markersLayer.getLayers();
      let bFound = false;
      let i = 0;
      for (; i < markers.length && !bFound; i++) {
        if (markers[i].options.id == location.id) {
          bFound = true;
          markers[i].openPopup();
          let zoom = Math.max(this.map.getZoom(), MapSetting.iFocusZoom);
          // Move the map slight off from the center using CRS projection
          let point: L.Point = L.CRS.EPSG3857.latLngToPoint(new L.LatLng(location.lat, location.lng), zoom);
          let rMap = document.getElementById(MapSetting.sRecipeintMapId);
          if (rMap.clientWidth > rMap.clientHeight) {
            point.x += this.map.getSize().x * 0.15;
          } else {
            //point.y += this.map.getSize().y * 0.15;
          }
          let position: L.LatLng = L.CRS.EPSG3857.pointToLatLng(point, zoom);
          setTimeout(function() {
            this.map.setView(position, zoom, {animate: MapStore.getLoaded(MapSetting.sRecipeintMapId)});
            MapActions.setLoaded.defer(MapSetting.sRecipeintMapId, true);
          }.bind(this), 250);
        }
      }
    }
  }
  renderActiveMarker(location) {  // location in this case = LocationStore.getState().temp
    var markers = this.markersLayer.getLayers();
    let bFound = false;
    for (let i = 0; i < markers.length && !bFound; i++) {
      if (location.editing) {
        if (location && markers[i].options.id == location.id) {
        // if (location && markers[i].options.id == location.id) {
          this.removeMarker(markers[i], this.markersLayer);
          markers = _.without(markers, markers[i]);
          bFound = true;
        }
      } else {
        if (location && markers[i].options.id == location.id && markers[i].options.draggable == true) {
        // if (location && markers[i].options.id == location.id) {
          this.removeMarker(markers[i], this.markersLayer);
          markers = _.without(markers, markers[i]);
          bFound = true;
        }
      }
    }
    if (!bFound && location.id == 0) {
      bFound = true;
    }
    if (bFound) {
      let marker = this.addMarker(location, location.id, location.editing);
      location.marker = marker;
      marker.openPopup();

      let zoom = Math.max(this.map.getZoom(), MapSetting.iFocusZoom);
      // Move the map slight off from the center using CRS projection
      let point: L.Point = L.CRS.EPSG3857.latLngToPoint(new L.LatLng(location.lat, location.lng), zoom);
      let rMap = document.getElementById(MapSetting.sRecipeintMapId);
      if (rMap.clientWidth > rMap.clientHeight) {
        point.x += this.map.getSize().x * 0.15;
      } else {
        //point.y += this.map.getSize().y * 0.15;
      }
      let position = L.CRS.EPSG3857.pointToLatLng(point, zoom);
      if (location.id != 0) {
        setTimeout(function() {
          this.map.setView(position, zoom, {animate: MapStore.getLoaded(MapSetting.sRecipeintMapId)});
          // if (!MapStore.getLoaded(MapSetting.sRecipeintMapId))
          //   MapActions.setLoaded.defer(MapSetting.sRecipeintMapId, true);
        }.bind(this), 250);
      }
    }
  }
  renderMarkers(locations, selected) {
    if (__DEV__) {
      console.log(`map-location.component - renderMarkers() with ${locations.length} locations`);
    }
    var markers = this.markersLayer.getLayers();
    //this.markersLayer._featureGroup._layers
    //this.focusLayer._layers

    // Remove unnecessary markers.
    for (let i = 0; i < markers.length;) {
      let bFound = false;
      locations.forEach((location) => {
        if (location.id == markers[i].options.id && markers[i].getLatLng().lat == location.lat && markers[i].getLatLng().lng == location.lng) {
          bFound = true;
        }
      });
      if (markers[i].options.type == "svg" && markers[i].options.id == selected) {
        bFound = true;
      }
      // if (markers[i].options.type == "canvas") {
      //   bFound = false;
      // }
      if (!bFound) {
        this.removeMarker(markers[i], this.markersLayer);
        markers = _.without(markers, markers[i]);
        i--;
      }
      i++;
    }

    // Add new markers.
    locations.forEach((location) => {
      let bFound = false;
      for (let i = 0; i < markers.length && !bFound; i++) {
        if (location.id == markers[i].options.id) {
          bFound = true;
        }
      }
      if (location.id != 0 && !bFound) {
        this.addMarker(location, selected, false);
      }
    });
  }
  addMarker(location, selected, editable) {
    let marker;
    if (editable) {
      marker = createSVGLocationMarker(location, true);
      marker.openPopup();
    } else {
      marker = createSVGLocationMarker(location, false);
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
