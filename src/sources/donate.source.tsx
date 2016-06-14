import * as $ from 'jquery';
import 'es6-promise';

var Settings = require('./../constraints/settings.json');
import { donateActions } from './../actions/donate.actions';
import { AmountType } from './../utils/enum';
import { donateStore, DonateModel, DonateState } from './../stores/donate.store';


let DonateSource = {
  fetchDonatesFromLocationIds(locationIds: Array<number>): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "donates.php",
        type: 'GET',
        data: {
          locationIds: locationIds.toString(),
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.donates);
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
  createDonate(donate: DonateModel): Promise<any> {
    if (donate.getAmountType() == AmountType.KG) {
      donate.setAmount(donate.getAmount() * Settings.fKGToG);
    } else if (donate.getAmountType() == AmountType.LBS) {
      donate.setAmount(donate.getAmount() * Settings.fLBSTOG);
    }
    donate.setAmountType(AmountType.G);
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "donate.php",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(donate.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.donate);
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
  updateDonate(donate: DonateModel): Promise<any> {
    if (donate.getAmountType() == AmountType.KG) {
      donate.setAmount(donate.getAmount() * Settings.fKGToG);
    } else if (donate.getAmountType() == AmountType.LBS) {
      donate.setAmount(donate.getAmount() * Settings.fLBSTOG);
    }
    donate.setAmountType(AmountType.G);
    return new Promise<any>((resolve, reject) => {
      if (donate.getAmountType() == AmountType.KG) {
        donate.setAmount(donate.getAmount() * Settings.fKGToG);
      } else if (donate.getAmountType() == AmountType.LBS) {
        donate.setAmount(donate.getAmount() * Settings.fLBSTOG);
      }
      donate.setAmountType(AmountType.G);
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "donate.php",
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(donate.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.donates[0]);
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
  deleteDonate(donate: DonateModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "donate.php",
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(donate.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.donates[0]);
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

export const donateSource = DonateSource;
