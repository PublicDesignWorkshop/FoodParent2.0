import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./location-location.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
let LocationStore = require('./../stores/location.store');
let LocationActions = require('./../actions/location.actions');
import { isLatLng } from './../utils/validation';


export default class LocationLocation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
  }
  componentWillMount() {
    this.setState({latitude: MapSetting.vPosition.x, longitude: MapSetting.vPosition.y});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    if (props.location != null) {
      let latitude = parseFloat(props.location.lat);
      let longitude = parseFloat(props.location.lng);
      if (isLatLng(latitude, longitude)) {
        this.setState({latitude: latitude, longitude: longitude});
      }
    }
  }
  updateAttribute() {
    let prevLat = this.props.location.lat;
    let prevLng = this.props.location.lng;
    if (isLatLng(parseFloat(this.state.latitude), parseFloat(this.state.longitude))) {
      this.props.location.lat = parseFloat(this.state.latitude);
      this.props.location.lng = parseFloat(this.state.longitude);
      this.setState({latitude: this.props.location.lat, longitude: this.props.location.lng});
      if (prevLat != parseFloat(this.state.latitude) || prevLng != parseFloat(this.state.longitude)) {
        LocationActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
      }
      if (this.props.location.marker) {
        this.props.location.marker.setLatLng(new L.LatLng(parseFloat(this.state.latitude), parseFloat(this.state.longitude)));
      }
    } else {
      this.setState({latitude: this.props.location.lat, longitude: this.props.location.lng});
      LocationActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="location-location-wrapper">
          <div className="location-location-label">
            <FontAwesome className='' name='map-marker' />{localization(980)}
          </div>
          <div className="location-location-data">
            <input type="text" className="location-location-input" placeholder={localization(979)}
              value={this.state.latitude}
              onChange={(event: any)=> {
                this.setState({latitude: event.target.value});
              }}
              onKeyPress={(event)=> {
                if (event.key == 'Enter') {
                  this.updateAttribute();
                }
              }}
              onBlur={()=> {
                this.updateAttribute();
              }} />
            <div className="location-location-comma">,</div>
            <input type="text" className="location-location-input" placeholder={localization(979)}
              value={this.state.longitude}
              onChange={(event: any)=> {
                this.setState({longitude: event.target.value});
              }}
              onKeyPress={(event)=> {
                if (event.key == 'Enter') {
                  this.updateAttribute();
                }
              }}
              onBlur={()=> {
                this.updateAttribute();
              }} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="location-location-wrapper">
          <div className="location-location-label">
            <FontAwesome className='' name='map-marker' />{localization(980)}
          </div>
          <div className="location-location-data">
            <div className="location-location-text">
              {this.state.latitude}
            </div>
            <div className="location-location-comma">,</div>
            <div className="location-location-text">
              {this.state.longitude}
            </div>
          </div>
        </div>
      );
    }
  }
}
