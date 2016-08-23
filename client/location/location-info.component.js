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
// import TreeFlag from './tree-flag.component';
// import TreeOwnership from './tree-ownership.component';

let LocationActions = require('./../actions/location.actions');
let LocationStore = require('./../stores/location.store');
let AuthStore = require('./../stores/auth.store');


export default class LocationInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({selected: LocationStore.getState().selected, editing: false, editable: AuthStore.getState().auth.isManager()});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    if (LocationStore.getState().selected != this.state.selected) {
      this.setState({selected: LocationStore.getState().selected, editing: false, editable: AuthStore.getState().auth.isManager()});
    }
  }
  render () {
    let actions;
    if (this.state.editable) {
      actions = <div>
        <div className="solid-button-group">
          <div className="solid-button solid-button-green" onClick={() => {
            this.setState({editing: true});
            LocationActions.setEditing(LocationStore.getState().selected, true);
          }}>
            {localization(928) /* EDIT */}
          </div>
        </div>
      </div>;
    }
    if (this.state.editing) {
      if (AuthStore.getState().auth.isAdmin()) {
        actions = <div>
          <div className="solid-button-group">
            <div className="solid-button solid-button-green" onClick={() => {
              LocationActions.updateLocation(LocationStore.getState().temp);
              this.setState({editing: false});
            }}>
              {localization(930) /* SAVE */}
            </div>
            <div className="solid-button solid-button-green" onClick={() => {
              LocationActions.setSelected(LocationStore.getState().selected);
              this.setState({editing: false});
            }}>
              {localization(933) /* CANCEL */}
            </div>
          </div>
          <div className="danger-zone">{localization(927) /*DANGER ZONE */}</div>
          <div className="solid-button-group">
            <div className="solid-button solid-button-red" onClick={() => {
              this.context.router.push({pathname: window.location.pathname, hash: "#delete"});
            }}>
              {localization(966) /* DELETE THIS LOCATION */}
            </div>
          </div>
        </div>;
      } else {
        actions = <div>
          <div className="solid-button-group">
            <div className="solid-button solid-button-green" onClick={() => {
              LocationActions.updateLocation(LocationStore.getState().temp);
              this.setState({editing: false});
            }}>
              {localization(930) /* SAVE */}
            </div>
            <div className="solid-button solid-button-green" onClick={() => {
              LocationActions.setSelected(LocationStore.getState().selected);
              this.setState({editing: false});
            }}>
              {localization(933) /* CANCEL */}
            </div>
          </div>
        </div>;
      }
    }
    let info;
    if (this.state.editable) {
      info = <AltContainer stores={
        {
          location: function(props) {
            return {
              store: LocationStore,
              value: LocationStore.getState().temp
            }
          }
        }
      }>
        <LocationName editing={this.state.editing} />
        <LocationLocation editing={this.state.editing} />
        <LocationAddress editing={this.state.editing} />
        <LocationDescription editing={this.state.editing} />
      </AltContainer>
    } else {
      info = <AltContainer stores={
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
        <LocationLocation editing={false} />
        <LocationAddress editing={false} />
        <LocationDescription editing={false} />
      </AltContainer>
    }
    return (
      <div className="location-info-wrapper">
        {info}
        {actions}
      </div>
    );
  }
}

LocationInfo.contextTypes = {
    router: React.PropTypes.object.isRequired
}
