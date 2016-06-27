import * as $ from 'jquery';
import 'es6-promise';

var Settings = require('./../constraints/settings.json');
import { foodActions } from './../actions/food.actions';
import { foodStore, FoodModel, FoodState } from './../stores/food.store';


let FoodSource = {
  fetchFoods(id?: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "foods.php",
        type: 'GET',
        data: {},
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.foods);
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
  updateFood(food: FoodModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "food.php",
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(food.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.food);
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
  createFood(food: FoodModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "food.php",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(food.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.food);
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
  deleteFood(food: FoodModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "food.php",
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(food.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.food[0]);
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
  }
};

export const foodSource = FoodSource;
