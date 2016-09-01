import React from 'react';
import AltContainer from 'alt-container';

require('./recipient-map.component.scss');

let MapStore = require('./../stores/map.store');
let AuthStore = require('./../stores/auth.store');
let LocationStore = require('./../stores/location.store');
let TreeActions = require('./../actions/tree.actions');
let FoodActions = require('./../actions/food.actions');
let TreeStore = require('./../stores/tree.store');
let LocationActions = require('./../actions/location.actions');
let ServerSetting = require('./../../setting/server.json');


import MapRecipient from './../maps/map-recipient.component';
import DonationPanel from './donation-panel.component';


export default class RecipientMap extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    if (!AuthStore.getState().auth.isManager()) {
      this.context.router.replace({pathname: ServerSetting.uBase + '/'});
      return;
    }
    TreeActions.reset();
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
    if (!AuthStore.getState().auth.isManager()) {
      return <div></div>;
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
        <DonationPanel open={false}/>
      </div>
    );
  }
}
RecipientMap.contextTypes = {
    router: React.PropTypes.object.isRequired
}
