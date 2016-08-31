let alt = require('../alt');

let MapSetting = require('./../../setting/map.json');
import { setSplashMessage } from './../utils/loading';
import { localization } from './../utils/localization';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
let FoodSource = require('./../sources/food.source');

class FoodActions {
  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }
  fetchFoods() {
    return (dispatch) => {
      dispatch();
      this.setCode(90);
      FoodSource.fetchFoods().then((response) => {
        this.fetchedFoods(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  fetchedFoods(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  registerIcons(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  updateFood(food) {
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
      this.setCode(92);
      FoodSource.updateFood(food).then((response) => {
        displaySuccessMessage(localization(634));
        this.updatedFood(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  updatedFood(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
}

module.exports = alt.createActions(FoodActions);
