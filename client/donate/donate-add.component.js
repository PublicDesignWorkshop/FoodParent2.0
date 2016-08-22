import React from 'react';
import AltContainer from 'alt-container';

require('./donate-add.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import LocationName from './../location/location-name.component';
import DonateInfo from './../donate/donate-info.component';
// import NoteGraph from './../donate/donate-graph.component';

let TreeActions = require('./../actions/tree.actions');
let LocationActions = require('./../actions/location.actions');
let LocationStore = require('./../stores/location.store');
let DonateActions = require('./../actions/donate.actions');
let DonateStore = require('./../stores/donate.store');
let AuthStore = require('./../stores/auth.store');


export default class DonateAdd extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateDonateStore = this.updateDonateStore.bind(this);
  }
  componentWillMount() {
    TreeActions.reset();
    DonateActions.setSelected(null);
    this.updateProps(this.props);
  }
  componentDidMount () {
    DonateStore.listen(this.updateDonateStore);
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    if (props.location && (DonateStore.getState().temp == null || DonateStore.getState().temp.id != 0)) {
      DonateActions.createTempDonate.defer(LocationStore.getState().temp.id);
    }
  }
  componentWillUnmount() {
    DonateStore.unlisten(this.updateDonateStore);
  }
  updateDonateStore() {
    this.forceUpdate();
  }
  render () {
    return (
      <div className="donate-add-wrapper">
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
            donate: function(props) {
              return {
                store: DonateStore,
                value: DonateStore.getState().temp
              }
            },
          }
        }>
          <DonateInfo editing={true} />
        </AltContainer>
      </div>
    );
  }
}
