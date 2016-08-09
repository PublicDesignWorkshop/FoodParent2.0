import $ from 'jquery';

let MapSetting = require('./../../setting/map.json');
import { sortLocationByDistanceASC } from './sort';



export function geocoding(address, location, success, fail): void {
  var jqxhr = $.getJSON(MapSetting.uReverseGeoCoding + "&address=" + address, function (data) {
    if (data.status == "OK") {
      let locations = data.results.sort(sortLocationByDistanceASC(location));
      if (locations.length > 0) {
        success(locations[0].geometry.location);
      } else {
        if (fail) {
          fail();
        }
      }
    }
  }).fail(function () {
    if (fail) {
      fail();
    }
  });
}
