let alt = require('../alt');

import ImagePreloader from 'image-preloader-promise';
let ServerSetting = require('./../../setting/server.json');
import { updateSeason } from './../utils/season';
import { getLocalization, setLocalization } from './../utils/localization';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
import { resetFilter } from './../utils/filter';
let FoodSource = require('./../sources/food.source');
let FoodStore = require('./../stores/food.store');
let FoodActions = require('./../actions/food.actions');
let TreeSource = require('./../sources/tree.source');
let TreeActions = require('./../actions/tree.actions');
let AuthSource = require('./../sources/auth.source');
let AuthActions = require('./../actions/auth.actions');
let LocationSource = require('./../sources/location.source');
let LocationActions = require('./../actions/location.actions');
import { MESSAGETYPE } from './../utils/enum';

class InitActions {
  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }

  initialize(id = 0) {
    this.setMessage(MESSAGETYPE.SUCCESS, "Loading FoodParent...");
    return (dispatch) => {
      dispatch();
      this.setCode(90);
      resetFilter();
      updateSeason();
      getLocalization(window.navigator.userLanguage || window.navigator.language).then(function(response) {
        setLocalization(response);
      });
      AuthActions.fetchAuth();
      TreeActions.fetchTrees();
      FoodSource.fetchFoods().then((response) => {
        FoodActions.fetchedFoods(response);
      }).then(() => { // Import foods first and then import image assets.
        let icons = FoodStore.getFoodIcons();
        ImagePreloader.preloadImages(icons).then(function (data) {
          if (icons.length != data.length) { // Error catch for preloadImages.
            displayFailMessage("One or more of food icons are missing. Please check the image files.");
            if (__DEV__) {
              console.error("One or more of food icons are missing. Please check the image files.");
            }
          }
          FoodActions.registerIcons(data);
          this.setCode(200);
          this.loaded();
          setTimeout(function() {
            this.hideSplashPage();
          }.bind(this), ServerSetting.iSplashDisplayTimeout);
        }.bind(this));
      }).catch(function (code) { // Error catch for preloadImages.
        this.setMessage(MESSAGETYPE.FAIL, code);
        displayFailMessage(`Failed to import image assets. Error code: ${code}`);
        if (__DEV__) {
          console.error(`Failed to import image assets. Error code: ${code}`);
        }
      });
    }
  }
  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }
  setMessage(type, value) {
    return (dispatch) => {
      dispatch({type: type, value: value});
    }
  }
  loaded() {
    return (dispatch) => {
      dispatch();
    }
  }
  hideSplashPage() {
    return (dispatch) => {
      dispatch();
    }
  }
}

module.exports = alt.createActions(InitActions);
