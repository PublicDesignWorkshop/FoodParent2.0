let alt = require('../alt');

let DonateSource = require('./../sources/donate.source');
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
import { localization } from './../utils/localization';


class DonateActions {
  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }
  createTempDonate(locationId) {
    return (dispatch) => {
      dispatch(locationId);
    }
  }
  setSelected(id) {
    return (dispatch) => {
      dispatch(id);
    }
  }
  fetchDonatesFromLocationIds(ids) {
    if (ids != null) {
      return (dispatch) => {
        dispatch();
        this.setCode(90);
        DonateSource.fetchDonatesFromLocationIds(ids).then((response) => {
          this.fetchedDonates(response);
        }).catch((code) => {
          displayFailMessage(localization(code));
          if (__DEV__) {
            console.error(localization(code));
          }
          this.setCode(code);
        });
      }
    }
    return null;
  }
  fetchRecentDonatesFromLocationId(id) {
    if (id != null) {
      return (dispatch) => {
        dispatch();
        this.setCode(90);
        DonateSource.fetchRecentDonatesFromLocationId(id).then((response) => {
          this.fetchedDonates(response);
        }).catch((code) => {
          displayFailMessage(localization(code));
          if (__DEV__) {
            console.error(localization(code));
          }
          this.setCode(code);
        });
      }
    }
    return null;
  }
  fetchedDonates(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  updateDonate(donate) {
    return (dispatch) => {
      dispatch();
      this.setCode(92);
      DonateSource.updateDonate(donate).then((response) => {
        displaySuccessMessage(localization(604));
        this.updatedDonate(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  updatedDonate(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  createDonate(donate) {
    return (dispatch) => {
      dispatch();
      this.setCode(93);
      DonateSource.createDonate(donate).then((response) => {
        displaySuccessMessage(localization(605));
        this.createdDonate(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  createdDonate(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  deleteDonate(donate) {
    return (dispatch) => {
      dispatch();
      this.setCode(91);
      DonateSource.deleteDonate(donate).then((response) => {
        displayFailMessage(localization(607));
        this.deletedDonate(donate.toJSON());
      }).catch((code) => {
        displayFailMessage(localization(code));
        this.setCode(code);
      });
    }
  }
  deletedDonate(props) {
    return (dispatch) => {
      // browserHistory.replace({pathname: window.location.pathname});
      dispatch(props);
    }
  }
}

module.exports = alt.createActions(DonateActions);
