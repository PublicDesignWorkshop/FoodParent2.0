import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');

export enum FilterMode {
  NONE, FOOD, FLAG, OWNERSHIP, ADOPT, RATE
}

export function applyFilter(mode: FilterMode, ids: Array<number>, success?: any, fail?: any, error?: any) {
  if (mode == FilterMode.ADOPT) {

  } else {
    ids.unshift(-1);  // Fake id to handle when there is no item in ids.
  }
  $.ajax({
    url: Settings.uBaseName + Settings.uServer + "filter.php",
    type: "POST",
    data: {
      'mode': mode,
      'ids': ids.toString(),
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

export function deleteFilter(success?: any, fail?: any, error?: any) {
  $.ajax({
    url: Settings.uBaseName + Settings.uServer + "filter.php",
    type: "DELETE",
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
