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
    if (props.parent != null && props.parent.neighborhood != null) {
      this.setState({neighborhood: props.parent.neighborhood});
    } else {
      this.setState({neighborhood: " "});
    }
  }
  updateAttribute(newNeighborhood) {
    let prevNeighborhood = this.props.parent.neighborhood;
    this.props.parent.neighborhood = newNeighborhood;
    this.setState({neighborhood: this.props.parent.neighborhood});
    if (prevNeighborhood != newNeighborhood) {
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
              value={this.state.neighborhood}
              onChange={(event: any)=> {
                this.updateAttribute(event.target.value);
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
              {this.state.neighborhood}
            </div>
          </div>
        </div>
      );
    }
  }
}
