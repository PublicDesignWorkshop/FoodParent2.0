import React from 'react';
import AltContainer from 'alt-container';

require('./tree-add.component.scss');

let ServerSetting = require('./../../setting/server.json');
import { localization } from './../utils/localization';
import MapTree from './../maps/map-tree.component';
import TreeAddPanel from './tree-add-panel.component';
import { TREEADDMODE } from './../utils/enum';
let MapStore = require('./../stores/map.store');
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');


export default class TreeAdd extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    TreeActions.createTempTree.defer();
    this.updateProps(this.props);
  }
  componentDidMount () {
    
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    let mode;
    let open;
    TreeActions.fetchTree.defer(parseInt(props.params.treeId));
    // Instead of changing url, change # hashtag to remove extra rendering process.
    switch(props.location.hash.replace('#', '')) {
      case "":
        mode = TREEADDMODE.MARKER;
        open = false;
        break;
      case "info":
        mode = TREEADDMODE.INFO;
        open = true;
        break;
      default:
        mode = TREEADDMODE.MARKER;
        open = false;
        break;
    }
    this.setState({mode: mode, open: open});
    // TreeActions.setSelected(parseInt(props.params.treeId));
  }
  render () {
    let action = <div className="popup-message">
      <span dangerouslySetInnerHTML={{__html: localization(640)}} />
      <span className="popup-button" onClick={()=> {
        this.context.router.push({pathname: ServerSetting.uBase + '/addtree', hash: '#info'});
        // self.context.router.replace({pathname: Settings.uBaseName + '/tree/add', query: { mode: "info" }});
      }}>
        {localization(929)}
      </span>
    </div>;

    if (this.state.mode == TREEADDMODE.INFO) {
      action = <div className="popup-message">
        <span dangerouslySetInnerHTML={{__html: localization(641)}} />
      </div>;
    }

    return (
      <div className="tree-map-wrapper">
        <AltContainer stores={
          {
            location: function(props) {
              return {
                store: MapStore,
                value: MapStore.getState().location
              };
            },
            trees: function(props) {
              return {
                store: TreeStore,
                value: TreeStore.getState().trees
              }
            },
            selected: function(props) {
              return {
                store: TreeStore,
                value: TreeStore.getState().selected
              }
            }
          }
        }>
          <MapTree />
        </AltContainer>
        <TreeAddPanel open={this.state.open} mode={this.state.mode} />
        <div className="popup-wrapper popup-green">
          {action}
        </div>
      </div>
    );
  }
}
TreeAdd.contextTypes = {
    router: React.PropTypes.object.isRequired
}