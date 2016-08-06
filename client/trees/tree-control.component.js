import React from 'react';

require('./tree-control.component.scss');
let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
let MapActions = require('./../actions/map.actions');
let MapSetting = require('./../../setting/map.json');
let MapStore = require('./../stores/map.store');
import { MAPTILE } from './../utils/enum';


export default class TreeControl extends React.Component {
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
    if (MapStore.getMapTile(MapSetting.sTreeMapId) == MAPTILE.FLAT) {
      this.setState({tile: "map-o"});
    } else {
      this.setState({tile: "map"});
    }
  }
  handleMoveToUserLocation() {
    MapActions.moveToUserLocation(MapSetting.sTreeMapId);
  }
  handleToggleMapTile() {
    if (MapStore.getMapTile(MapSetting.sTreeMapId) == MAPTILE.FLAT) {
      MapActions.setTile(MapSetting.sTreeMapId, MAPTILE.SATELLITE);
      this.setState({tile: "map"});
    } else {
      MapActions.setTile(MapSetting.sTreeMapId, MAPTILE.FLAT);
      this.setState({tile: "map-o"});
    }
  }
  handleZoomIn() {
    let zoom = Math.min(MapSetting.iMaxZoom, MapStore.getZoom(MapSetting.sTreeMapId) + 1);
    MapActions.setZoom(MapSetting.sTreeMapId, zoom);
  }
  handleZoomOut() {
    let zoom = Math.min(MapSetting.iMaxZoom, MapStore.getZoom(MapSetting.sTreeMapId) - 1);
    MapActions.setZoom(MapSetting.sTreeMapId, zoom);
  }
  render () {
    let add = <div className="control-button" onClick={()=> {
      this.context.router.push({pathname: ServerSetting.uBase + '/addtree'});
    }}>
      <FontAwesome name="plus-square" />
    </div>;
    return (
      <div className="tree-control-wrapper">
        <div className="control-button" onClick={this.handleMoveToUserLocation}>
          <FontAwesome name='location-arrow' />
        </div>
        <div className="control-button" onClick={this.handleToggleMapTile}>
          <FontAwesome name={this.state.tile} />
        </div>
        <div className="control-button" onClick={this.handleZoomIn}>
          <FontAwesome name='search-plus' />
        </div>
        <div className="control-button" onClick={this.handleZoomOut}>
          <FontAwesome name='search-minus' />
        </div>
        <div className="control-button">
          <FontAwesome name='sliders'/>
        </div>
        {add}
      </div>
    );
  }
}

TreeControl.contextTypes = {
    router: React.PropTypes.object.isRequired
}
