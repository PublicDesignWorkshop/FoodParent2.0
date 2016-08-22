import React from 'react';
import AltContainer from 'alt-container';

require('./recipient-map.component.scss');

let MapStore = require('./../stores/map.store');
let LocationStore = require('./../stores/location.store');
let LocationActions = require('./../actions/location.actions');


import MapRecipient from './../maps/map-recipient.component';
import DonationPanel from './donation-panel.component';


export default class RecipientMap extends React.Component {
  constructor(props, context) {
    super(props, context);
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
    LocationActions.fetchLocations();
    // TreeActions.setSelected.defer(parseInt(props.params.treeId));
  }
  render () {
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
            }
          }
        }>
          <MapRecipient />
        </AltContainer>
        <DonationPanel open={false}/>
      </div>
    );
  }
}
