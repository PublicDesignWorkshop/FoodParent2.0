import $ from 'jquery';
let ServerSetting = require('./../../setting/server.json');
import { AMOUNTTYPE, NOTETYPE, PICKUPTIME } from './../utils/enum';
import { DonateModel } from './../stores/donate.model';

const DonateSource = {
  fetchDonatesFromLocationIds(ids) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "donates.php",
        type: 'GET',
        data: {
          locationIds: ids.toString(),
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.donates);
          } else {
            if (__DEV__) {
              console.error(response.message);
            }
            reject(response.code);
          }
        },
        error: function(response) {
          if (__DEV__) {
            console.error(response.statusText);
          }
          reject(response.status);
        }
      });
    });
  },
  fetchRecentDonatesFromLocationId(id) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "donate.php",
        type: 'GET',
        data: {
          locationId: id,
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.donates);
          } else {
            if (__DEV__) {
              console.error(response.message);
            }
            reject(response.code);
          }
        },
        error: function(response) {
          if (__DEV__) {
            console.error(response.statusText);
          }
          reject(response.status);
        }
      });
    });
  },
  fetchDonatesFromTreeId(id) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "donatesfromtree.php",
        type: 'GET',
        data: {
          treeId: id,
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.donates);
          } else {
            if (__DEV__) {
              console.error(response.message);
            }
            reject(response.code);
          }
        },
        error: function(response) {
          if (__DEV__) {
            console.error(response.statusText);
          }
          reject(response.status);
        }
      });
    });
  },
  fetchRecentDonatesFromTreeId(id) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "donatefromtree.php",
        type: 'GET',
        data: {
          treeId: id,
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.donates);
          } else {
            if (__DEV__) {
              console.error(response.message);
            }
            reject(response.code);
          }
        },
        error: function(response) {
          if (__DEV__) {
            console.error(response.statusText);
          }
          reject(response.status);
        }
      });
    });
  },
  updateDonate(donate) {
    let temp = new DonateModel(donate.toJSON());
    switch(temp.amountType) {
      case AMOUNTTYPE.LBS:
        temp.amount = temp.amount * ServerSetting.fLBSTOG;
        temp.amountType = AMOUNTTYPE.G;
        break;
      case AMOUNTTYPE.KG:
        temp.amount = temp.amount * ServerSetting.fKGToG;
        temp.amountType = AMOUNTTYPE.G;
        break;
    }
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "donate.php",
        type: 'PUT',
        data: JSON.stringify(temp.toJSON()),
        contentType: 'application/json',
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.donate);
          } else {
            if (__DEV__) {
              console.error(response.message);
            }
            reject(response.code);
          }
        },
        error: function(response) {
          if (__DEV__) {
            console.error(response.statusText);
          }
          reject(response.status);
        }
      });
    });
  },
  createDonate(donate) {
    let temp = new DonateModel(donate.toJSON());
    switch(temp.amountType) {
      case AMOUNTTYPE.LBS:
        temp.amount = temp.amount * ServerSetting.fLBSTOG;
        temp.amountType = AMOUNTTYPE.G;
        break;
      case AMOUNTTYPE.KG:
        temp.amount = temp.amount * ServerSetting.fKGToG;
        temp.amountType = AMOUNTTYPE.G;
        break;
    }
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "donate.php",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(donate.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.donate);
          } else {
            if (__DEV__) {
              console.error(response.message);
            }
            reject(response.code);
          }
        },
        error: function(response) {
          if (__DEV__) {
            console.error(response.statusText);
          }
          reject(response.status);
        }
      });
    })
  },
  deleteDonate(donate) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: ServerSetting.uBase + ServerSetting.uServer + "donate.php",
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(donate.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.donates[0]);
          } else {
            if (__DEV__) {
              console.error(response.message);
            }
            reject(response.code);
          }
        },
        error: function(response) {
          if (__DEV__) {
            console.error(response.statusText);
          }
          reject(response.status);
        }
      });
    })
  },
};

module.exports = DonateSource;
