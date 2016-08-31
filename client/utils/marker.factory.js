import { browserHistory } from 'react-router';
import * as L from 'leaflet';
import $ from 'jquery';
import './marker.factory.scss';
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');
let MapActions = require('./../actions/map.actions');
let TreeActions = require('./../actions/tree.actions');
let LocationActions = require('./../actions/location.actions');

let FoodStore = require('./../stores/food.store');
let FlagStore = require('./../stores/flag.store');
let DonateStore = require('./../stores/donate.store');
let DonateActions = require('./../actions/donate.actions');
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
import { localization } from './../utils/localization';

let isMarkerEventActivated = false;
let isMarkerEventActivatedResetTimer;

export function createFocusMarker(location) {
  // Create marker icon.
  let icon = new L.Icon({
    iconUrl: ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uPinIcon,
    iconSize: new L.Point(32, 32),
    iconAnchor: new L.Point(16, 32),
    shadowUrl: ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uShadowMarker,
    shadowAnchor: new L.Point(11, 32),
  });
  // Create marker.
  let marker = new L.Marker(location, {
    icon: icon,
    type: "svg",
    draggable: false
  });
  // Add zoom-in event listener
  marker.on('dblclick', function() {
    MapActions.moveToLocationWithMarker(MapSetting.sMapId, location, MapSetting.iFocusZoom);
  });
  return marker;
}

export function createCanvasTreeMarker(tree) {
  let image;
  if (tree.id == -1) {  // For Doghead farm.
    image = FoodStore.getState().farmImage;
  } else {
    let food = FoodStore.getFood(tree.food);
    if (food != null) {
      image = food.image;
    } else {
      image = FoodStore.getState().tempImage;
    }
  }
  let marker = new L.CanvasMarker(
    new L.LatLng(tree.lat, tree.lng), 5, {
      id: tree.id,
      food: tree.food,
      type: "canvas",
      image: image,
      shadow: FoodStore.getState().shadowImage
    });
  marker.on('click', function() {
    if (!isMarkerEventActivated) {
      isMarkerEventActivated = true;
      isMarkerEventActivatedResetTimer = setTimeout(function() {
        isMarkerEventActivated = false;
      }, 500);
      TreeActions.setCode(0);
      browserHistory.push({pathname: ServerSetting.uBase + '/tree/' + tree.id});
    }
  });
  return marker;
}

export function createSVGTreeMarker(tree, movable) {
  let classname = "leaflet-marker-tree ";
  let image, template;
  if (tree.id == -1) {  // For Doghead farm.
    image = ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uFarmMarkerIcon;
    template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + localization(48) + '</span></div><div class="marker-right"></div>';
  } else {
    let food = FoodStore.getFood(tree.food);
    if (food) {
      image = ServerSetting.uBase + ServerSetting.uStaticImage + food.icon;
      template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + food.name + '</span>#<span class="marker-tree">' + tree.id + '</span></div><div class="marker-right"></div>';
    } else {
      image = ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uTemporaryMarkerIcon;
      template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + localization(692) + '</span></div><div class="marker-right"></div>';
    }
  }

  let icon = new L.divIcon({
    popupAnchor: new L.Point(-1, -30),
    className: classname,
    html: '<img class="shadow" src="' + ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uShadowMarker + '"/><img class="icon" src="' + image + '" />'
  });
  let marker = new L.Marker(new L.LatLng(tree.lat, tree.lng), {
    id: tree.id,
    food: tree.food,
    type: "svg",
    icon: icon,
    draggable: movable,
    riseOnHover: true,
  }).bindPopup(template, {
    autoPan: false,
    closeButton: false,
    closeOnClick: false,
  });
  marker.on('click', function() {
    if (tree.id > 0) {
      browserHistory.push({pathname: ServerSetting.uBase + '/tree/' + tree.id});
    }
  });
  // Add zoom-in event listener
  marker.on('dblclick', function() {
    MapActions.moveToLocation(MapSetting.sMapId, new L.LatLng(tree.lat, tree.lng), MapSetting.iFocusZoom);
  });
  if (movable) {
    marker.on('dragend', function() {
      tree.lat = parseFloat(parseFloat(marker.getLatLng().lat).toFixed(MapSetting.iMarkerPrecision));
      tree.lng = parseFloat(parseFloat(marker.getLatLng().lng).toFixed(MapSetting.iMarkerPrecision));
      TreeActions.setCode(94);  // 94: Unsaved change.
      marker.openPopup();
    });
  }
  return marker;
}

export function createSVGLocationMarker(location, movable) {
  let image, template;
  image = ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uRecipientMarkerIcon;
  let classname = "leaflet-marker-location ";
  let icon = new L.divIcon({
    popupAnchor: new L.Point(-1, -30),
    className: classname,
    html: '<img class="icon" src="' + image + '" />'
  });
  if (location.id != 0) {
    template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + location.name + '</span></div><div class="marker-right"></div>';
  } else {
    template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + localization(693) + '</span></div><div class="marker-right"></div>';
  }

  let marker = new L.Marker(new L.LatLng(location.lat, location.lng), {
    id: location.id,
    type: "svg",
    icon: icon,
    draggable: movable,
    riseOnHover: true,
  }).bindPopup(template, {
    autoPan: false,
    closeButton: false,
    closeOnClick: false,
  });
  // Add zoom-in event listener
  marker.on('dblclick', function() {
    MapActions.moveToLocation(MapSetting.sMapId, new L.LatLng(location.lat, location.lng), MapSetting.iFocusZoom);
  });

  if (movable) {
    marker.on('dragend', function() {
      location.lat = parseFloat(parseFloat(marker.getLatLng().lat).toFixed(MapSetting.iMarkerPrecision));
      location.lng = parseFloat(parseFloat(marker.getLatLng().lng).toFixed(MapSetting.iMarkerPrecision));
      LocationActions.setCode(94);  // 94: Unsaved change.
      marker.openPopup();
    });
  }
  marker.on('click', function() {
    browserHistory.push({pathname: ServerSetting.uBase + '/recipient/' + location.id});
  });
  return marker;
}

export function createCanvasTreeSourceMarker(tree) {
  let checkImage, marker, image;
    if (tree.checked) {
      checkImage = FoodStore.getState().checkImage;
    }
  if (tree.id == -1) {  // Doghead farm doesn't need to be rendered as a source tree.
    return null;
  } else {
    let food = FoodStore.getFood(tree.food);
    if (food) {
      image = food.image;
    } else {
      image = FoodStore.getState().tempImage;
    }
  }
  marker = new L.CanvasMarker(
    new L.LatLng(tree.lat, tree.lng), 5, {
      id: tree.id,
      food: tree.food,
      type: "canvas",
      image: image,
      shadow: FoodStore.getState().shadowImage,
      checkMode: true,
      checked: checkImage,
    });
  marker.on('click', function() {
    if (DonateStore.getState().temp && DonateStore.getState().temp.editing) {
      // Click event for adding a tree item as a source of the current donation.
      if (tree.checked) {
        tree.checked = false;
      } else {
        tree.checked = true;
      }
      TreeActions.setCode(200);
      DonateStore.getState().temp.addSource(tree.id);
      DonateActions.setCode(94);
    }
  });
  return marker;
}
