import React from 'react';
import AltContainer from 'alt-container';
import moment from 'moment';


require('./notify-line.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';


export default class NotifyLine extends React.Component {
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
    if (this.state.item.disabled == true) {
      this.state.item.disabled = false;
    } else {
      this.state.item.disabled = true;
    }
    this.setState({item: this.state.item});
    // NoteActions.setSelected(this.props.note.id);
    // if (this.props.link) {
    //   this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + TreeStore.getState().selected, hash: "#history"});
    // }
  }
  render () {
    let style = "";
    let content;
    switch(this.props.type) {
      case NOTETYPE.UPDATE:
        style = " notify-line-green";
        content = <span>{this.state.item.amount} lbs. of <span className="tag tag-green">{this.state.item.name} {"#" + this.state.item.id}</span> on {moment(this.state.item.date).format(ServerSetting.sUIDateFormat)}</span>
        break;
      case NOTETYPE.PICKUP:
        style = " notify-line-brown";
        content = <span>{this.state.item.amount} lbs. of <span className="tag tag-brown">{this.state.item.name} {"#" + this.state.item.id}</span> on {moment(this.state.item.date).format(ServerSetting.sUIDateFormat)}</span>
        break;
    }
    let active = true;
    if (this.state.item.disabled) {
      active = false;
    }
    if (active) {
      return (
        <div className={"notify-line-wrapper" + style} onClick={this.selectNotify}>
          <FontAwesome className='icon' name='check-square-o' />
          {content}
        </div>
      );
    } else {
      return (
        <div className={"notify-line-wrapper" + style} onClick={this.selectNotify}>
          <FontAwesome className='icon' name='square-o' />
          {content}
        </div>
      );
    }
  }
}
NotifyLine.contextTypes = {
    router: React.PropTypes.object.isRequired
}
