import React from 'react';

require('./account.component.scss');

let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';
import ParentInfo from './../parent/parent-info.component';

let AuthActions = require('./../actions/auth.actions');
import { MAPTYPE, AUTHTYPE } from './../utils/enum';
let MapStore = require('./../stores/map.store');
let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let LocationStore = require('./../stores/location.store');



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
    let close, info
    // Close
    close = <div className="icon-group close" onClick={() => {
      if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
        TreeActions.setCode(0);
        if (TreeStore.getState().selected) {
          this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + TreeStore.getState().selected});
        } else {
          this.context.router.push({pathname: ServerSetting.uBase + '/'});
        }
        // this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + parseInt(searchText)});
      } else if (MapStore.getState().latestMapType == MAPTYPE.DONATION) {
        if (LocationStore.getState().selected > 0) {
          this.context.router.push({pathname: ServerSetting.uBase + '/recipient/' + LocationStore.getState().selected});
        } else {
          this.context.router.push({pathname: ServerSetting.uBase + '/recipients'});
        }
      }
    }}>
      <FontAwesome className="icon" name='close' />
    </div>;
    // Info
    info = <div className="icon-group active">
      <FontAwesome className="icon icon-info-circle" name='info-circle' />
      <span className="icon-text">
        {localization(676) /* Parent Info */}
      </span>
    </div>;
    return (
      <div className="account-wrapper">
        <div className="right">
          <div className="menu">
            {info}
            {close}
          </div>
          <ParentInfo />
          <div className="or">
            OR
          </div>
          <div className="solid-button-group double-left-right-padding">
            <div className="solid-button solid-button-red" onClick={() => {
              AuthActions.processLogout();
            }}>
              {localization(677) /* LOG OUT */}
            </div>
          </div>
        </div>
        <div className="left">
        </div>
      </div>
    );
  }
}


Account.contextTypes = {
    router: React.PropTypes.object.isRequired
}
