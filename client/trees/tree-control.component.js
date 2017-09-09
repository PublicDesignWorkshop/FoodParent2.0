import React from 'react';
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip';

require('./tree-control.component.scss');
let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
let MapActions = require('./../actions/map.actions');
let TreeActions = require('./../actions/tree.actions');
let MapSetting = require('./../../setting/map.json');
let MapStore = require('./../stores/map.store');
let AuthStore = require('./../stores/auth.store');
let TreeStore = require('./../stores/tree.store');
import { MAPTILE, MAPTYPE } from './../utils/enum';
import { localization } from './../utils/localization';


export default class TreeControl extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleToggleMapTile = this.handleToggleMapTile.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
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
  handleFilter() {
    TreeActions.setCode(0); // set TreeAction code as 0 so that map component can wait rendering map after trees are updated.
    this.context.router.push({pathname: ServerSetting.uBase + '/filter'});
    // if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
    //   TreeActions.setCode(0); // set TreeAction code as 0 so that map component can wait rendering map after trees are updated.
    //   this.context.router.push({pathname: ServerSetting.uBase + '/filter'});
    //   // this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + parseInt(searchText)});
    // }
  }
  render () {
    let add = <div className="control-button" onClick={()=> {
      this.context.router.push({pathname: ServerSetting.uBase + '/addtree'});
    }} data-for="tooltip-tree-control" data-tip={localization(85)}>
      <FontAwesome name="plus-square" />
    </div>;

    let help = <div className="control-button" onClick={
    } data-for="tooltip-tree-control" data-tip={localization(89)}>
      <FontAwesome name="question" />
    </div>;

    if (this.props.adding) {
      add = <div className="control-button" onClick={()=> {
        TreeActions.setCode(0); // set TreeAction code as 0 so that map component can wait rendering map after trees are updated.
        this.context.router.push({pathname: ServerSetting.uBase + '/'});
        // if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
        //   TreeActions.setCode(0); // set TreeAction code as 0 so that map component can wait rendering map after trees are updated.
        //   this.context.router.push({pathname: ServerSetting.uBase + '/'});
        //   // this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + parseInt(searchText)});
        // } else if (MapStore.getState().latestMapType == MAPTYPE.DONATION) {
        //   // this.context.router.push({pathname: ServerSetting.uBase + "/donations"});
        // }
      }} data-for="tooltip-tree-control" data-tip={localization(79)}>
        <FontAwesome name="minus-square" />
      </div>;
    }
    let donation, notify, emptyFilter = localization(84);
    if (AuthStore.getState().auth.isManager()) {
      notify = <div className="control-button" onClick={()=> {
        this.context.router.push({pathname: ServerSetting.uBase + '/notify'});
      }} data-for="tooltip-tree-control" data-tip={localization(54)}>
        <FontAwesome name="clock-o" />
      </div>;
      donation = <div className="control-button" onClick={()=> {
        this.context.router.push({pathname: ServerSetting.uBase + '/recipients'});
      }} data-for="tooltip-tree-control" data-tip={localization(53)}>
        <FontAwesome name="sitemap" />
      </div>;
    }
    if (!TreeStore.getState().trees.length) {
      emptyFilter = localization(88);
      ReactTooltip.show(findDOMNode(this.refs.filter));
    }
    return (
      <div className="tree-control-wrapper">
        <div className="control-button" onClick={this.handleMoveToUserLocation} data-for="tooltip-tree-control" data-tip={localization(80)}>
          <FontAwesome name='location-arrow' />
        </div>
        <div className="control-button" onClick={this.handleToggleMapTile} data-for="tooltip-tree-control" data-tip={localization(81)}>
          <FontAwesome name={this.state.tile} />
        </div>
        <div className="control-button" onClick={this.handleZoomIn} data-for="tooltip-tree-control" data-tip={localization(82)}>
          <FontAwesome name='search-plus' />
        </div>
        <div className="control-button" onClick={this.handleZoomOut} data-for="tooltip-tree-control" data-tip={localization(83)}>
          <FontAwesome name='search-minus' />
        </div>
        <div className="control-button" onClick={this.handleFilter} data-for="tooltip-tree-control" data-tip={emptyFilter} ref="filter">
          <FontAwesome name='sliders'/>
        </div>
        <ReactTooltip id="tooltip-tree-control" effect="solid" place="left" />
        {add}
        {notify}
        {donation}
        {help}
      </div>
    );
  }
}

TreeControl.contextTypes = {
    router: React.PropTypes.object.isRequired
}
