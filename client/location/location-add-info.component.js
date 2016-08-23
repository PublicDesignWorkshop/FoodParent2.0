import React from 'react';
import AltContainer from 'alt-container';

require('./location-info.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import LocationName from './location-name.component';
import LocationLocation from './location-location.component';
import LocationAddress from './location-address.component';
import LocationDescription from './location-description.component';

let LocationActions = require('./../actions/location.actions');
let LocationStore = require('./../stores/location.store');
let AuthStore = require('./../stores/auth.store');


export default class LocationAddInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({selected: LocationStore.getState().selected});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    if (LocationStore.getState().selected != this.state.selected) {
      this.setState({selected: LocationStore.getState().selected});
    }
  }
  render () {
    let actions = <div>
    <div className="solid-button-group">
      <div className="solid-button solid-button-green" onClick={() => {
        LocationActions.createLocation(LocationStore.getState().temp);
      }}>
        {localization(930) /* SAVE */}
      </div>
    </div>
      <div className="solid-button-group">
        <div className="solid-button solid-button-red" onClick={() => {
          this.context.router.push({pathname: ServerSetting.uBase + '/recipients'});
        }}>
          {localization(933) /* CANCEL */}
        </div>
      </div>
    </div>;
    return (
      <div className="recipient-info-wrapper">
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
          <LocationName editing={true} />
          <LocationLocation editing={true} />
          <LocationAddress editing={true} />
          <LocationDescription editing={true} />
        </AltContainer>
        {actions}
      </div>
    );
  }
}

LocationAddInfo.contextTypes = {
    router: React.PropTypes.object.isRequired
}
