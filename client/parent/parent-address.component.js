import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./parent-address.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
let PersonStore = require('./../stores/person.store');
let PersonActions = require('./../actions/person.actions');


export default class ParentAddress extends React.Component {
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
    if (props.parent != null && props.parent.address != null) {
      this.setState({address: props.parent.address});
    } else {
      this.setState({address: " "});
    }
  }
  updateAttribute() {
    let prevAddress = this.props.parent.address;
    if (this.state.address && this.state.address.trim() != "") {
      this.props.parent.address = this.state.address.trim();
      this.setState({address: this.props.parent.address});
    } else {
      this.setState({address: " "});
    }
    if (prevAddress != this.state.address) {
      PersonActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="parent-info-content">
          <div className="parent-info-label">
            <FontAwesome className='' name='map-marker' />{localization(679)}
          </div>
          <div className="parent-info-data">
            <input type="text" className="parent-info-input" placeholder={localization(682)}
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
        <div className="parent-info-content">
          <div className="parent-info-label">
            <FontAwesome className='' name='map-marker' />{localization(679)}
          </div>
          <div className="parent-info-data">
            <div className="parent-info-text">
              {this.state.address}
            </div>
          </div>
        </div>
      );
    }
  }
}
