import React from 'react';
let IScroll = require('iscroll');


require('./image-zoom.component.scss');

let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';

export default class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {

  }
  componentDidMount () {
    let scroll = new IScroll("#image-zoom", {
      zoom: true,
      scrollX: true,
      scrollY: true,
      mouseWheel: true,
      wheelAction: "zoom"
    });
  }
  componentWillReceiveProps() {

  }
  render () {
    return (
      <div className="image-zoom-wrapper">
        <div className="image-zoom-label" onClick={this.props.onZoomClose}>
          {localization(72)} <FontAwesome className='' name='close' />
        </div>
        <div id="image-zoom" className="image-zoom-content">
          <img src={this.props.image} />
        </div>
      </div>
    );
  }
}
