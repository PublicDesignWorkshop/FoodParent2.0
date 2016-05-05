import * as L from 'leaflet';
import { browserHistory } from 'react-router';

import './marker.component.css';
var Settings = require('./../constraints/settings.json');
import { TreeModel } from './../stores/tree.store';
import { FoodModel } from './../stores/food.store';

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
      selected: false,
      icon: icon,
      draggable: true,
      riseOnHover: true,
    });
    marker.on('click', function() {
      browserHistory.push({pathname: Settings.uBaseName + '/trees/' + tree.getId()});
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
      selected: false,
      icon: icon,
      draggable: false,
      riseOnHover: true,
    }).bindPopup(template, {
      closeButton: false,
      closeOnClick: false,
    });
    marker.on('click', function() {
      browserHistory.push({pathname: Settings.uBaseName + '/trees/' + tree.getId()});
    });
    return marker;
  }

  export function createTemporaryMarker(position: L.LatLng): L.Marker {
    let icon: L.Icon = new L.Icon({
      iconUrl: Settings.uBaseName + Settings.uStaticImage + Settings.uTemporaryMarkerIcon,
      iconSize: new L.Point(40, 40),
      iconAnchor: new L.Point(20, 40),
      popupAnchor: new L.Point(1, -36),
    });

    let template = '<div class="marker-left"></div><div class="marker-name"><span class="marker-food">New&nbsp;Tree</span></div><div class="marker-right"></div>';

    let marker: L.Marker = new L.Marker(position, {
      id: 0,
      selected: false,
      icon: icon,
      draggable: true,
      riseOnHover: true,
    }).bindPopup(template, {
      closeButton: false,
      closeOnClick: false,
    });
    marker.on('click', function() {
      marker.openPopup();
      //browserHistory.push({pathname: Settings.uBaseName + '/trees/' + tree.getId()});
    });
    marker.on('dragend', function() {
      marker.openPopup();
      //browserHistory.push({pathname: Settings.uBaseName + '/trees/' + tree.getId()});
    });
    return marker;
  }
}

export default MarkerComponent;
