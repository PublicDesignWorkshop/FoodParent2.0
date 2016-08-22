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
    MapActions.moveToLocationWithMarker(MapSetting.sTreeMapId, location, MapSetting.iFocusZoom);
  });
  return marker;
}

export function createFocusMarkerLocation(location) {
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
    MapActions.moveToLocationWithMarker(MapSetting.sRecipeintMapId, location, MapSetting.iFocusZoom);
  });
  return marker;
}

export function createCanvasTreeMarker(tree) {
  let food = FoodStore.getFood(tree.food);
  if (food != null) {
    let flags = FlagStore.getState().flags;
    let bFound = false;
    let image;
    for (let i = 0; i < flags.length && !bFound; i++) {
      if ($.inArray(flags[i].id, tree.flags) > -1) {
        image = food.images[flags[i].name];
        bFound = true;
      }
    }
    if (image == null) {
      image = food.images['verified'];
    }

    // let popup = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + food.name + '</span>#<span class="marker-tree">' + tree.id + '</span></div><div class="marker-right"></div>';
    let marker = new L.CanvasMarker(
      new L.LatLng(tree.lat, tree.lng), 5, {
        id: tree.id,
        food: tree.food,
        type: "canvas",
        image: image,
        shadow: FoodStore.getState().shadowImage
      });
    //   .bindPopup(popup, {
    //   popupAnchor: new L.Point(0, -18),
    //   closeButton: false,
    //   closeOnClick: false,
    // });
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
  return null;
}

export function createSVGTreeMarker(tree, movable) {
  let iconUrl;
  let food = FoodStore.getFood(tree.food);
  let classname = "leaflet-marker-tree ";
  if (food != null) {
    tree.flags.forEach((id: number) => {
      let flag = FlagStore.getFlag(id);
      if (flag) {
        classname += flag.classname + " ";
      }
    });

    let flags = FlagStore.getState().flags;
    let bFound = false;

    for (let i = 0; i < flags.length && !bFound; i++) {
      if ($.inArray(flags[i].id, tree.flags) > -1) {
        iconUrl = food.icons[flags[i].name];
        bFound = true;
      }
    }
    if (iconUrl == null) {
      iconUrl = food.icons['verified'];
    }
  } else {  // For new tree item which has food id = 0.
    iconUrl = ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uTemporaryMarkerIcon;
  }
  let icon = new L.divIcon({
    iconUrl: iconUrl,
    iconSize: new L.Point(20, 32),
    iconAnchor: new L.Point(10, 32),
    popupAnchor: new L.Point(-1, -30),
    shadowUrl: ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uShadowMarker,
    shadowAnchor: new L.Point(4, 32),
    className: classname,
    html: '<img class="shadow" src="' + ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uShadowMarker + '"/><img class="icon" src="' + iconUrl + '" />'
  });
  let template;
  if (food && tree.id != 0) {
    template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + food.name + '</span>#<span class="marker-tree">' + tree.id + '</span></div><div class="marker-right"></div>';
  } else {
    template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + localization(692) + '</span></div><div class="marker-right"></div>';
  }


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
  // Add zoom-in event listener
  marker.on('dblclick', function() {
    MapActions.moveToLocation(MapSetting.sTreeMapId, new L.LatLng(tree.lat, tree.lng), MapSetting.iFocusZoom);
  });

  if (movable) {
    marker.on('dragend', function() {
      tree.lat = parseFloat(parseFloat(marker.getLatLng().lat).toFixed(MapSetting.iMarkerPrecision));
      tree.lng = parseFloat(parseFloat(marker.getLatLng().lng).toFixed(MapSetting.iMarkerPrecision));
      TreeActions.setCode(94);  // 94: Unsaved change.
      marker.openPopup();
    });
  }
  // marker.on('click', function() {
  //   console.log(ServerSetting.uBase + '/tree/' + tree.id);
  //   browserHistory.push({pathname: ServerSetting.uBase + '/tree/' + tree.id});
  // });
  return marker;
}


export function createSVGLocationMarker(location, movable) {
  let iconUrl = ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uRecipientMarkerIcon;
  let classname = "leaflet-marker-location ";
  let icon = new L.divIcon({
    iconUrl: iconUrl,
    iconSize: new L.Point(32, 32),
    iconAnchor: new L.Point(16, 32),
    popupAnchor: new L.Point(-1, -30),
    shadowUrl: ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uShadowMarker,
    shadowAnchor: new L.Point(4, 32),
    className: classname,
    html: '<img class="icon" src="' + iconUrl + '" />'
  });
  let template;
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
    MapActions.moveToLocation(MapSetting.sRecipeintMapId, new L.LatLng(location.lat, location.lng), MapSetting.iFocusZoom);
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
