import * as React from 'react';
import { render } from 'react-dom';
import { Router, Link } from 'react-router';

import * as styles from './nav-search.component.css';
var Settings = require('./../constraints/settings.json');

import { MapModel, mapStore } from './../stores/map.store';
import { mapActions } from './../actions/map.actions';
import { treeActions } from './../actions/tree.actions';

import { localization } from './../constraints/localization';
import { NavSearchMode } from './../utils/enum';
import { geocoding, reverseGeocoding, IReverseGeoLocation } from './../utils/geolocation';

export interface INavSearchProps {
  mapId: string;
}
export interface INavSearchStatus {
  mode?: NavSearchMode;
  search?: string;
  editing?: boolean;
}
export default class NavSearchComponent extends React.Component<INavSearchProps, INavSearchStatus> {
  static contextTypes: any;
  constructor(props : INavSearchProps) {
    super(props);
    let self: NavSearchComponent = this;
    this.state = {
      mode: NavSearchMode.TREES,
      search: localization(730),
      editing: false,
    };
  }

  public componentDidMount() {
    let self: NavSearchComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: NavSearchComponent = this;
  }

  public componentWillReceiveProps (nextProps: INavSearchProps) {
    let self: NavSearchComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: INavSearchProps) => {
    let self: NavSearchComponent = this;
    let mode: NavSearchMode = NavSearchMode.TREES;
    if (props.mapId == 'map-donation') {
      mode = NavSearchMode.DONATIONS;
    }
    self.setState({mode: mode});
    // setTimeout(function() {
    //   if (!self.state.editing) {
    //     let location: L.LatLng = mapStore.getCenter(props.mapId);
    //     if (location && location.lat && location.lng) {
    //       reverseGeocoding(new L.LatLng(location.lat, location.lng), function(response: IReverseGeoLocation) {
    //         self.setState({address: response.formatted, editing: false});
    //       }, function() {
    //
    //       });
    //     }
    //   }
    // }, 250);
  }

  private submitSearch = () => {
    let self: NavSearchComponent = this;
    let location: L.LatLng = mapStore.getCenter(self.props.mapId);
    self.setState({editing: false});
    if (self.state.search.trim() != "") {
      let value: any = self.state.search.trim();
      if (!isNaN(value)) {
        setTimeout(function() {
          mapActions.setFirst(self.props.mapId, true);
        }, 0);
        if (self.state.mode == NavSearchMode.TREES) {
          treeActions.fetchTrees(parseInt(value));
          self.context.router.push({pathname: Settings.uBaseName + '/tree/' + parseInt(value)});
        } else if (self.state.mode == NavSearchMode.DONATIONS) {
          self.context.router.push({pathname: Settings.uBaseName + '/donation/' + parseInt(value)});
        }
      } else {
        let temp = value.split(',');
        temp[0] = parseFloat(temp[0]);
        temp[1] = parseFloat(temp[1]);
        if (temp[0] && temp[1] && !isNaN(temp[0]) && !isNaN(temp[1])) {
          mapActions.moveToWithMarker(self.props.mapId, new L.LatLng(temp[0].toFixed(Settings.iMarkerPrecision), temp[1].toFixed(Settings.iMarkerPrecision)), Settings.iFocusZoom);
          mapActions.setActive(self.props.mapId, true);
        } else {
          geocoding(self.state.search, new L.LatLng(location.lat, location.lng), function(response) {
            mapActions.moveToWithMarker(self.props.mapId, new L.LatLng(response.lat.toFixed(Settings.iMarkerPrecision), response.lng.toFixed(Settings.iMarkerPrecision)), Settings.iFocusZoom);
            mapActions.setActive(self.props.mapId, true);
          }, function() {
            mapActions.setActive(self.props.mapId, true);
          });
        }
      }
    } else {
      mapActions.setActive(self.props.mapId, true);
      self.setState({search: localization(730)});
      // Address search mode (Disabled to decrease the number of Google Geo API calls).
      // let location: L.LatLng = mapStore.getCenter(self.props.mapId);
      // if (location && location.lat && location.lng) {
      //   reverseGeocoding(new L.LatLng(location.lat, location.lng), function(response: IReverseGeoLocation) {
      //     self.setState({address: response.formatted, editing: false});
      //     mapActions.setActive(self.props.mapId, true);
      //   }, function() {
      //     mapActions.setActive(self.props.mapId, true);
      //   });
      // }
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
    let self: NavSearchComponent = this;
    if (self.state.editing) {
      return (
        <input autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" type="text" className={styles.edit} placeholder={localization(730)}
          value={self.state.search}
          onChange={(event: any)=> {
            self.setState({search: event.target.value});
          }}
          onKeyPress={(event)=> {
            if (event.key == 'Enter') {
              self.submitSearch();
            }
          }}
          onBlur={()=> {
            self.submitSearch();
          }} />
      );
    } else {
      return (
        <div className={styles.location} onClick={()=> {
          if (self.state.search == localization(730)) {
            self.setState({search: "", editing: true});
          } else {
            self.setState({editing: true});
          }
          mapActions.setActive(self.props.mapId, false);
        }}>
          {self.state.search}
        </div>
      );
    }
  }
}

NavSearchComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
