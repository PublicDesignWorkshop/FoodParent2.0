import * as $ from 'jquery';
import 'es6-promise';

var Settings = require('./../constraints/settings.json');
import { authActions } from './../actions/auth.actions';
import { authStore, AuthModel, AuthState } from './../stores/auth.store';


let AuthSource = {
  fetchAuth(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "logincheck.php",
        type: 'GET',
        data: {},
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response);
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
  processLogout(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "logout.php",
        type: "GET",
        data: {},
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response);
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
  processLogin(contact: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "login.php",
        type: "POST",
        data: {
          'contact': contact,
          'p': password,
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response);
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
}

export const authSource = AuthSource;
