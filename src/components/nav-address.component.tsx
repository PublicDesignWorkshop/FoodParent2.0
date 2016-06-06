import * as React from 'react';
import { render } from 'react-dom';
import { Router, Link } from 'react-router';

var Settings = require('./../constraints/settings.json');
import * as styles from './nav-address.component.css';
import { LogInStatus } from './app.component';
import { geocoding, reverseGeocoding, IReverseGeoLocation } from './../utils/geolocation';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { MapModel, mapStore } from './../stores/map.store';
import { mapActions } from './../actions/map.actions';

export interface INavAddressProps {
  mapId: string;
}
export interface INavAddressStatus {
  address?: string;
  editing?: boolean;
}
export default class NavAddressComponent extends React.Component<INavAddressProps, INavAddressStatus> {
  static contextTypes: any;
  constructor(props : INavAddressProps) {
    super(props);
    let self: NavAddressComponent = this;
    this.state = {
      address: "",
      editing: false,
    };
  }
  public componentDidMount() {
    let self: NavAddressComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: NavAddressComponent = this;
  }
  public componentWillReceiveProps (nextProps: INavAddressProps) {
    let self: NavAddressComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: INavAddressProps) => {
    let self: NavAddressComponent = this;
    let location: L.LatLng = mapStore.getCenter(props.mapId);
    if (location && location.lat && location.lng) {
      addLoading();
      reverseGeocoding(new L.LatLng(location.lat, location.lng), function(response: IReverseGeoLocation) {
        self.setState({address: response.formatted, editing: false});
        removeLoading();
      }, function() {
        removeLoading();
      });
    }
  }

  private searchAddress = () => {
    let self: NavAddressComponent = this;
    let location: L.LatLng = mapStore.getCenter(self.props.mapId);
    self.setState({editing: false});
    if (self.state.address.trim() != "") {
      let value: any = self.state.address.trim();
      if (!isNaN(value)) {
        setTimeout(function() {
          mapActions.setFirst('map', true);
        }, 0);
        self.context.router.push({pathname: Settings.uBaseName + '/tree/' + parseInt(value)});
      } else {
        geocoding(self.state.address, new L.LatLng(location.lat, location.lng), function(response) {
          mapActions.moveTo(self.props.mapId, new L.LatLng(response.lat.toFixed(Settings.iMarkerPrecision), response.lng.toFixed(Settings.iMarkerPrecision)), Settings.iFocusZoom);
          // self.context.router.replace({pathname: window.location.pathname, query: { lat: response.lat.toFixed(Settings.iMarkerPrecision), lng: response.lng.toFixed(Settings.iMarkerPrecision), move: true }});
          // self.context.router.replace({pathname: Settings.uBaseName + '/', query: { lat: response.lat.toFixed(Settings.iMarkerPrecision), lng: response.lng.toFixed(Settings.iMarkerPrecision), move: true }});
        }, function() {

        });
      }
    } else {
      let location: L.LatLng = mapStore.getCenter(self.props.mapId);
      if (location && location.lat && location.lng) {
        addLoading();
        reverseGeocoding(new L.LatLng(location.lat, location.lng), function(response: IReverseGeoLocation) {
          self.setState({address: response.road + ", " + response.county + ", " + response.state + ", " + response.postcode, editing: false});
          removeLoading();
        }, function() {
          removeLoading();
        });
      }
    }
    //  else {
    //   if (self.props.location.query.lat && self.props.location.query.lng) {
    //     addLoading();
    //     reverseGeocoding(new L.LatLng(self.props.location.query.lat, self.props.location.query.lng), function(response: IReverseGeoLocation) {
    //       self.setState({address: response.road + ", " + response.county + ", " + response.state + ", " + response.postcode, editing: false});
    //       removeLoading();
    //     }, function() {
    //       removeLoading();
    //     });
    //   }
    // }
  }

  render() {
    let self: NavAddressComponent = this;
    if (self.state.editing) {
      return (
        <input autoFocus type="text" className={styles.edit} placeholder="enter a search location address..."
          value={self.state.address}
          onChange={(event: any)=> {
            self.setState({address: event.target.value});
          }}
          onKeyPress={(event)=> {
            if (event.key == 'Enter') {
              self.searchAddress();
            }
          }}
          onBlur={()=> {
            self.searchAddress();
          }} />
      );
    } else {
      return (
        <div className={styles.location} onClick={()=> {
          self.setState({address: "", editing: true});
        }}>
          {self.state.address}
        </div>
      );
    }
  }
}

NavAddressComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
