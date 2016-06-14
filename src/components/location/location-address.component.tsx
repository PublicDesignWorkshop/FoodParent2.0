import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './location-address.component.css';
var Settings = require('./../../constraints/settings.json');

import { LocationModel } from './../../stores/location.store';
import { locationActions } from './../../actions/location.actions';

import { reverseGeocoding, IReverseGeoLocation } from './../../utils/geolocation';
import { localization } from './../../constraints/localization';

export interface ILocationAddressProps {
  location: LocationModel;
  editable: boolean;
  async: boolean;
}
export interface ILocationAddressStatus {
  prevLat?: number;
  prevLng?: number;
  address?: string;
  editing?: boolean;
}

export default class LocationAddressComponent extends React.Component<ILocationAddressProps, ILocationAddressStatus> {
  private loading: boolean;
  constructor(props : ILocationAddressProps) {
    super(props);
    let self: LocationAddressComponent = this;
    this.state = {
      prevLat: 0,
      prevLng: 0,
      address: "",
      editing: false,
    };
    self.loading = false;
  }

  public componentDidMount() {
    let self: LocationAddressComponent = this;
    self.updateProps(self.props);
    if (self.props.location) {
      self.setState({prevLat: parseFloat(self.props.location.getLat().toFixed(Settings.iMarkerPrecision)), prevLng: parseFloat(self.props.location.getLng().toFixed(Settings.iMarkerPrecision))});
    }
  }

  public componentWillUnmount() {
    let self: LocationAddressComponent = this;
  }

  public componentWillReceiveProps (nextProps: ILocationAddressProps) {
    let self: LocationAddressComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ILocationAddressProps) => {
    let self: LocationAddressComponent = this;
    if (props.location) {
      if (props.location.getAddress() && props.location.getAddress().trim() != "" && props.location.getLat().toFixed(Settings.iMarkerPrecision) == self.state.prevLat.toFixed(Settings.iMarkerPrecision) && props.location.getLng().toFixed(Settings.iMarkerPrecision) == self.state.prevLng.toFixed(Settings.iMarkerPrecision)) {
        self.setState({address: props.location.getAddress().trim(), editing: false, prevLat: props.location.getLat(), prevLng: props.location.getLng()});
      } else {
        if (!self.loading) {
          self.loading = true;
          reverseGeocoding(props.location.getLocation(), function(response: IReverseGeoLocation) {
            self.loading = false;
            self.setState({address: response.formatted, editing: false});
            props.location.setAddress(self.state.address);
            if (props.async) {
              // treeActions.updateTree(props.tree);
              self.setState({prevLat: parseFloat(self.props.location.getLat().toFixed(Settings.iMarkerPrecision)), prevLng: parseFloat(self.props.location.getLng().toFixed(Settings.iMarkerPrecision))});
            } else {
              self.setState({editing: false, prevLat: parseFloat(self.props.location.getLat().toFixed(Settings.iMarkerPrecision)), prevLng: parseFloat(self.props.location.getLng().toFixed(Settings.iMarkerPrecision))});
            }
          }, function() {

          });
        }
      }
    }
  }

  private updateAttribute = () => {
    let self: LocationAddressComponent = this;
    if (self.state.address.trim() != "") {
      self.props.location.setAddress(self.state.address);
      if (self.props.async) {
        locationActions.updateLocation(self.props.location);
      } else {
        self.setState({editing: false});
      }
    } else {
      reverseGeocoding(self.props.location.getLocation(), function(response: IReverseGeoLocation) {
        self.setState({address: response.formatted, editing: false});
        self.props.location.setAddress(self.state.address);
        if (self.props.async) {
          locationActions.updateLocation(self.props.location);
        } else {
          self.setState({editing: false});
        }
      }, function() {
      });
    }
  }

  render() {
    let self: LocationAddressComponent = this;
    if (self.state.editing) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='map-signs' /> {localization(967)}
          </div>
          <div className={styles.editname}>
            <input autoFocus type="text" className={styles.edit} key={self.props.location.getId() + "address"} placeholder={localization(972)}
              value={self.state.address}
              onChange={(event: any)=> {
                self.setState({address: event.target.value, editing: self.state.editing});
              }}
              onKeyPress={(event)=> {
                if (event.key == 'Enter') {
                  self.updateAttribute();
                }
              }}
              onBlur={()=> {
                self.updateAttribute();
              }} />
          </div>

        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {
            if (self.props.editable) {
              self.setState({editing: true});
            }
          }}>
            <FontAwesome className='' name='map-signs' /> {localization(967)}
          </div>
          <div className={styles.name} onClick={()=> {
            if (self.props.editable) {
              self.setState({editing: true});
            }
          }}>
            {self.state.address}
          </div>
        </div>
      );
    }
  }
}
