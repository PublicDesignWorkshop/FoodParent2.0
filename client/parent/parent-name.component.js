import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./parent-name.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
let PersonStore = require('./../stores/person.store');
let PersonActions = require('./../actions/person.actions');


export default class ParentName extends React.Component {
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
      this.setState({name: props.parent.name});
    } else {
      this.setState({name: " "});
    }
  }
  updateAttribute(newName) {
    let prevName = this.props.parent.name;
    this.props.parent.name = newName;
    this.setState({name: this.props.parent.name});
    if (prevName != newName) {
      PersonActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="parent-info-content">
          <div className="parent-info-label">
            <FontAwesome className='' name='microphone' />{localization(680)}
          </div>
          <div className="parent-info-data">
            <input type="text" name="name" className="parent-info-input" placeholder={localization(682)}
              value={this.state.name}
              autoComplete
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
            <FontAwesome className='' name='microphone' />{localization(680)}
          </div>
          <div className="parent-info-data">
            <div className="parent-info-text">
              {this.state.name}
            </div>
          </div>
        </div>
      );
    }
  }
}
