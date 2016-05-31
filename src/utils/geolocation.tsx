import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');

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

export function geocoding(address: string, success?: Function, error?: Function): void {
  var jqxhr = $.getJSON(Settings.uGeoCoding + "&address=" + address, function (data) {
    if (data.status == "OK") {
      success(data.results[0].geometry.location);
    }
    // if (success) {
    //   success({
    //     city: data.address.city,
    //     country: data.address.country,
    //     county: data.address.county,
    //     postcode: data.address.postcode,
    //     road: data.address.road,
    //     state: data.address.state,
    //     latitude: data.lat,
    //     longitude: data.lon
    //   });
    // }
  }).fail(function () {
    if (error) {
      error();
    }
  });
}
