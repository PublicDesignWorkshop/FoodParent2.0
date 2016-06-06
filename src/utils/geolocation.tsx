import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import { sortGoogleLocationByDistanceASC } from './../utils/sort';

export interface IReverseGeoLocation {
  formatted: string;
}

export function reverseGeocoding(coordinate: L.LatLng, success?: Function, error?: Function): void {
  var jqxhr = $.getJSON(Settings.uReverseGeoCoding + "&latlng=" + coordinate.lat + "," + coordinate.lng, function (data) {
    if (data.status == "OK") {
      if (success) {
        success({
          formatted: data.results[0].formatted_address
        });
      }
    }
  }).fail(function () {
    if (error) {
      error();
    }
  });
}

export function geocoding(address: string, location: L.LatLng, success?: Function, error?: Function): void {
  var jqxhr = $.getJSON(Settings.uGeoCoding + "&address=" + address, function (data) {
    if (data.status == "OK") {
      let locations: Array<any> = data.results.sort(sortGoogleLocationByDistanceASC(location));
      if (locations.length > 0) {
        success(locations[0].geometry.location);
      } else {
        if (error) {
          error();
        }
      }
    }
  }).fail(function () {
    if (error) {
      error();
    }
  });
}
