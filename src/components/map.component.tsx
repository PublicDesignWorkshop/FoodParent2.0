import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as _ from 'underscore';
import * as $ from 'jquery';

import Routes from './../routes';
var Settings = require('./../constraints/settings.json');
import * as styles from './trees.component.css';
import './../../node_modules/leaflet/dist/leaflet.css';
import { TreeModel, treeStore } from './../stores/tree.store';
import { FoodModel, foodStore } from './../stores/food.store';
import { treeActions } from './../actions/tree.actions';
import MarkerComponent from './marker.component';

export interface IMapProps {
  foods: Array<FoodModel>;
  trees: Array<TreeModel>;
  treeId: number;
  zoom: number;
  onRender: Function;
}
export interface IMapStatus {

}
export default class MapComponent extends React.Component<IMapProps, IMapStatus> {
  private map: L.Map;
  private layer: L.MarkerClusterGroup;
  private markers: Array<L.Marker>;
  private selected: L.Marker;
  private position: L.LatLng;
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
    L.tileLayer(Settings.uTileMap, {
        minZoom: Settings.iMinZoom,
        maxZoom: Settings.iMaxZoom,
    }).addTo(self.map);
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
    if (nextProps.trees.length != 0 && nextProps.foods.length != 0) {
      self.renderMarkers(nextProps.trees, nextProps);
      self.map.setZoom(nextProps.zoom);
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
      if (!bFound) {
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
    if (!bFound) {
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

  private afterRenderMap = () => {
    let self: MapComponent = this;
    self.layer = new L.MarkerClusterGroup();
    self.layer.initialize({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      maxClusterRadius: 40,
    });
    self.layer.addTo(self.map);
    document.querySelector('.leaflet-bottom.leaflet-left').innerHTML = '<div class="leaflet-control-attribution leaflet-control"><div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a></div></div>';
    self.map.on("moveend", self.afterMoveMap);
    self.map.on('popupopen', function (event: any) {
      var marker: L.Marker = event.popup._source;
      self.selected = marker;
      self.selected._bringToFront();
      // Move the map slight off from the center using CRS projection
      var point: L.Point = L.CRS.EPSG3857.latLngToPoint(self.selected.getLatLng(), self.map.getZoom());
      var rMap = ReactDOM.findDOMNode(self.refs['map']);
      if (rMap.clientWidth > rMap.clientHeight) {
        point.x += self.map.getSize().x * 0.15;
      } else {
        //point.y += self.map.getSize().y * 0.15;
      }
      self.map.panTo(L.CRS.EPSG3857.pointToLatLng(point, self.map.getZoom()));
      //self.context.router.push({pathname: Settings.uBaseName + '/trees/' + self.selected.options.id});
    });
    self.map.on('popupclose', function (event: any) {
      self.selected = null;
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
