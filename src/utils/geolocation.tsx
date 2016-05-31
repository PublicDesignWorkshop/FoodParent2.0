import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import { sortGoogleLocationByDistanceASC } from './../utils/sort';

export interface IReverseGeoLocation {
  city: string;
  country: string;
  county: string;
  postcode: string;
  road: string;
  state: string;
  latitude: string;
  longitude: string;
}

export function reverseGeocoding(coordinate: L.LatLng, success?: Function, error?: Function): void {
  var jqxhr = $.getJSON(Settings.uReverseGeoCoding + "&lat=" + coordinate.lat + "&lon=" + coordinate.lng, function (data) {
    if (success) {
      success({
        city: data.address.city,
        country: data.address.country,
        county: data.address.county,
        postcode: data.address.postcode,
        road: data.address.road,
        state: data.address.state,
        latitude: data.lat,
        longitude: data.lon
      });
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