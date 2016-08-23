let alt = require('../alt');

let LocationSource = require('./../sources/location.source');
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
import { localization } from './../utils/localization';


class LocationActions {
  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }
  refresh() {
    return (dispatch) => {
      dispatch();
    }
  }
  createTempLocation() {
    return (dispatch) => {
      dispatch();
    }
  }
  fetchLocations(id = -1) {
    return (dispatch) => {
      dispatch();
      this.setCode(90);
      LocationSource.fetchLocations(id).then((response) => {
        this.fetchedLocations(response, id);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  fetchedLocations(props, id) {
    return (dispatch) => {
      dispatch({props: props, id: id});
    }
  }
  setSelected(id) {
    return (dispatch) => {
      dispatch(id);
    }
  }
  setEditing(id, editing){
    return (dispatch) => {
      dispatch({id, editing});
    }
  }
  refresh() {
    return (dispatch) => {
      dispatch();
    }
  }
  createLocation(location) {
    if (location.name == null || location.name.trim() == "") {
      displayFailMessage(localization(668));
      this.setCode(643);
    } else {
      return (dispatch) => {
        // we dispatch an event here so we can have "loading" state.
        dispatch();
        this.setCode(92);
        LocationSource.createLocation(location).then((response) => {
          displaySuccessMessage(localization(665));
          this.createdLocation(response);
        }).catch((code) => {
          displayFailMessage(localization(code));
          if (__DEV__) {
            console.error(localization(code));
          }
          this.setCode(code);
        });
      }
    }
  }
  createdLocation(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  updateLocation(location) {
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
      this.setCode(92);
      LocationSource.updateLocation(location).then((response) => {
        displaySuccessMessage(localization(664));
        this.updatedLocation(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  updatedLocation(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  deleteLocation(location) {
    return (dispatch) => {
      dispatch();
      this.setCode(91);
      LocationSource.deleteLocation(location).then((response) => {
        displayFailMessage(localization(667));
        this.deletedLocation(location.toJSON());
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  deletedLocation(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
}

module.exports = alt.createActions(LocationActions);
