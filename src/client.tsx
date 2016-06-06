import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, browserHistory  } from 'react-router';
import Routes from './routes';
import { resetFilter } from './utils/filter';
//import { sendMailFromParent } from './utils/mail';

import './client.css';
import './bootstrap-datetimepicker.css';
ReactDOM.render(<Router history={browserHistory}>{Routes}</Router>, document.getElementById('app'));

resetFilter();
// Code Snipet for sending an email.
// sendMailFromParent("jkim848@gatech.edu", "Mail Subject", "Mail Message", function(response) {
//
// }, function(response) {
//
// }, function(response) {
//
// });

// Code snipet for full screen mode (doesn't work).
// var elem: any = document.querySelector("#app");
// if (elem.requestFullscreen) {
//   alert("full screen");
//   elem.requestFullscreen();
// } else if (elem.msRequestFullscreen) {
//   alert("full screen");
//   elem.msRequestFullscreen();
// } else if (elem.mozRequestFullScreen) {
//   alert("full screen");
//   elem.mozRequestFullScreen();
// } else if (elem.webkitRequestFullscreen) {
//   alert("full screen");
//   elem.webkitRequestFullscreen();
// } else {
//   alert("non-full screen");
// }
