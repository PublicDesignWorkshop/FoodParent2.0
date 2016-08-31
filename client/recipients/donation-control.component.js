import React from 'react';
import ReactTooltip from 'react-tooltip';

require('./donation-control.component.scss');
let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
let MapActions = require('./../actions/map.actions');
let TreeActions = require('./../actions/tree.actions');
let LocationActions = require('./../actions/location.actions');
let MapSetting = require('./../../setting/map.json');
let MapStore = require('./../stores/map.store');
let AuthStore = require('./../stores/auth.store');
import { MAPTILE, MAPTYPE } from './../utils/enum';
import { localization } from './../utils/localization';


export default class DonationControl extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleToggleMapTile = this.handleToggleMapTile.bind(this);
  }
  componentWillMount() {
    this.setState({tile: "map-o"});
  }
  componentDidMount () {

  }
  componentWillReceiveProps() {
    if (MapStore.getMapTile(MapSetting.sMapId) == MAPTILE.FLAT) {
      this.setState({tile: "map-o"});
    } else {
      this.setState({tile: "map"});
    }
  }
  handleMoveToUserLocation() {
    MapActions.moveToUserLocation.defer(MapSetting.sMapId);
  }
  handleToggleMapTile() {
    if (MapStore.getMapTile(MapSetting.sMapId) == MAPTILE.FLAT) {
      MapActions.setTile.defer(MapSetting.sMapId, MAPTILE.SATELLITE);
      this.setState({tile: "map"});
    } else {
      MapActions.setTile.defer(MapSetting.sMapId, MAPTILE.FLAT);
      this.setState({tile: "map-o"});
    }
  }
  handleZoomIn() {
    let zoom = Math.min(MapSetting.iMaxZoom, MapStore.getZoom(MapSetting.sMapId) + 1);
    MapActions.setZoom.defer(MapSetting.sMapId, zoom);
  }
  handleZoomOut() {
    let zoom = Math.min(MapSetting.iMaxZoom, MapStore.getZoom(MapSetting.sMapId) - 1);
    MapActions.setZoom.defer(MapSetting.sMapId, zoom);
  }
  // handleFilter() {
  //   if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
  //     TreeActions.setCode(0); // set TreeAction code as 0 so that map component can wait rendering map after trees are updated.
  //     this.context.router.push({pathname: ServerSetting.uBase + '/filter'});
  //     // this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + parseInt(searchText)});
  //   }
  // }
  render () {
    let add = <div className="control-button" onClick={()=> {
      this.context.router.push({pathname: ServerSetting.uBase + '/addrecipient'});
    }} data-for="tooltip-donation-control" data-tip={localization(51)}>
      <FontAwesome name="plus-square" />
    </div>;
    if (this.props.adding) {
      add = <div className="control-button" onClick={()=> {
        if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
          TreeActions.setCode(0); // set TreeAction code as 0 so that map component can wait rendering map after trees are updated.
          this.context.router.push({pathname: ServerSetting.uBase + '/'});
        } else if (MapStore.getState().latestMapType == MAPTYPE.DONATION) {
          LocationActions.setCode(0); // set TreeAction code as 0 so that map component can wait rendering map after trees are updated.
          this.context.router.push({pathname: ServerSetting.uBase + '/recipients'});
        }
      }} data-for="tooltip-donation-control" data-tip={localization(79)}>
        <FontAwesome name="minus-square" />
      </div>;
    }
    let tree;
    if (AuthStore.getState().auth.isManager()) {
      tree = <div className="control-button" onClick={()=> {
        TreeActions.fetchTrees();
        this.context.router.push({pathname: ServerSetting.uBase + '/'});
      }} data-for="tooltip-donation-control" data-tip={localization(52)}>
        <FontAwesome name="apple" />
      </div>;
    }
    return (
      <div className="donation-control-wrapper">
        <div className="control-button" onClick={this.handleMoveToUserLocation} data-for="tooltip-donation-control" data-tip={localization(80)}>
          <FontAwesome name='location-arrow' />
        </div>
        <div className="control-button" onClick={this.handleToggleMapTile} data-for="tooltip-donation-control" data-tip={localization(81)}>
          <FontAwesome name={this.state.tile} />
        </div>
        <div className="control-button" onClick={this.handleZoomIn} data-for="tooltip-donation-control" data-tip={localization(82)}>
          <FontAwesome name='search-plus' />
        </div>
        <div className="control-button" onClick={this.handleZoomOut} data-for="tooltip-donation-control" data-tip={localization(83)}>
          <FontAwesome name='search-minus' />
        </div>
        <ReactTooltip id="tooltip-donation-control" effect="solid" place="left" />
        {add}
        {tree}
      </div>
    );
  }
}

DonationControl.contextTypes = {
    router: React.PropTypes.object.isRequired
}
