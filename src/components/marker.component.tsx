import * as L from 'leaflet';
import { browserHistory } from 'react-router';

import './marker.component.css';
var Settings = require('./../constraints/settings.json');
import { FoodModel } from './../stores/food.store';
import { treeStore, TreeModel } from './../stores/tree.store';
import { locationStore, LocationModel } from './../stores/location.store';
import { treeActions } from './../actions/tree.actions';
import { donateActions } from './../actions/donate.actions';
import { locationActions } from './../actions/location.actions';

module MarkerComponent {
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
      //self.context.router.push({pathname: Settings.uBaseName + '/trees/' + self.selected.options.id});
    });
    return marker;
  }

  export function createUneditableMarker(food: FoodModel, tree: TreeModel): L.Marker {
    let icon: L.Icon = new L.Icon({
      iconUrl: Settings.uBaseName + Settings.uStaticImage + food.getIcon(),
      iconSize: new L.Point(40, 40),
      iconAnchor: new L.Point(20, 40),
      popupAnchor: new L.Point(1, -36),
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

    let template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">New&nbsp;Tree</span></div><div class="marker-right"></div>';

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
    marker.on('click', function() {
      // marker.openPopup();
      //browserHistory.push({pathname: Settings.uBaseName + '/trees/' + tree.getId()});
    });
    marker.on('dragend', function() {
      tree.setLat(marker.getLatLng().lat);
      tree.setLng(marker.getLatLng().lng);
      setTimeout(function() {
        treeActions.refresh();
      }, 0);
      marker.openPopup();
      // let tree: TreeModel = treeStore.getTree(marker.options.id);
      // if (tree) {
      //   tree.setLat(marker.getLatLng().lat);
      //   tree.setLng(marker.getLatLng().lng);
      //   browserHistory.replace({pathname: Settings.uBaseName + '/tree/add', query: { mode: "marker" }});
      // }
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

    let template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">New&nbsp;Location</span></div><div class="marker-right"></div>';

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
    marker.on('click', function() {
      // marker.openPopup();
      //browserHistory.push({pathname: Settings.uBaseName + '/trees/' + tree.getId()});
    });
    marker.on('dragend', function() {
      location.setLat(marker.getLatLng().lat);
      location.setLng(marker.getLatLng().lng);
      setTimeout(function() {
        locationActions.refresh();
      }, 0);
      marker.openPopup();
      // let tree: TreeModel = treeStore.getTree(marker.options.id);
      // if (tree) {
      //   tree.setLat(marker.getLatLng().lat);
      //   tree.setLng(marker.getLatLng().lng);
      //   browserHistory.replace({pathname: Settings.uBaseName + '/tree/add', query: { mode: "marker" }});
      // }
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
      // browserHistory.push({pathname: Settings.uBaseName + '/tree/' + tree.getId()});
    });
    return marker;
  }
}

export default MarkerComponent;
