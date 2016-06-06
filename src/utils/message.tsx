import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');


var messageTimer;
export function displaySuccessMessage(message: string) {
  $('#message div').html(message);
  $('#message').addClass('slidein');
  clearTimeout(messageTimer);
  messageTimer = setTimeout(function () {
    $('#message div').html("");
    $('#message').removeClass('slidein');
  }, Settings.iMessageDuration);
}

export function displayErrorMessage(message: string) {
  $('#message div').html(message);
  $('#message').addClass('slidein');
  $('#message').addClass('error');
  clearTimeout(messageTimer);
  messageTimer = setTimeout(function () {
    $('#message div').html("");
    $('#message').removeClass('slidein');
    $('#message').removeClass('error');
  }, Settings.iMessageDuration);
}
