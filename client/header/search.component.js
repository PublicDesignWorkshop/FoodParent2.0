import React from 'react';

require('./search.component.scss');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { isLatLng } from './../utils/validation';

let MapActions = require('./../actions/map.actions');
let MapStore = require('./../stores/map.store');
let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
import { MAPTYPE } from './../utils/enum';
import { geocoding } from './../utils/geocoding';



// localization(994, window.navigator.userLanguage || window.navigator.language, function(success) {
//
// }, function(fail) {
//
// });


export default class Search extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    this.setState({editing: false, searchPlaceHolder: ""});
    localization(730, window.navigator.userLanguage || window.navigator.language, function(response) {
      this.setState({searchText: response, searchPlaceHolder: response});
    }.bind(this));

  }
  componentDidMount () {

  }
  componentWillReceiveProps() {

  }
  handleChangeSearch (event) {
    this.setState({searchText: event.target.value});
  }
  handleSubmit () {
    if (this.state.searchText.trim() != "") {
      let value = this.state.searchText.trim();
      if (!isNaN(value)) {
        // If searchText value is a number -> tree id or donation id.
        if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
          this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + parseInt(value)});
        } else if (MapStore.getState().latestMapType == MAPTYPE.DONATION) {
          this.context.router.push({pathname: ServerSetting.uBase + '/recipient/' + parseInt(value)});
        }
      } else {
        // Check the searchText value is a Lat & Lng value.
        let latlng = value.split(',');
        let lat = parseFloat(latlng[0]);
        let lng = parseFloat(latlng[1]);
        if (isLatLng(lat, lng)) {
          if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
            MapActions.moveToLocationWithMarker(MapSetting.sTreeMapId, new L.LatLng(lat, lng), MapSetting.iFocusZoom);
          }
        } else {
          // Pure string value -> search via Google Geolocation API.
          let location;
          if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
            location = MapStore.getMapModel(MapSetting.sTreeMapId).getCenter();
          }
          geocoding(this.state.searchText, new L.LatLng(location.lat, location.lng), function(response) {
            MapActions.moveToLocationWithMarker(MapSetting.sTreeMapId, new L.LatLng(response.lat.toFixed(MapSetting.iMarkerPrecision), response.lng.toFixed(MapSetting.iMarkerPrecision)), MapSetting.iFocusZoom);
          }, function() {

          });
        }
      }
    }

    this.setState({editing: false});
  }
  render () {
    if (this.state.editing) {
      return (
        <input autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" type="text" className="search-input"
          placeholder={this.state.searchPlaceHolder}
          value={this.state.searchText}
          onChange={this.handleChangeSearch}
          onKeyPress={(event)=> {
            if (event.key == 'Enter') {
              this.handleSubmit();
            }
          }}
          onBlur={()=> {
            this.handleSubmit();
          }} />
      );
    } else {
      return (
        <div className="search-text" onClick={()=> {
          if (this.state.searchText == this.state.searchPlaceHolder) {
            this.setState({searchText: "", editing: true});
          } else {
            this.setState({editing: true});
          }
          // mapActions.setActive(self.props.mapId, false);
        }}>
          {this.state.searchText}
        </div>
      );
    }
  }
}


Search.contextTypes = {
    router: React.PropTypes.object.isRequired
}
