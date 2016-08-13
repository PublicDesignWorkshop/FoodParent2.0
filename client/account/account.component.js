import React from 'react';

require('./account.component.scss');

let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';
import ParentInfo from './../parent/parent-info.component';


export default class Account extends React.Component {
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
      <div className="account-wrapper">
        <div className="right">
          <ParentInfo />
          <div className="or">
            OR
          </div>
          <div className="solid-button-group double-left-right-padding">
            <div className="solid-button solid-button-red" onClick={() => {
              // TreeActions.setEditing(TreeStore.getState().selected, false);
              // this.setState({editing: false});
            }}>
              {localization(677) /* LOG OUT */}
            </div>
          </div>
        </div>
        <div className="left">
          STATS
        </div>
      </div>
    );
  }
}
