import React from 'react';

require('./splash.component.scss');
let ServerSetting = require('./../../setting/server.json');

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
    return (
      <div id="splash" className={"splash-wrapper" + slideout}>
        <div className="top"></div>
        <div className="center">
          <div>
            <img src={ServerSetting.uBase + ServerSetting.uStaticImage + "splash.png"} />
            <div id="loading">
              {this.props.message}
            </div>
          </div>
        </div>
        <div className="bottom"></div>
      </div>
    );
  }
}
