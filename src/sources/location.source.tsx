import * as $ from 'jquery';
import 'es6-promise';

var Settings = require('./../constraints/settings.json');
import { locationActions } from './../actions/location.actions';
import { locationStore, LocationModel, LocationState } from './../stores/location.store';


let LocationSource = {
  fetchLocations(id?: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "locations.php",
        type: 'GET',
        data: {
          id: id,
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.locations);
          } else {
            console.log(response.message);
            reject(response.code);
          }
        },
        error: function(response) {
          console.log(response.statusText);
          reject(response.status);
        }
      });
    })
  },
  updateLocation(location: LocationModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "location.php",
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(location.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.location);
          } else {
            console.log(response.message);
            reject(response.code);
          }
        },
        error: function(response) {
          console.log(response.statusText);
          reject(response.status);
        }
      });
    })
  },
  createLocation(location: LocationModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "location.php",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(location.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.location);
          } else {
            console.log(response.message);
            reject(response.code);
          }
        },
        error: function(response) {
          console.log(response.statusText);
          reject(response.status);
        }
      });
    })
  },
  deleteLocation(location: LocationModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "location.php",
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(location.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.location[0]);
          } else {
            console.log(response.message);
            reject(response.code);
          }
        },
        error: function(response) {
          console.log(response.statusText);
          reject(response.status);
        }
      });
    })
  },
};

export const locationSource = LocationSource;
