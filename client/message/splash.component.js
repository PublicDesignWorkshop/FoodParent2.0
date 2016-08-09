import React from 'react';

require('./splash.component.scss');
let ServerSetting = require('./../../setting/server.json');
var FontAwesome = require('react-fontawesome');


import { MESSAGETYPE } from './../utils/enum';


export default class Loader extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {

  }
  componentDidMount () {

  }
  componentWillReceiveProps() {

  }
  render () {
    let slideout = "";
    if (this.props.hide) {
      slideout = " slide-out";
    }
    let type = "";
    let icon = <FontAwesome name="check" />;
    if (this.props.message.type == MESSAGETYPE.FAIL) {
      type = " fail";
      icon = <FontAwesome name="remove" />;
    }
    return (
      <div id="splash" className={"splash-wrapper" + slideout}>
        <div className="top"></div>
        <div className="center">
          <div>
            <img src={ServerSetting.uBase + ServerSetting.uStaticImage + "splash.png"} />
            <div id="loading" className={type}>
              {icon}
              {" " + this.props.message.value}
            </div>
          </div>
        </div>
        <div className="bottom"></div>
      </div>
    );
  }
}
