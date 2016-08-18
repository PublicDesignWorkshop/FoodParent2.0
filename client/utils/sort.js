export function sortLocationByDistanceASC(location) {
  return function(a, b) {
    let dista = Math.sqrt(Math.pow(a.geometry.location.lat - location.lat, 2) + Math.pow(a.geometry.location.lng - location.lng, 2));
    let distb = Math.sqrt(Math.pow(b.geometry.location.lat - location.lat, 2) + Math.pow(b.geometry.location.lng - location.lng, 2));
    return dista - distb;
  }
}

export function sortNoteByDateDESC(a, b) {
  if (a.date.valueOf() > b.date.valueOf()) {
    return -1;
  } else if (a.date.valueOf() < b.date.valueOf()) {
    return 1;
  } else {
    return 0;
  }
}

export function sortNoteByDateASC(a, b) {
  if (a.date.valueOf() > b.date.valueOf()) {
    return 1;
  } else if (a.date.valueOf() < b.date.valueOf()) {
    return -1;
  } else {
    return 0;
  }
}
