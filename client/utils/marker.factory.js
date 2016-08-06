import * as L from 'leaflet';
import './marker.factory.scss';
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');
let MapActions = require('./../actions/map.actions');

export function createFocusMarker(location) {
  // Create marker icon.
  let icon = new L.Icon({
    iconUrl: ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uPinIcon,
    iconSize: new L.Point(40, 40),
    iconAnchor: new L.Point(20, 40),
    popupAnchor: new L.Point(1, -36),
  });
  // Create marker.
  let marker = new L.Marker(location, {
    icon: icon,
    draggable: false
  });
  // Add zoom-in event listener
  marker.on('dblclick', function() {
    MapActions.moveToLocationWithMarker(MapSetting.sTreeMapId, location, MapSetting.iFocusZoom);
  });

  return marker;
}
