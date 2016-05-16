import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');

export enum FilterMode {
  NONE, FOOD
}

export function applyFilter(mode: FilterMode, foodIds: Array<number>, success?: any, fail?: any, error?: any) {
  let foods: Array<number> = foodIds;
  foods.unshift(0);
  $.ajax({
    url: Settings.uBaseName + Settings.uServer + "filter.php",
    type: "POST",
    data: {
      'mode': mode,
      'foodIds': foods.toString(),
    },
    cache: false,
    dataType: "json",
    success: function (response, textStatus, jqXHR) {
      if (parseInt(response.code) == 400) {   // Logged in
        if (success) {
          success(response);
        }
      } else {   // Not logged in
        if (fail) {
          fail(response.code);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (error) {
        fail(jqXHR);
      }
    }
  });
}

export function readFilter(success?: any, fail?: any, error?: any) {
  $.ajax({
    url: Settings.uBaseName + Settings.uServer + "filter.php",
    type: "GET",
    data: {

    },
    cache: false,
    dataType: "json",
    success: function (response, textStatus, jqXHR) {
      if (parseInt(response.code) == 400) {   // Logged in
        if (success) {
          success(response);
        }
      } else {   // Not logged in
        if (fail) {
          fail(response.code);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (error) {
        fail(jqXHR);
      }
    }
  });
}

export function resetFilter(success?: any, fail?: any, error?: any) {
  $.ajax({
    url: Settings.uBaseName + Settings.uServer + "filter.php",
    type: "PUT",
    data: {
      
    },
    cache: false,
    dataType: "json",
    success: function (response, textStatus, jqXHR) {
      if (parseInt(response.code) == 400) {   // Logged in
        if (success) {
          success(response);
        }
      } else {   // Not logged in
        if (fail) {
          fail(response.code);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (error) {
        fail(jqXHR);
      }
    }
  });
}
