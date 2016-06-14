import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './location.component.css';
var Settings = require('./../../constraints/settings.json');

import LocationNameComponent from './location-name.component';
import LocationLocationComponent from './location-location.component';
import LocationAddressComponent from './location-address.component';
import LocationDescriptionComponent from './location-description.component';
import DonateListComponent from './../donate/donate-list.component';

import { LocationModel, locationStore } from './../../stores/location.store';
import { authStore } from './../../stores/auth.store';
import { donateStore } from './../../stores/donate.store';
import { donateActions } from './../../actions/donate.actions';

import { localization } from './../../constraints/localization';

export interface ILocationProps {
  locations?: Array<LocationModel>;
  locationId: number;
  donateId: number;
}
export interface ILocationStatus {
  locationId?: number;
  editable?: boolean;
}

export default class LocationComponent extends React.Component<ILocationProps, ILocationStatus> {
  static contextTypes: any;
  constructor(props : ILocationProps) {
    super(props);
    let self: LocationComponent = this;
    self.state = {
      editable: false,
    };
  }

  public componentDidMount() {
    let self: LocationComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: LocationComponent = this;
  }

  public componentWillReceiveProps (nextProps: ILocationProps) {
    let self: LocationComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ILocationProps) => {
    let self: LocationComponent = this;
    if (props.locations.length != 0) {
      let location: LocationModel = locationStore.getLocation(props.locationId);
      if (self.state.locationId == null || self.props.locationId != props.locationId) {
        setTimeout(function() {
          donateActions.fetchDonatesFromLocationIds([location.getId()]);
        }, 0);
      }
      let editable: boolean = false;
      if (location) {
        if (authStore.getAuth().getIsManager()) {
          editable = true;
        }
      }
      self.setState({editable: editable, locationId: props.locationId});
    }
  }

  render() {
    let self: LocationComponent = this;
    if (self.props.locationId) {
      let location: LocationModel = locationStore.getLocation(self.props.locationId);
      let deleteLocation: JSX.Element;
      if (authStore.getAuth().getIsAdmin()) {
        deleteLocation = <div className={styles.button} onClick={()=> {
          self.context.router.push({pathname: window.location.pathname, query: { mode: "delete" }});
        }}>
          {localization(966)}
        </div>;
      }
      if (authStore.getAuth().getIsManager()) {
        return (
          <div className={styles.wrapper}>
            <div className={styles.treeinfo}>
              <LocationNameComponent location={location} editable={self.state.editable} async={self.state.editable} />
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.context.router.push({pathname: Settings.uBaseName + '/donations'});
              }} /></div>
            </div>
            <div className={styles.basicinfo}>
              <LocationLocationComponent location={location} editable={self.state.editable} async={self.state.editable} />
              <LocationAddressComponent location={location} editable={self.state.editable} async={self.state.editable} />
              <LocationDescriptionComponent location={location} editable={self.state.editable} async={self.state.editable} />
              <AltContainer stores={
                {
                  donates: function (props) {
                    return {
                      store: donateStore,
                      value: donateStore.getState().donates,
                    };
                  }
                }
              }>
                <DonateListComponent donateId={self.props.donateId} />
              </AltContainer>
            </div>
            {deleteLocation}
          </div>
        );
      } else {
        return (
          <div className={styles.wrapper}>
          </div>
        );
      }
    } else {
      return (
        <div className={styles.wrapper}>
        </div>
      );
    }
  }
}

LocationComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
