import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import { flagActions } from './../actions/flag.actions';
import { flagStore, FlagModel, FlagState } from './../stores/flag.store';


let FlagSource = {
  fetchFlags(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "flags.php",
        data: {},
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.flags);
          } else {
            reject(response.code);
          }
        },
        error: function(response) {
          reject(response.status);
        }
      });
    })
  },
};

export const flagSource = FlagSource;
