let alt = require('../alt');

import ImagePreloader from 'image-preloader-promise';

import { updateSeason } from './../utils/season';
let FoodSource = require('./../sources/food.source');
let FoodStore = require('./../stores/food.store');
let FoodActions = require('./../actions/food.actions');
let FlagSource = require('./../sources/flag.source');
let FlagActions = require('./../actions/flag.actions');
let TreeSource = require('./../sources/tree.source');
let TreeActions = require('./../actions/tree.actions');

class InitActions {
  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }

  // Fetch all necessary data in the beginning using chain callbacks.
  initialize(id = 0) {
    let self = this;
    self.setMessage("Initializing Application...");
    return (dispatch) => {
      dispatch();
      this.setCode(90);
      // Fetch foods.
      self.setMessage("Importing Food Data...");
      FoodSource.fetchFoods()
      .then((response) => {
        FoodActions.fetchedFoods(response);
      })
      .then(() => {
        // Fetch flags.
        self.setMessage("Importing Flag Data...");
        FlagSource.fetchFlags().then((response) => {
          FlagActions.fetchedFlags(response);
        })
        .then(() => {
          self.setMessage("Updating Season Data...");
          updateSeason()
          .then(function(response) {
            // Fetch trees.
            self.setMessage("Importing Tree Data...");
            TreeSource.fetchTrees(id)
            .then((response) => {
              TreeActions.fetchedTrees(response);
            })
            .then((response) => {
              self.setMessage("Importing Image Assets...");
              let icons = FoodStore.getFoodIcons();
              ImagePreloader.preloadImages(icons)
              .then(function (data) {
                if (icons.length != data.length) {
                  if (__DEV__) {
                    console.warn("One or more of food icons are missing. Please check the image files.");
                  }
                }
                FoodActions.registerIcons(data);
              })
              .then((response) => {
                // Start the app.
                self.setMessage("Rendering Markers...");
                self.loaded();
                setTimeout(function() {
                  self.setMessage("Let's Do Parenting!");
                }, 1000);
                setTimeout(function() {
                  self.hideSplashPage();
                }, 2500);
              })
              .catch(function (err) { // Error catch for preloadImages().
                if (__DEV__) {
                  console.log(err);
                  console.error('None of the images were able to be loaded! Please check the internet connection.');
                }
              });
            })
            .catch((code) => {  // Error catch for fetchTrees().
              // this.setCode(code);
            });
          })
          .catch(function(response) { // Error catch for calcSeason().
            if (__DEV__) {
               if (response.status == 200) {
                 console.error(`Failed to update season data. This could happen either because the file doesn't exist, or the internet is disconnected.`);
               } else {
                 console.error(`Failed to update season data. Error code: ${response.status}`);
               }
            }
          });
        })
        .catch((code) => {  // Error catch for fetchFlags().
          // this.setCode(code);
        });
      })
      .catch((code) => {  // Error catch for fetchFoods().
        // this.setCode(code);
      });
    }
  }

  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }
  setMessage(message) {
    return (dispatch) => {
      dispatch(message);
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
