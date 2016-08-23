let alt = require('../alt');

import ImagePreloader from 'image-preloader-promise';

import { updateSeason } from './../utils/season';
import { getLocalization, setLocalization } from './../utils/localization';
import { resetFilter } from './../utils/filter';
let FoodSource = require('./../sources/food.source');
let FoodStore = require('./../stores/food.store');
let FoodActions = require('./../actions/food.actions');
let FlagSource = require('./../sources/flag.source');
let FlagActions = require('./../actions/flag.actions');
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

  // Fetch all necessary data in the beginning using chain callbacks.
  initialize(id = 0) {
    let self = this;
    self.setMessage(MESSAGETYPE.SUCCESS, "Initializing Application...");
    return (dispatch) => {
      dispatch();
      this.setCode(90);
      // Fetch foods.
      self.setMessage(MESSAGETYPE.SUCCESS, "Importing User Data...");
      AuthSource.fetchAuth()
      .then((response) => {
        AuthActions.fetchedAuth(response);
      })
      .then((response) => {
        self.setMessage(MESSAGETYPE.SUCCESS, "Importing Food Data...");
        FoodSource.fetchFoods()
        .then((response) => {
          FoodActions.fetchedFoods(response);
        })
        .then(() => {
          // Fetch flags.
          self.setMessage(MESSAGETYPE.SUCCESS, "Importing Flag Data...");
          FlagSource.fetchFlags().then((response) => {
            FlagActions.fetchedFlags(response);
          })
          .then(() => {
            self.setMessage(MESSAGETYPE.SUCCESS, "Updating Season Data...");
            resetFilter();
            updateSeason()
            .then(function(response) {
              // Fetch trees.
              LocationActions.fetchLocations();
              self.setMessage(MESSAGETYPE.SUCCESS, "Importing Tree Data...");
              TreeSource.fetchTrees(id)
              .then((response) => {
                TreeActions.fetchedTrees(response);
              })
              .then((response) => {
                self.setMessage(MESSAGETYPE.SUCCESS, "Importing Image Assets...");
                let icons = FoodStore.getFoodIcons();
                ImagePreloader.preloadImages(icons)
                .then(function (data) {
                  if (icons.length != data.length) {
                    if (__DEV__) {
                      console.error("One or more of food icons are missing. Please check the image files.");
                    }
                  }
                  FoodActions.registerIcons(data);
                })
                .then(() => {
                  self.setMessage(MESSAGETYPE.SUCCESS, "Importing Localization Data...");
                  getLocalization(window.navigator.userLanguage || window.navigator.language)
                  .then(function(response) {
                    setLocalization(response);
                  })
                  .then(() => {
                    // Start the app.
                    self.setMessage(MESSAGETYPE.SUCCESS, "Rendering Markers...");
                    self.loaded();
                    let delay = 1000;
                    if (__DEV__) {
                      delay = 100;
                    }
                    setTimeout(function() {
                      self.setMessage(MESSAGETYPE.SUCCESS, "Let's Do Parenting!");
                    }, delay);
                    setTimeout(function() {
                      self.hideSplashPage();
                    }, delay * 2.5);
                  })
                  .catch(function (response) { // Error catch for getLocalization().
                    if (response.status == 200) {
                      self.setMessage(MESSAGETYPE.FAIL, `Failed to import localization data.`);
                      if (__DEV__) {
                        console.error(`Failed to import localization data. This could happen either because the file doesn't exist, or the internet is disconnected.`);
                      }
                    } else {
                      self.setMessage(MESSAGETYPE.FAIL, response.status);
                      if (__DEV__) {
                        console.error(`Failed to import localization data. Error code: ${response.status}`);
                      }
                    }
                  });
                })
                .catch(function (code) { // Error catch for preloadImages().
                  self.setMessage(MESSAGETYPE.FAIL, code);
                  if (__DEV__) {
                    console.error(`Failed to import image assets. Error code: ${code}`);
                  }
                });
              })
              .catch((code) => {  // Error catch for fetchTrees().
                if (code == 200) {
                  self.setMessage(MESSAGETYPE.FAIL, `Failed to import tree data.`);
                  if (__DEV__) {
                     console.error(`Failed to import tree data. This could happen either because the file doesn't exist, or the internet is disconnected.`);
                  }
                } else {
                  self.setMessage(MESSAGETYPE.FAIL, `Failed to import tree data. Error code: ${code}`);
                  if (__DEV__) {
                    console.error(`Failed to import tree data. Error code: ${code}`);
                  }
                }
              });
            })
            .catch(function(response) { // Error catch for calcSeason().
              if (response.status == 200) {
                self.setMessage(MESSAGETYPE.FAIL, `Failed to update season data.`);
                if (__DEV__) {
                   console.error(`Failed to update season data. This could happen either because the file doesn't exist, or the internet is disconnected.`);
                }
              } else {
                self.setMessage(MESSAGETYPE.FAIL, `Failed to update season data. Error code: ${response.status}`);
                if (__DEV__) {
                  console.error(`Failed to update season data. Error code: ${response.status}`);
                }
              }
            });
          })
          .catch((code) => {  // Error catch for fetchFlags().
            if (code == 200) {
              self.setMessage(MESSAGETYPE.FAIL, `Failed to import flag data.`);
              if (__DEV__) {
                 console.error(`Failed to import flag data. This could happen either because the file doesn't exist, or the internet is disconnected.`);
              }
            } else {
              self.setMessage(MESSAGETYPE.FAIL, `Failed to import flag data. Error code: ${code}`);
              if (__DEV__) {
                console.error(`Failed to import flag data. Error code: ${code}`);
              }
            }
          });
        })
        .catch((code) => {  // Error catch for fetchFoods().
          if (code == 200) {
            self.setMessage(MESSAGETYPE.FAIL, `Failed to import food data.`);
            if (__DEV__) {
               console.error(`Failed to import food data. This could happen either because the file doesn't exist, or the internet is disconnected.`);
            }
          } else {
            self.setMessage(MESSAGETYPE.FAIL, `Failed to import food data. Error code: ${code}`);
            if (__DEV__) {
              console.error(`Failed to import food data. Error code: ${code}`);
            }
          }
        });
      })
      .catch((code) => {  // Error catch for fetchAuth().
        if (code == 200) {
          self.setMessage(MESSAGETYPE.FAIL, `Failed to import user data.`);
          if (__DEV__) {
             console.error(`Failed to import user data. This could happen either because the file doesn't exist, or the internet is disconnected.`);
          }
        } else {
          self.setMessage(MESSAGETYPE.FAIL, `Failed to import user data. Error code: ${code}`);
          if (__DEV__) {
            console.error(`Failed to import user data. Error code: ${code}`);
          }
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
