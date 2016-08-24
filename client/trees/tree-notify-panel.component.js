import React from 'react';
import AltContainer from 'alt-container';
import $ from 'jquery';


let ServerSetting = require('./../../setting/server.json');
require('./tree-notify-panel.component.scss');
var FontAwesome = require('react-fontawesome');
import { TREEDETAILMODE } from './../utils/enum';
let TreeActions = require('./../actions/tree.actions');
let AuthStore = require('./../stores/auth.store');
let TreeStore = require('./../stores/tree.store');
let NoteStore = require('./../stores/note.store');
let DonateStore = require('./../stores/donate.store');

import TreeControl from './tree-control.component';
import TreeInfo from './../tree/tree-info.component';
import TreeHistory from './../tree/tree-history.component';
import NoteAdd from './../note/note-add.component';

import TreeRecentPost from './../tree/tree-recent-post.component';
import TreeRecentPickup from './../tree/tree-recent-pickup.component';
import TreeRecentDonate from './../tree/tree-recent-donate.component';
import TreeParentSummary from './../tree/tree-parent-summary.component';
import TreeAdopt from './../tree/tree-adopt.component';
import { localization } from './../utils/localization';
import NotifyList from './../notify/notify-list.component';


export default class TreeNotifyPanel extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    this.setState({open: false});
  }
  componentDidMount () {
    this.updateProps(this.props);
    // $(document).on('keyup',function(event) {
    //   if (event.keyCode == 27) {
    //     this.context.router.push({pathname: ServerSetting.uBase + '/'});
    //   }
    // }.bind(this));
  }
  componentWillUnmount() {
    // $(document).off('keyup');
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    this.setState({open: props.open});
  }
  render () {
    let open = "";
    let wide = "";
    if (this.state.open) {
      open = " open";
    }
    let notify, close, body;
    // Close
    close = <div className="icon-group close" onClick={() => {
      TreeActions.setCode(0);
      this.context.router.push({pathname: ServerSetting.uBase + '/'});
    }}>
      <FontAwesome className="icon" name='close' />
    </div>;
    // Notify
    notify = <div className="icon-group active">
      <FontAwesome className="icon icon-info-circle" name='paper-plane-o' />
      <span className="icon-text">
        {localization(35)}
      </span>
    </div>;
    return (
      <div className={"tree-notify-panel-wrapper" + open + wide}>
        <div className="left">
          <TreeControl />
        </div>
        <div className="right">
          <div className="menu">
            {notify}
            {close}
          </div>
            <NotifyList />
        </div>
      </div>
    );
  }
}
TreeNotifyPanel.contextTypes = {
    router: React.PropTypes.object.isRequired
}
