import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./parent-password.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
let PersonStore = require('./../stores/person.store');
let PersonActions = require('./../actions/person.actions');


export default class ParentPassword extends React.Component {
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
      this.setState({password: props.parent.password, password2: props.parent.password2});
    } else {
      this.setState({password: "", password2: ""});
    }
  }
  updateAttribute(newPassword) {
    newPassword = newPassword.trim();
    let prevPassword = this.props.parent.password;
    this.props.parent.password = newPassword;
    this.setState({password: this.props.parent.password});
    if (prevPassword != newPassword) {
      PersonActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  updateAttribute2(newPassword) {
    newPassword = newPassword.trim();
    let prevPassword = this.props.parent.password2;
    this.props.parent.password2 = newPassword;
    this.setState({password2: this.props.parent.password2});
    if (prevPassword != newPassword) {
      PersonActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    if (this.props.editing) {
      let error;
      if (this.state.password.length < 5) {
        error = <div className="error-text">{localization(1006)}</div>;
      } else if (this.state.password != this.state.password2) {
        error = <div className="error-text">{localization(1005)}</div>;
      }
      return (
        <div className="parent-info-content">
          <div className="parent-info-label">
            <FontAwesome className='' name='lock' />{localization(690)}
          </div>
          <div className="parent-info-data">
            <input type="password" name="password" className="parent-info-input" placeholder={localization(691)}
              value={this.state.password}
              onChange={(event: any)=> {
                this.updateAttribute(event.target.value);
              }} />
          </div>
          <div className="parent-info-data">
            <input type="password" name="password2" className="parent-info-input" placeholder={localization(1004)}
              value={this.state.password2}
              onChange={(event: any)=> {
                this.updateAttribute2(event.target.value);
              }} />
          </div>
          {error}
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}
