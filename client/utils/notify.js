import $ from 'jquery';
let ServerSetting = require('./../../setting/server.json');

export function fetchNotify(resolve, reject) {
  // Create promise for importing the json file only one time over the program.
  let upcomingTreesPromise = $.ajax({
    url: ServerSetting.uBase + ServerSetting.uServer + "notify.php",
    type: 'GET',
    data: {},
    cache: false,
    dataType: "json"
  });
  return upcomingTreesPromise.then(function(response) {
    if (response.code == 200) {
      if (resolve)
        resolve(response);
    } else {
      if (__DEV__) {
        console.error(response.message);
      }
      if (reject)
        reject(response.code);
    }
  }).catch(function(response) { // Error catch for calcSeason().
    if (__DEV__) {
      console.error(response.statusText);
    }
    if (reject)
      reject(response.status);
  });
}

export function notifyToManagers(treeIds, resolve, reject) {
  // Create promise for importing the json file only one time over the program.
  let upcomingTreesPromise = $.ajax({
    url: ServerSetting.uBase + ServerSetting.uServer + "notify_managers.php",
    type: 'POST',
    data: {
      treeIds: treeIds,
    },
    cache: false,
    dataType: "json"
  });
  return upcomingTreesPromise.then(function(response) {
    if (response.code == 200) {
      if (resolve)
        resolve(response);
    } else {
      if (__DEV__) {
        console.error(response.message);
      }
      if (reject)
        reject(response.code);
    }
  }).catch(function(response) { // Error catch for calcSeason().
    if (__DEV__) {
      console.error(response.statusText);
    }
    if (reject)
      reject(response.status);
  });
}

export function notifyToParents(treeIds, resolve, reject) {
  // Create promise for importing the json file only one time over the program.
  let upcomingTreesPromise = $.ajax({
    url: ServerSetting.uBase + ServerSetting.uServer + "notify_parents.php",
    type: 'POST',
    data: {
      treeIds: treeIds,
    },
    cache: false,
    dataType: "json"
  });
  return upcomingTreesPromise.then(function(response) {
    if (response.code == 200) {
      if (resolve)
        resolve(response);
    } else {
      if (__DEV__) {
        console.error(response.message);
      }
      if (reject)
        reject(response.code);
    }
  }).catch(function(response) { // Error catch for calcSeason().
    if (__DEV__) {
      console.error(response.statusText);
    }
    if (reject)
      reject(response.status);
  });
}
