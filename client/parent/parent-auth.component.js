import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./parent-auth.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
let PersonStore = require('./../stores/person.store');
let PersonActions = require('./../actions/person.actions');


export default class ParentAuth extends React.Component {
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
    if (props.parent != null) {
      this.setState({auth: props.parent.getFormattedAuth()});
    } else {
      this.setState({auth: localization(96)});
    }
  }
  updateAttribute() {

  }
  render () {
    if (this.props.editing) {
      return (
        <div className="parent-info-content">
        <div className="parent-info-label">
          <FontAwesome className='' name='certificate' />{localization(678)}
        </div>
        <div className="parent-info-data">
          <div className="parent-info-text">
            {this.state.auth}
          </div>
        </div>
        <div className="error-text">
          {localization(98)}
        </div>
        </div>
      );
    } else {
      return (
        <div className="parent-info-content">
          <div className="parent-info-label">
            <FontAwesome className='' name='certificate' />{localization(678)}
          </div>
          <div className="parent-info-data">
            <div className="parent-info-text">
              {this.state.auth}
            </div>
          </div>
        </div>
      );
    }
  }
}
