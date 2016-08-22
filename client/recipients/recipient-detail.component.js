import $ from 'jquery';
import React from 'react';
import AltContainer from 'alt-container';

require('./recipient-detail.component.scss');
let TreeActions = require('./../actions/tree.actions');
let MapStore = require('./../stores/map.store');
let TreeStore = require('./../stores/tree.store');
let LocationStore = require('./../stores/location.store');
let DonateStore = require('./../stores/donate.store');
let LocationActions = require('./../actions/location.actions');
// let NoteActions = require('./../actions/note.actions');
import { DONATIONDETAILMODE } from './../utils/enum';
import { localization } from './../utils/localization';

import MapRecipient from './../maps/map-recipient.component';
import DonationPanel from './donation-panel.component';

export default class RecipientDetail extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateNoteStore = this.updateNoteStore.bind(this);
  }
  componentWillMount() {
    TreeActions.reset();
    this.updateProps(this.props);
  }
  componentDidMount () {
    LocationStore.listen(this.updateNoteStore);
    // DonateStore.listen(this.updateNoteStore);
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);

  }
  componentWillUnmount() {
    LocationStore.unlisten(this.updateNoteStore);
    // DonateStore.unlisten(this.updateNoteStore);
  }
  updateNoteStore() {
    this.forceUpdate();
  }
  updateProps(props) {
    $('.donation-panel-wrapper').removeClass('close');
    let mode;
    let remove = false;
    LocationActions.fetchLocations(parseInt(props.params.recipientId));
    // NoteActions.fetchRecentNotesFromTreeId.defer(parseInt(props.params.treeId));
    // Instead of changing url, change # hashtag to remove extra rendering process.
    switch(props.location.hash.replace('#', '')) {
      case "":
        mode = DONATIONDETAILMODE.INFO;
        break;
      case "post":
        mode = DONATIONDETAILMODE.POST;
        break;
      case "history":
        mode = DONATIONDETAILMODE.HISTORY;
        break;
      case "delete":
        remove = true;
        mode = DONATIONDETAILMODE.INFO;
        break;
      default:
        mode = DONATIONDETAILMODE.INFO;
        break;
    }
    this.setState({mode: mode, remove: remove});
  }
  render () {
    let action;
    if (this.state.remove) {
      action = <div className="popup-wrapper popup-red open">
        <div className="popup-message">
          <span dangerouslySetInnerHTML={{__html: localization(666)}} />
          <span className="popup-button" onClick={()=> {
            LocationActions.deleteLocation(LocationStore.getState().temp);
          }}>
            {localization(931)}
          </span>
          <span className="popup-button" onClick={()=> {
            this.context.router.push({pathname: window.location.pathname});
          }}>
            {localization(933)}
          </span>
        </div>
      </div>;
    }
    let open = false;
    if (LocationStore.getState().temp != null) {
      open = true;
    }
    return (
      <div className="recipient-map-wrapper">
        <AltContainer stores={
          {
            position: function(props) {
              return {
                store: MapStore,
                value: MapStore.getState().location
              };
            },
            locations: function(props) {
              return {
                store: LocationStore,
                value: LocationStore.getState().locations
              }
            },
            selected: function(props) {
              return {
                store: LocationStore,
                value: LocationStore.getState().selected
              }
            },
            trees: function(props) {
              return {
                store: TreeStore,
                value: TreeStore.getState().trees
              }
            }
          }
        }>
          <MapRecipient />
        </AltContainer>
        <DonationPanel open={open} mode={this.state.mode} />
        {action}
      </div>
    );
  }
}
RecipientDetail.contextTypes = {
    router: React.PropTypes.object.isRequired
}
