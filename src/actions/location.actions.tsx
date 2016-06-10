import { alt } from './../alt';
import * as Alt from 'alt';
import { browserHistory } from 'react-router';
import { AbstractActions } from "./abstract.actions";

var Settings = require('./../constraints/settings.json');
import { LocationModel, ILocationProps } from './../stores/location.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { locationSource } from './../sources/location.source';
import { displaySuccessMessage, displayErrorMessage } from './../utils/message';
import { localization } from './../constraints/localization';

interface ILocationActions {
  fetchLocations(id?: number);
  fetchedLocations(locationsProps: Array<ILocationProps>);
  updateLocation(location: LocationModel);
  updatedLocation(props: ILocationProps);
  createLocation(location: LocationModel);
  createdLocation(props: ILocationProps);
  deleteLocation(location: LocationModel);
  deletedLocation(props: ILocationProps);
  resetTempLocation();
  refresh();
  setCode(code: number);
}

class LocationActions extends AbstractActions implements ILocationActions {
  setCode(code: number) {
    let self: LocationActions = this;
    return (dispatch) => {
      dispatch(code);
    }
  }
  fetchLocations(id?: number) {
    let self: LocationActions = this;
    return (dispatch) => {
      addLoading();
      dispatch();
      self.setCode(90);
      locationSource.fetchLocations(id).then((response) => {
        self.fetchedLocations(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  fetchedLocations(locationsProps: Array<ILocationProps>) {
    let self: LocationActions = this;
    return (dispatch) => {
      dispatch(locationsProps);
    }
  }
  updateLocation(location: LocationModel) {
    let self: LocationActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      self.setCode(92);
      locationSource.updateLocation(location).then((response) => {
        displaySuccessMessage(localization(664));
        self.updatedLocation(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  updatedLocation(props: ILocationProps) {
    let self: LocationActions = this;
    return (dispatch) => {
      dispatch(props);
    }
  }
  createLocation(location: LocationModel) {
    let self: LocationActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      self.setCode(92);
      locationSource.createLocation(location).then((response) => {
        displaySuccessMessage(localization(665));
        self.createdLocation(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  createdLocation(props: ILocationProps) {
    return (dispatch) => {
      browserHistory.push({pathname: Settings.uBaseName + '/donation/' + props.id});
      dispatch(props);
    }
  }
  resetTempLocation() {
    return (dispatch) => {
      dispatch();
    }
  }
  refresh() {
    return (dispatch) => {
      dispatch();
    }
  }
  deleteLocation(location: LocationModel) {
    let self: LocationActions = this;
    return (dispatch) => {
      addLoading();
      dispatch();
      self.setCode(91);
      locationSource.deleteLocation(location).then((response) => {
        displayErrorMessage(localization(667));
        self.deletedLocation(location.toJSON());
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  deletedLocation(props: ILocationProps) {
    let self: LocationActions = this;
    return (dispatch) => {
      browserHistory.replace({pathname: Settings.uBaseName + '/'});
      dispatch(props);
    }
  }
}

export const locationActions = alt.createActions<ILocationActions>(LocationActions);
