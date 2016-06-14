import { browserHistory } from 'react-router';

import * as L from 'leaflet';
import './marker.factory.css';
var Settings = require('./../constraints/settings.json');

import { FoodModel } from './../stores/food.store';
import { treeStore, TreeModel } from './../stores/tree.store';
import { treeActions } from './../actions/tree.actions';
import { flagStore, FlagModel } from './../stores/flag.store';
import { LocationModel } from './../stores/location.store';
import { locationActions } from './../actions/location.actions';
import { donateActions } from './../actions/donate.actions';

import { localization } from './../constraints/localization';

module MarkerFactory {
  export function createEditableMarker(food: FoodModel, tree: TreeModel): L.Marker {
    let icon: L.Icon = new L.Icon({
      iconUrl: Settings.uBaseName + Settings.uStaticImage + food.getIcon(),
      iconSize: new L.Point(40, 40),
      iconAnchor: new L.Point(20, 40),
      popupAnchor: new L.Point(1, -36),
    });

    let marker: L.Marker = new L.Marker(new L.LatLng(tree.getLat(), tree.getLng()), {
      id: tree.getId(),
      food: tree.getFoodId(),
      selected: false,
      icon: icon,
      draggable: true,
      riseOnHover: true,
    });
    marker.on('click', function() {
      browserHistory.push({pathname: Settings.uBaseName + '/tree/' + tree.getId()});
    });
    return marker;
  }

  export function createUneditableMarker(food: FoodModel, tree: TreeModel): L.Marker {
    let classname: string = "";
    tree.getFlags().forEach((flagId: number) => {
      let flag: FlagModel = flagStore.getFlag(flagId);
      if (flag) {
        classname = flag.getClassName() + " ";
      }
    });

    let icon: L.Icon = new L.Icon({
      iconUrl: Settings.uBaseName + Settings.uStaticImage + food.getIcon(),
      iconSize: new L.Point(40, 40),
      iconAnchor: new L.Point(20, 40),
      popupAnchor: new L.Point(1, -36),
      className: classname,
    });

    let template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + food.getName() + '</span>#<span class="marker-tree">' + tree.getId() + '</span></div><div class="marker-right"></div>';

    let marker: L.Marker = new L.Marker(new L.LatLng(tree.getLat(), tree.getLng()), {
      id: tree.getId(),
      food: tree.getFoodId(),
      selected: false,
      icon: icon,
      draggable: false,
      riseOnHover: true,
    }).bindPopup(template, {
      closeButton: false,
      closeOnClick: false,
    });
    marker.on('click', function() {
      browserHistory.push({pathname: Settings.uBaseName + '/tree/' + tree.getId()});
    });
    return marker;
  }

  export function createTemporaryMarker(tree: TreeModel): L.Marker {
    let icon: L.Icon = new L.Icon({
      iconUrl: Settings.uBaseName + Settings.uStaticImage + Settings.uTemporaryMarkerIcon,
      iconSize: new L.Point(40, 40),
      iconAnchor: new L.Point(20, 40),
      popupAnchor: new L.Point(1, -36),
    });

    let template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + localization(692) + '</span></div><div class="marker-right"></div>';

    let marker: L.Marker = new L.Marker(new L.LatLng(tree.getLat(), tree.getLng()), {
      id: tree.getId(),
      food: tree.getFoodId(),
      selected: false,
      icon: icon,
      draggable: true,
      riseOnHover: true,
    }).bindPopup(template, {
      closeButton: false,
      closeOnClick: false,
    });

    marker.on('dragend', function() {
      tree.setLat(marker.getLatLng().lat);
      tree.setLng(marker.getLatLng().lng);
      setTimeout(function() {
        treeActions.refresh();
      }, 0);
      marker.openPopup();
    });
    return marker;
  }


  export function createTemporaryLocationMarker(location: LocationModel): L.Marker {
    let icon: L.Icon = new L.Icon({
      iconUrl: Settings.uBaseName + Settings.uStaticImage + Settings.uTemporaryLocationMarkerIcon,
      iconSize: new L.Point(40, 40),
      iconAnchor: new L.Point(20, 40),
      popupAnchor: new L.Point(1, -36),
    });

    let template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + localization(693) + '</span></div><div class="marker-right"></div>';

    let marker: L.Marker = new L.Marker(new L.LatLng(location.getLat(), location.getLng()), {
      id: location.getId(),
      selected: false,
      icon: icon,
      draggable: true,
      riseOnHover: true,
    }).bindPopup(template, {
      closeButton: false,
      closeOnClick: false,
    });
    marker.on('dragend', function() {
      location.setLat(marker.getLatLng().lat);
      location.setLng(marker.getLatLng().lng);
      setTimeout(function() {
        locationActions.refresh();
      }, 0);
      marker.openPopup();
    });
    return marker;
  }
  export function createUneditableLocationMarker(location: LocationModel): L.Marker {
    let icon: L.Icon = new L.Icon({
      iconUrl: Settings.uBaseName + Settings.uStaticImage + Settings.uTemporaryLocationMarkerIcon,
      iconSize: new L.Point(40, 40),
      iconAnchor: new L.Point(20, 40),
      popupAnchor: new L.Point(1, -36),
    });
    let template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">#' + location.getId() + '</span>&nbsp;<span class="marker-tree">' + location.getName() + '</span></div><div class="marker-right"></div>';

    let marker: L.Marker = new L.Marker(new L.LatLng(location.getLat(), location.getLng()), {
      id: location.getId(),
      name: location.getName(),
      selected: false,
      icon: icon,
      draggable: false,
      riseOnHover: true,
    }).bindPopup(template, {
      closeButton: false,
      closeOnClick: false,
    });
    marker.on('click', function() {
      browserHistory.push({pathname: Settings.uBaseName + '/donation/' + location.getId()});
    });
    return marker;
  }

  export function createTreeSelectMarker(donateId: number, food: FoodModel, tree: TreeModel): L.Marker {
    let icon: L.Icon = new L.Icon({
      iconUrl: Settings.uBaseName + Settings.uStaticImage + food.getIcon(),
      iconSize: new L.Point(40, 40),
      iconAnchor: new L.Point(20, 40),
      popupAnchor: new L.Point(1, -36),
    });

    let template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">' + food.getName() + '</span>#<span class="marker-tree">' + tree.getId() + '</span></div><div class="marker-right"></div>';

    let marker: L.Marker = new L.Marker(new L.LatLng(tree.getLat(), tree.getLng()), {
      id: tree.getId(),
      selected: false,
      icon: icon,
      draggable: false,
      riseOnHover: true,
    });
    marker.on('click', function() {
      if (donateId) {
        donateActions.addDonateSource(donateId, tree.getId());
      } else {
        donateActions.addTempDonateSource(tree.getId());
      }
    });
    return marker;
  }
}

export default MarkerFactory;
