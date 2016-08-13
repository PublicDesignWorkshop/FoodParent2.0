import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./parent-contact.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
let PersonStore = require('./../stores/person.store');
let PersonActions = require('./../actions/person.actions');


export default class ParentContact extends React.Component {
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
      this.setState({contact: props.parent.contact});
    } else {
      this.setState({contact: localization(96)});
    }
  }
  updateAttribute() {

  }
  render () {
    if (this.props.editing) {
      return (
        <div className="parent-info-content">
        <div className="parent-info-label">
          <FontAwesome className='' name='user' />{localization(681)}
        </div>
        <div className="parent-info-data">
          <div className="parent-info-text">
            {this.state.contact}
          </div>
        </div>
        <div className="error-text">
          {localization(97)}
        </div>
        </div>
      );
    } else {
      return (
        <div className="parent-info-content">
          <div className="parent-info-label">
            <FontAwesome className='' name='user' />{localization(681)}
          </div>
          <div className="parent-info-data">
            <div className="parent-info-text">
              {this.state.contact}
            </div>
          </div>
        </div>
      );
    }
  }
}
