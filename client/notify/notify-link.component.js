import React from 'react';
import AltContainer from 'alt-container';
import moment from 'moment';


require('./notify-link.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let TreeActions = require('./../actions/tree.actions');

import { localization } from './../utils/localization';
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';


export default class NotifyLink extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.selectNotify = this.selectNotify.bind(this);
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
    this.setState({item: props.item});
  }
  selectNotify() {
    this.context.router.push({pathname: ServerSetting.uBase + '/notify/' + this.state.item.id});
  }
  render () {
    let style = "";
    let content;
    switch(this.props.type) {
      case NOTETYPE.UPDATE:
        style = " notify-link-brown";
        content = <span>{(this.state.item.amount * ServerSetting.fGToLBS).toFixed(ServerSetting.iAmountPrecision)} lbs. of <span className="tag tag-brown">{this.state.item.name} {"#" + this.state.item.id}</span> on {moment(this.state.item.date).format(ServerSetting.sUIDateFormat)}</span>
        break;
      case NOTETYPE.PICKUP:
        style = " notify-link-brown";
        content = <span>{(this.state.item.amount * ServerSetting.fGToLBS).toFixed(ServerSetting.iAmountPrecision)} lbs. of <span className="tag tag-brown">{this.state.item.name} {"#" + this.state.item.id}</span> on {moment(this.state.item.date).format(ServerSetting.sUIDateFormat)}</span>
        break;
    }
    return (
      <div className={"notify-link-wrapper" + style} onClick={this.selectNotify}>
        {content}
      </div>
    );
  }
}
NotifyLink.contextTypes = {
    router: React.PropTypes.object.isRequired
}
