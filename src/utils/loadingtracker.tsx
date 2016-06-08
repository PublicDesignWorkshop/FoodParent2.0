import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');


const loadings: Array<boolean> = new Array<boolean>();

export function addLoading() {
  loadings.push(true);
  if ($('#loader').hasClass('hide')) {
    $('#loader').removeClass('hide');
  }
}
export function removeLoading() {
  setTimeout(function() {
    loadings.pop();
    if (!loadings.length) {
      if (!$('#loader').hasClass('hide')) {
        $('#loader').addClass('hide');
      }
    }
  }, 500);
}
