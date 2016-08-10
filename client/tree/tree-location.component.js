import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./tree-location.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');
import { isLatLng } from './../utils/validation';


export default class TreeLocation extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
  }
  componentWillMount() {
    this.setState({latitude: MapSetting.vPosition.x, longitude: MapSetting.vPosition.y, editing: false});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    if (props.tree != null) {
      let latitude = parseFloat(props.tree.lat);
      let longitude = parseFloat(props.tree.lng);
      if (isLatLng(latitude, longitude)) {
        this.setState({latitude: latitude, longitude: longitude});
      }
    }
  }
  updateAttribute() {
    this.props.tree.lat = parseFloat(this.state.latitude);
    this.props.tree.lng = parseFloat(this.state.longitude);
    // if (parseInt(this.state.selected.value) != parseInt(selected.value)) {
    //   TreeActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    // }
    this.setState({latitude: this.props.tree.lat, longitude: this.props.tree.lng});
  }
  render () {
    if (this.state.editing) {
      return (
        <div className="tree-location-wrapper fade-in">
          <div className="tree-location-label">
            <FontAwesome className='' name='map-marker' />{localization(980)}
          </div>
          <div className="tree-location-data">
            <input type="text" className="tree-location-input" placeholder={localization(979)}
              value={this.state.latitude}
              onChange={(event: any)=> {
                if (parseFloat(event.target.value) != this.state.latitude) {
                  TreeActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
                }
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
            <div className="tree-location-comma">,</div>
            <input type="text" className="tree-location-input" placeholder={localization(979)}
              value={this.state.longitude}
              onChange={(event: any)=> {
                if (parseFloat(event.target.value) != this.state.latitude) {
                  TreeActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
                }
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
        <div className="tree-location-wrapper fade-in">
          <div className="tree-location-label">
            <FontAwesome className='' name='map-marker' />{localization(980)}
          </div>
          <div className="tree-location-data">
            <div className="tree-location-text">
              {this.state.latitude}
            </div>
            <div className="tree-location-comma">,</div>
            <div className="tree-location-text">
              {this.state.longitude}
            </div>
          </div>
        </div>
      );
    }
  }
}
