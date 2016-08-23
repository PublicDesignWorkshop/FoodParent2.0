import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./location-name.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { reverseGeocoding } from './../utils/geocoding';
let LocationStore = require('./../stores/location.store');
let LocationActions = require('./../actions/location.actions');
import { isLatLng } from './../utils/validation';


export default class LocationName extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
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
    if (props.location != null) {
      if (props.location.name && props.location.name.trim() != "") {
        this.setState({name: props.location.name});
      } else {
        if (props.editing) {
          this.setState({name: ""});
        } else {
          this.setState({name: localization(50)});
        }
      }
    } else {
      this.setState({name: localization(50)});
    }
  }
  updateAttribute() {
    let prevName = this.props.location.name;
    if (this.state.name && this.state.name.trim() != "") {
      this.props.location.name = this.state.name.trim();
      this.setState({name: this.props.location.name});
    } else {
      this.setState({name: ""});
    }
    if (prevName != this.state.name) {
      LocationActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="location-name-wrapper">
          <div className="location-name-label">
            <img src={ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uRecipientMarkerIcon} />
          </div>
          <div className="location-name-data">
            <input type="text" className="location-name-input" placeholder={localization(668)}
              value={this.state.name}
              onChange={(event: any)=> {
                this.setState({name: event.target.value});
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
      let name = this.state.name;
      if (this.props.location && this.props.location.id) {
        name = this.state.name + " #" + this.props.location.id;
      }
      return (
        <div className="location-name-wrapper">
          <div className="location-name-label">
            <img src={ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uRecipientMarkerIcon} />
          </div>
          <div className="location-name-data">
            <div className="location-name-text">
              {name}
            </div>
          </div>
        </div>
      );
    }
  }
}
