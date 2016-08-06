let alt = require('../alt');

let MapSetting = require('./../../setting/map.json');

class MapActions {
  addMap(id, map) {
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch({id, map});
    }
  }
  update(id) {
    return id;
  }
  panTo(id, location, zoom) {
    return {id, location, zoom};
  }
  moveTo(id, location, zoom) {
    return {id, location, zoom};
  }
  setTile(id, tile) {
    return {id, tile};
  }
  setZoom(id, zoom) {
    return {id, zoom};
  }
  setJustMounted(id, first) {
    return {id, first};
  }
  setActive(id, active) {
    return {id, active};
  }
  moveToUserLocation(id) {
    return (dispatch) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          let location = new L.LatLng(position.coords.latitude, position.coords.longitude);
          this.moveToLocationWithMarker(id, location, MapSetting.iFocusZoom);
        }.bind(this), function(error) {
          if (error.code == error.PERMISSION_DENIED) {
            // displayErrorMessage(localization(332));
            if (__DEV__) {
              console.error(`Failed to detect the user location. Permission is denied.`);
            }
          }
        });
      }
    }
  }
  moveToLocationWithMarker(id, location, zoom) {
    return {id, location, zoom};
  }
}

module.exports = alt.createActions(MapActions);
