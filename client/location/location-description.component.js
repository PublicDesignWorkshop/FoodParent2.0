import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./location-description.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { reverseGeocoding } from './../utils/geocoding';
let LocationStore = require('./../stores/location.store');
let LocationActions = require('./../actions/location.actions');
import { isLatLng } from './../utils/validation';


export default class LocationDescription extends React.Component {
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
      if (props.location.description && props.location.description.trim() != "") {
        this.setState({description: props.location.description});
      } else {
        if (props.editing) {
          this.setState({description: ""});
        } else {
          this.setState({description: localization(95)});
        }
      }
    } else {
      this.setState({description: localization(95)});
    }
  }
  updateAttribute() {
    let prevDescription = this.props.location.description;
    if (this.state.description && this.state.description.trim() != "") {
      this.props.location.description = this.state.description.trim();
      this.setState({description: this.props.location.description});
    } else {
      this.setState({description: ""});
    }
    if (prevDescription != this.state.description) {
      LocationActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="location-description-wrapper">
          <div className="location-description-label">
            <FontAwesome className='' name='sticky-note' />{localization(968)}
          </div>
          <div className="location-description-data">
            <input type="text" className="location-description-input" placeholder={localization(973)}
              value={this.state.description}
              onChange={(event: any)=> {
                this.setState({description: event.target.value});
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
        <div className="location-description-wrapper">
          <div className="location-description-label">
            <FontAwesome className='' name='sticky-note' />{localization(968)}
          </div>
          <div className="location-description-data">
            <div className="location-description-text">
              {this.state.description}
            </div>
          </div>
        </div>
      );
    }
  }
}
