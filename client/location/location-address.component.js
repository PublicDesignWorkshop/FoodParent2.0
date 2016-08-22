import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./location-address.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { reverseGeocoding } from './../utils/geocoding';
let LocationStore = require('./../stores/location.store');
let LocationActions = require('./../actions/location.actions');
import { isLatLng } from './../utils/validation';


export default class LocationAddress extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
  }
  componentWillMount() {
    this.setState({latitude: MapSetting.vPosition.x, longitude: MapSetting.vPosition.y, address: ""});
  }
  componentDidMount () {
    this.updateProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    if (props.location != null) {
      if (props.location.address != null && props.location.address.trim() != "" && LocationStore.getState().code != 94) {
        this.setState({latitude: props.location.latitude, longitude: props.location.longitude, address: props.location.address});
      } else {
        let latitude = parseFloat(props.location.lat);
        let longitude = parseFloat(props.location.lng);
        if (isLatLng(latitude, longitude)) {
          reverseGeocoding(props.location.getLocation(), function(response) {
            props.location.address = response.formatted;
            this.setState({latitude: latitude, longitude: longitude, address: props.location.address});
          }.bind(this));
        }
      }
    }
  }
  updateAttribute() {
    let prevAddress = this.state.address;
    if (this.state.address.trim() != "") {
      this.props.location.address = this.state.address.trim();
      this.setState({address: this.props.location.address});
    } else {
      reverseGeocoding(this.props.location.getLocation(), function(response) {
        this.props.location.address = response.formatted;
        this.setState({address: this.props.location.address});
      }.bind(this));
    }
    if (prevAddress != this.state.address) {
      LocationActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="location-address-wrapper">
          <div className="location-address-label">
            <FontAwesome className='' name='map-signs' />{localization(967)}
          </div>
          <div className="location-address-data">
            <input type="text" className="location-address-input" placeholder={localization(972)}
              value={this.state.address}
              onChange={(event: any)=> {
                this.setState({address: event.target.value});
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
        <div className="location-address-wrapper">
          <div className="location-address-label">
            <FontAwesome className='' name='map-signs' />{localization(967)}
          </div>
          <div className="location-address-data">
            <div className="location-address-text">
              {this.state.address}
            </div>
          </div>
        </div>
      );
    }
  }
}
