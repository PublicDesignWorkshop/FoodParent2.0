import React from 'react';
import AltContainer from 'alt-container';
import * as _ from 'underscore';

require('./donate-info.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';
// import NoteType from './note-type.component';
// import NoteRate from './note-rate.component';
import DonateComment from './donate-comment.component';
import DonateDate from './donate-date.component';
import DonateAmount from './donate-amount.component';
import DonateFood from './donate-food.component';
import DonateSource from './donate-source.component';
// import DonateImage from './donate-image.component';
import DonateAuthor from './donate-author.component';

let LocationActions = require('./../actions/location.actions');
let LocationStore = require('./../stores/location.store');
let DonateActions = require('./../actions/donate.actions');
let DonateStore = require('./../stores/donate.store');
let AuthStore = require('./../stores/auth.store');
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');

export default class DonateInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    let editing = false;
    if (this.props.editing) {
      editing = this.props.editing;
    }
    this.setState({editing: editing, remove: false});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {

  }
  componentWillUnmount() {
    this.props.donate.editing = false;
  }
  render () {
    let style = "";
    let actions;
    let popup;
    let buttonStyle;
    if (this.props.donate) {
      switch(this.props.donate.type) {
        case NOTETYPE.DONATE:
          style = " donate-info-brown";
        break;
      }
      if (this.props.donate.id == 0) {
        style += " scrollable";
      }
      switch(this.props.donate.type) {
        case NOTETYPE.DONATE:
          buttonStyle = " solid-button-green";
          break;
      }
    }
    if (this.props.donate) {
      if (this.state.editing && this.props.donate.id) {
        actions = <div>
          <div className="solid-button-group same-border-color-padding">
            <div className={"solid-button" + buttonStyle} onClick={() => {
              let trees = _.without(this.props.donate.trees, 0);
              if (trees.length == 0) {
                displayFailMessage(localization(39));
                DonateActions.setCode(39);
                return;
              }
              if (parseFloat(this.props.donate.amount).toFixed(ServerSetting.iAmountPrecision) <= 0) {
                displayFailMessage(localization(602));
                DonateActions.setCode(602);
                return;
              }
              this.setState({editing: false, remove: false});
              this.props.donate.editing = false;
              DonateActions.updateDonate(DonateStore.getState().temp);
            }}>
              {localization(930) /* SAVE */}
            </div>
            <div className={"solid-button" + buttonStyle} onClick={() => {
              this.setState({editing: false, remove: false});
              DonateActions.setSelected(this.props.donate.id);
              this.props.donate.editing = false;
            }}>
              {localization(933) /* CANCEL */}
            </div>
          </div>
          <div className="danger-zone">{localization(927) /* DELETE THIS DONATE */}</div>
          <div className="solid-button-group">
            <div className="solid-button solid-button-red" onClick={() => {
              this.setState({remove: true});
              // this.context.router.push({pathname: window.location.pathname, hash: "#delete"});
            }}>
              {localization(931) /* DELETE THIS DONATE */}
            </div>
          </div>
        </div>;
      } else if (this.state.editing && this.props.donate.id == 0) { // Create a new donate.
        actions = <div>
          <div className="solid-button-group same-border-color-padding">
            <div className={"solid-button" + buttonStyle} onClick={() => {
              let trees = _.without(this.props.donate.trees, 0);
              if (trees.length == 0) {
                displayFailMessage(localization(39));
                DonateActions.setCode(39);
                return;
              }
              if (parseFloat(this.props.donate.amount).toFixed(ServerSetting.iAmountPrecision) <= 0) {
                displayFailMessage(localization(602));
                DonateActions.setCode(602);
                return;
              }
              this.setState({editing: false, remove: false});
              this.props.donate.editing = false;
              DonateActions.createDonate.defer(DonateStore.getState().temp);
            }}>
              {localization(930) /* SAVE */}
            </div>
          </div>
        </div>;
      } else {
        if (this.props.donate.isEditable()) {
          actions = <div className="solid-button-group same-border-color-padding">
            <div className={"solid-button" + buttonStyle} onClick={() => {
              this.setState({editing: true});
              this.props.donate.editing = true;
            }}>
              {localization(928) /* EDIT */}
            </div>
            <div className={"solid-button" + buttonStyle} onClick={() => {
              DonateActions.setSelected(null);
              this.props.donate.editing = false;
            }}>
              {localization(72) /* CLOSE */}
            </div>
          </div>;
        } else {
          actions = <div className="solid-button-group same-border-color-padding">
            <div className={"solid-button" + buttonStyle} onClick={() => {
              DonateActions.setSelected(null);
              this.props.donate.editing = false;
            }}>
              {localization(72) /* CLOSE */}
            </div>
          </div>;
        }
      }
    }
    if (this.state.remove) {
      popup = <div className="popup-wrapper popup-red open">
        <div className="popup-message">
          <span dangerouslySetInnerHTML={{__html: localization(606)}} />
          <span className="popup-button" onClick={()=> {
            DonateActions.deleteDonate(DonateStore.getState().temp);
          }}>
            {localization(931)}
          </span>
          <span className="popup-button" onClick={()=> {
            this.setState({remove: false});
          }}>
            {localization(933)}
          </span>
        </div>
      </div>;
    }
    let authorEditing = false;
    if (this.props.donate && this.props.donate.id == 0 && AuthStore.getState().auth.id == 0 && AuthStore.getState().auth.contact == "") {
      authorEditing = true;
    }
    if (this.props.donate && this.state.editing && this.props.donate.isEditable() && AuthStore.getState().auth.id == 0 && AuthStore.getState().auth.contact == "") {
      authorEditing = true;
    }
    if (this.props.donate) {
      return (
        <div className={"donate-info-wrapper" + style}>

          <DonateFood donate={this.props.donate} editing={this.state.editing} />
          <AltContainer stores={
            {
              trees: function(props) {
                return {
                  store: TreeStore,
                  value: TreeStore.getState().trees
                }
              }
            }
          }>
            <DonateSource donate={this.props.donate} editing={this.state.editing} />
          </AltContainer>
          <DonateAmount donate={this.props.donate} editing={this.state.editing} />
          <DonateComment donate={this.props.donate} editing={this.state.editing} />
          <DonateDate donate={this.props.donate} editing={this.state.editing} />
          <DonateAuthor donate={this.props.donate} editing={authorEditing} />
          {actions}
          {popup}
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
}

// In case of adding image view for donation.
// <DonateImage donate={this.props.donate} editing={this.state.editing} />
