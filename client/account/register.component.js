import React from 'react';

require('./register.component.scss');

let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';


export default class Register extends React.Component {
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
      <div className="register-wrapper">
        Register
      </div>
    );
  }
}
