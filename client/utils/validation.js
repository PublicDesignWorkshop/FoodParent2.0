export function isLatLng(lat, lng) {
  // let lat = parseFloat(lat);
  // let lng = parseFloat(lng);
  if (isNaN(lat) || isNaN(lng)) {
    return false;
  }
  if (lat < -90 || lat > 90) {
    return false;
  }
  if (lng < -180 || lng > 180) {
    return false;
  }
  return true;
}
