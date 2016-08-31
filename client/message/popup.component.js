import $ from 'jquery';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';

require('./popup.component.scss');

let ServerSetting = require('./../../setting/server.json');
var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';



export default class Popup extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.updateProps(this.props);
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {

  }
  render () {
    return (
      <div id="popup" className="popup-wrapper">
        <div className="popup-message">
        </div>
      </div>
    )
  }
}

let messageTimer;

export function displaySuccessMessage(message) {
  $('#popup .popup-message').html(message);
  $('#popup').addClass('open popup-green');
  if (messageTimer) {
    clearTimeout(messageTimer);
  }
  messageTimer = setTimeout(function () {
    $('#popup .popup-message').html("");
    $('#popup').removeClass('open popup-green');
  }, ServerSetting.iSuccessMessageDiplayTimeout);
}

export function displayFailMessage(message) {
  $('#popup .popup-message').html(message);
  $('#popup').addClass('open popup-red');
  if (messageTimer) {
    clearTimeout(messageTimer);
  }
  messageTimer = setTimeout(function () {
    $('#popup .popup-message').html("");
    $('#popup').removeClass('open popup-red');
  }, ServerSetting.iFailMessageDiplayTimeout);
}
