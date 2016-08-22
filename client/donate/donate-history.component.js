import React from 'react';
import AltContainer from 'alt-container';

require('./donate-history.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import LocationName from './../location/location-name.component';
import DonateList from './../donate/donate-list.component';
// import NoteGraph from './../note/note-graph.component';

let LocationActions = require('./../actions/location.actions');
let LocationStore = require('./../stores/location.store');
let DonateActions = require('./../actions/donate.actions');
let DonateStore = require('./../stores/donate.store');
let AuthStore = require('./../stores/auth.store');


export default class DonateHistory extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateDonateStore = this.updateDonateStore.bind(this);
  }
  componentWillMount() {
    this.updateProps(this.props);
  }
  componentDidMount () {
    DonateStore.listen(this.updateDonateStore);
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    if (props.location)
      DonateActions.fetchDonatesFromLocationIds.defer(props.location.id);
  }
  componentWillUnmount() {
    DonateStore.unlisten(this.updateDonateStore);
    DonateActions.setSelected(null);
  }
  updateDonateStore() {
    this.forceUpdate();
  }
  render () {
    return (
      <div className="donate-history-wrapper">
        <AltContainer stores={
          {
            location: function(props) {
              return {
                store: LocationStore,
                value: LocationStore.getState().temp
              }
            }
          }
        }>
          <LocationName editing={false} />
        </AltContainer>
        <AltContainer stores={
          {
            donates: function(props) {
              return {
                store: DonateStore,
                value: DonateStore.getState().donates
              }
            },
            donate: function(props) {
              return {
                store: DonateStore,
                value: DonateStore.getState().temp
              }
            },
          }
        }>
          <DonateList />
        </AltContainer>
      </div>
    );
  }
}

DonateHistory.contextTypes = {
    router: React.PropTypes.object.isRequired
}


//<NoteGraph />
