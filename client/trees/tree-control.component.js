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

import { Steps } from 'intro.js-react';

require('./../intro.scss');


export default class TreeControl extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleToggleMapTile = this.handleToggleMapTile.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.onExit = this.onExit.bind(this);
    this.onBeforeChange = this.onBeforeChange.bind(this);
  }
  componentWillMount() {
    this.setState({
      tile: "map-o",
      tutorial: false
    });
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
  onExit() {
    this.setState({
      tutorial: false
    })
  }
  onBeforeChange(nextStep) {
    if (nextStep == 5) {
      console.log("OBC:", this);
      this.handleFilter();
      this.step.updateStepElement(nextStep);
    }
  }
  render () {
    let steps = [
      {
        element: '.center',
        intro: 'Search your location.',
        position: 'bottom',
        tooltipClass: 'introjs-searchbar',
        // highlightClass: 'myHighlightClass',
      },
      {
        element: '.right',
        intro: 'Become a food parent.',
        position: 'bottom',
      },
      {
        element: '.intro-location',
        intro: 'Find your location.',
        position: 'left',
      },
      {
        element: '.intro-filter',
        intro: 'Select food type.',
        position: 'left',
      },
      {
        element: '.intro-add',
        intro: 'Add a new food.',
        position: 'left',
      },
      {
        element: '.Select--multi',
        intro: 'Choose types of visible trees',
        position: 'left',
      }
    ];

    if (this.props.adding) {
      steps = [
        {
          element: '.center',
          intro: 'Search your location.',
          position: 'bottom',
          tooltipClass: 'introjs-searchbar',
          highlightClass: 'myHighlightClass',
        },
        {
          element: '.right',
          intro: 'Become a food parent.',
          position: 'bottom',
        },
        {
          element: '.intro-location',
          intro: 'Find your location.',
          position: 'left',
        },
        {
          element: '.intro-filter',
          intro: 'Select food type.',
          position: 'left',
        },
        {
          element: '.intro-add',
          intro: 'Cancel adding a new food.',
          position: 'left',
        }
      ];
    }

    const intro = <Steps
      enabled={this.state.tutorial}
      steps={steps}
      initialStep={0}
      onExit={this.onExit}
      onBeforeChange={this.onBeforeChange}
    />
    console.log("intro: ", intro);

    let add = <div className="control-button intro-add" onClick={()=> {
      this.context.router.push({pathname: ServerSetting.uBase + '/addtree'});
    }} data-for="tooltip-tree-control" data-tip={localization(85)}>
      <FontAwesome name="plus-square" />
    </div>;

    let help = <div className="control-button" data-for="tooltip-tree-control" data-tip={localization(89)}
      onClick={() => {
        this.setState({tutorial: true});
      }}
    >
      <FontAwesome name="question" />
    </div>;

    if (this.props.adding) {
      add = <div className="control-button intro-add" onClick={()=> {
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
        <div className="control-button intro-location" onClick={this.handleMoveToUserLocation} data-for="tooltip-tree-control" data-tip={localization(80)}>
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
        <div className="control-button intro-filter" onClick={this.handleFilter} data-for="tooltip-tree-control" data-tip={emptyFilter} ref="filter">
          <FontAwesome name='sliders'/>
        </div>
        <ReactTooltip id="tooltip-tree-control" effect="solid" place="left" />
        {add}
        {notify}
        {donation}
        {help}
        {intro}
      </div>
    );
  }
}

TreeControl.contextTypes = {
    router: React.PropTypes.object.isRequired
}

