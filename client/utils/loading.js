import $ from 'jquery';

export function setSplashMessage(message) {
  $('#loading').html(message);
}
export function hideSplashPage(message) {

  $('#splash').addClass("slide-out");
}
// export function removeLoading() {
//   setTimeout(function() {
//     loadings.pop();
//     if (!loadings.length) {
//       if (!$('#loading').hasClass('hide')) {
//         $('#loading').addClass('hide');
//       }
//     }
//   }, 500);
// }
