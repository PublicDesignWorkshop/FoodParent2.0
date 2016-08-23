import React from 'react';
import $ from 'jquery';


let ServerSetting = require('./../../setting/server.json');
require('./recipient-add-panel.component.scss');
require('./../message/popup.component.scss');
var FontAwesome = require('react-fontawesome');
import { DONATIONADDMODE } from './../utils/enum';
let LocationActions = require('./../actions/location.actions');
import { localization } from './../utils/localization';
import LocationAddInfo from './../location/location-add-info.component';
import DonationControl from './donation-control.component';

export default class RecipientAddPanel extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    // this.setState({open: false});
  }
  componentDidMount () {
    // this.updateProps(this.props);
    $(document).on('keyup',function(event) {
      if (event.keyCode == 27) {
        this.context.router.push({pathname: ServerSetting.uBase + '/'});
      }
    }.bind(this));
  }
  componentWillUnmount() {
    $(document).off('keyup');
  }
  componentWillReceiveProps(nextProps) {
    // this.updateProps(nextProps);
  }
  updateProps(props) {
    // this.setState({open: props.open});
  }
  render () {
    let open = "";
    if (this.props.open) {
      open = " open";
    }
    let info, close, body;
    // Close
    close = <div className="icon-group close" onClick={() => {
      LocationActions.setCode(0);
      this.context.router.push({pathname: ServerSetting.uBase + '/recipients'});
    }}>
      <FontAwesome className="icon" name='close' />
    </div>;
    // Info
    info = <div className="icon-group" onClick={() => {
      this.context.router.push({pathname: ServerSetting.uBase + '/addrecipient', hash: "#info"});
    }}>
      <FontAwesome className="icon icon-info-circle" name='info-circle' />
      <span className="icon-text">
        Info
      </span>
    </div>;
    if (this.props.mode == DONATIONADDMODE.INFO) {
      // Info
      info = <div className="icon-group active">
        <FontAwesome className="icon icon-info-circle" name='info-circle' />
        <span className="icon-text">
          {localization(44)}
        </span>
      </div>;
      body = <LocationAddInfo />;
    }
    return (
      <div className={"recipient-add-panel-wrapper" + open}>
        <div className="left">
          <DonationControl adding={true} />
        </div>
        <div className="right">
          <div className="menu">
            {info}
            {close}
          </div>
          {body}
        </div>
      </div>
    );
  }
}
RecipientAddPanel.contextTypes = {
    router: React.PropTypes.object.isRequired
}
