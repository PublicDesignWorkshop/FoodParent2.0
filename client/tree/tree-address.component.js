import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./tree-address.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { reverseGeocoding } from './../utils/geocoding';
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');
import { isLatLng } from './../utils/validation';


export default class TreeAddress extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
  }
  componentWillMount() {
    this.setState({latitude: MapSetting.vPosition.x, longitude: MapSetting.vPosition.y, address: ""});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    if (props.tree != null) {
      if (props.tree.address != null && props.tree.address.trim() != "" && TreeStore.getState().code != 94) {
        this.setState({latitude: props.tree.latitude, longitude: props.tree.longitude, address: props.tree.address});
      } else {
        let latitude = parseFloat(props.tree.lat);
        let longitude = parseFloat(props.tree.lng);
        if (isLatLng(latitude, longitude)) {
          reverseGeocoding(props.tree.getLocation(), function(response) {
            props.tree.address = response.formatted;
            this.setState({latitude: latitude, longitude: longitude, address: props.tree.address});
          }.bind(this));
        }
      }
    }
  }
  updateAttribute() {
    let prevAddress = this.state.address;
    if (this.state.address.trim() != "") {
      this.props.tree.address = this.state.address.trim();
      this.setState({address: this.props.tree.address});
    } else {
      reverseGeocoding(this.props.tree.getLocation(), function(response) {
        this.props.tree.address = response.formatted;
        this.setState({address: this.props.tree.address});
      }.bind(this));
    }
    if (prevAddress != this.state.address) {
      TreeActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="tree-address-wrapper">
          <div className="tree-address-label">
            <FontAwesome className='' name='map-signs' />{localization(967)}
          </div>
          <div className="tree-address-data">
            <input type="text" className="tree-address-input" placeholder={localization(972)}
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
        <div className="tree-address-wrapper">
          <div className="tree-address-label">
            <FontAwesome className='' name='map-signs' />{localization(967)}
          </div>
          <div className="tree-address-data">
            <div className="tree-address-text">
              {this.state.address}
            </div>
          </div>
        </div>
      );
    }
  }
}
