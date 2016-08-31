import React from 'react';
import AltContainer from 'alt-container';
import $ from 'jquery';


let ServerSetting = require('./../../setting/server.json');
require('./donation-panel.component.scss');
var FontAwesome = require('react-fontawesome');
import { DONATIONDETAILMODE } from './../utils/enum';
let LocationActions = require('./../actions/location.actions');
let AuthStore = require('./../stores/auth.store');
let LocationStore = require('./../stores/location.store');
let DonateStore = require('./../stores/donate.store');

import DonationControl from './donation-control.component';
import LocationInfo from './../location/location-info.component';
import DonateHistory from './../donate/donate-history.component';
import DonateAdd from './../donate/donate-add.component';
import RecipientRecentDonate from './recipient-recent-donate.component';
//
// import TreeRecentPost from './../tree/tree-recent-post.component';
// import TreeRecentPickup from './../tree/tree-recent-pickup.component';
// import TreeParentSummary from './../tree/tree-parent-summary.component';
// import TreeAdopt from './../tree/tree-adopt.component';

export default class DonationPanel extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    this.setState({open: false});
  }
  componentDidMount () {
    this.updateProps(this.props);
    $(document).on('keyup',function(event) {
      if (event.keyCode == 27) {
        this.context.router.push({pathname: ServerSetting.uBase + '/recipients'});
      }
    }.bind(this));
  }
  componentWillUnmount() {
    $(document).off('keyup');
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
    let info, post, history, close, body, popup;
    // Close
    close = <div className="icon-group close" onClick={() => {
      LocationActions.setCode(0);
      this.context.router.push({pathname: ServerSetting.uBase + '/recipients'});
    }}>
      <FontAwesome className="icon" name='close' />
    </div>;
    // Info
    info = <div className="icon-group" onClick={() => {
      this.context.router.push({pathname: window.location.pathname});
    }}>
      <FontAwesome className="icon icon-info-circle" name='info-circle' />
      <span className="icon-text">
        Info
      </span>
    </div>;
    // Post
    post = <div className="icon-group" onClick={() => {
      this.context.router.push({pathname: window.location.pathname, hash: "#post"});
    }}>
      <FontAwesome className="icon icon-group" name='pencil-square' />
      <span className="icon-text">
        Post
      </span>
    </div>;
    // History
    history = <div className="icon-group" onClick={() => {
      this.context.router.push({pathname: window.location.pathname, hash: "#history"});
    }}>
      <FontAwesome className="icon icon-line-chart" name='line-chart' />
      <span className="icon-text">
        History
      </span>
    </div>;
    if (this.props.mode == DONATIONDETAILMODE.INFO) {
      // Info
      info = <div className="icon-group active">
        <FontAwesome className="icon icon-info-circle" name='info-circle' />
        <span className="icon-text">
          Info
        </span>
      </div>;
      // Body
      body = <div className="body-scroll">
        <AltContainer stores={
          {
            LocationStore: LocationStore,
          }
        }>
          <LocationInfo />
        </AltContainer>
        <AltContainer stores={
          {
            donates: function(props) {
              return {
                store: DonateStore,
                value: DonateStore.getState().donates
              }
            }
          }
        }>
          <RecipientRecentDonate />
        </AltContainer>
      </div>;
      // body = <div className="body-scroll">
      //   // <AltContainer stores={
      //   //   {
      //   //     LocationStore: LocationStore,
      //   //   }
      //   // }>
      //   //   <LocationInfo />
      //   // </AltContainer>
      //   // <AltContainer stores={
      //   //   {
      //   //     notes: function(props) {
      //   //       return {
      //   //         store: NoteStore,
      //   //         value: NoteStore.getState().notes
      //   //       }
      //   //     }
      //   //   }
      //   // }>
      //   //   <TreeRecentPost />
      //   //   <TreeRecentPickup />
      //   // </AltContainer>
      //   // <AltContainer stores={
      //   //   {
      //   //     tree: function(props) {
      //   //       return {
      //   //         store: TreeStore,
      //   //         value: TreeStore.getState().temp
      //   //       }
      //   //     }
      //   //   }
      //   // }>
      //   //   <TreeParentSummary />
      //   //   <TreeAdopt />
      //   // </AltContainer>
      // </div>;
    }
    if (this.props.mode == DONATIONDETAILMODE.POST) {
      // Post
      post = <div className="icon-group active">
        <FontAwesome className="icon icon-group" name='pencil-square' />
        <span className="icon-text">
          Post
        </span>
      </div>;
      // Body
      body = <AltContainer stores={
        {
          location: function(props) {
            return {
              store: LocationStore,
              value: LocationStore.getState().temp
            }
          }
        }
      }>
        <DonateAdd />
      </AltContainer>;
    }
    if (this.props.mode == DONATIONDETAILMODE.HISTORY) {
      // History
      history = <div className="icon-group active">
        <FontAwesome className="icon icon-line-chart" name='line-chart' />
        <span className="icon-text">
          History
        </span>
      </div>;
      // Body
      body = <AltContainer stores={
        {
          location: function(props) {
            return {
              store: LocationStore,
              value: LocationStore.getState().temp
            }
          }
        }
      }>
        <DonateHistory />
      </AltContainer>;
    }
    return (
      <div className={"donation-panel-wrapper" + open + wide}>
        <div className="left">
          <DonationControl />
        </div>
        <div className="right">
          <div className="menu">
            {info}
            {post}
            {history}
            {close}
          </div>
          {body}
        </div>
      </div>
    );
  }
}
DonationPanel.contextTypes = {
    router: React.PropTypes.object.isRequired
}
