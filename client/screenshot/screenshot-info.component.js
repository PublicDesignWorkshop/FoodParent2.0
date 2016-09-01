import $ from 'jquery';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';

require('./screenshot-info.component.scss');

let ServerSetting = require('./../../setting/server.json');
var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';
import { isLatLng } from './../utils/validation';
import { reverseGeocoding } from './../utils/geocoding';

export default class ScreenshotInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({address: ""});
    this.updateProps(this.props);
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    if (props.tree) {
      if (props.tree.address && props.tree.address.trim() != "") {
        this.setState({address: props.tree.address.trim()});
      } else {
        let latitude = parseFloat(props.tree.lat);
        let longitude = parseFloat(props.tree.lng);
        if (isLatLng(latitude, longitude)) {
          reverseGeocoding(props.tree.getLocation(), function(response) {
            this.setState({address: response.formatted});
          }.bind(this));
        }
      }
    }
  }
  render () {
    return (
      <div className="screenshot-info-wrapper">
        <div className="screenshot-info-message">
          <img src={ServerSetting.uBase + ServerSetting.uStaticImage + "splash.png"} />
          <span>{this.state.address}</span>
        </div>
      </div>
    )
  }
}
