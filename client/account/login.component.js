import React from 'react';

require('./login.component.scss');

let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';

import Instruction from './instruction.component';



export default class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    // this.setState({loginText: ""});
    // localization(993, window.navigator.userLanguage || window.navigator.language, function(response) {
    //   this.setState({loginText: response});
    // }.bind(this));
  }
  componentDidMount () {

  }
  componentWillReceiveProps() {

  }
  render () {
    return (
      <div className="login-wrapper">
        <div className="right">
          Login
        </div>
        <div className="left">
          <Instruction />
        </div>
      </div>
    );
  }
}
