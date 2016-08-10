import React from 'react';
import AltContainer from 'alt-container';

require('./tree-detail.component.scss');

let MapStore = require('./../stores/map.store');
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');
import { TREEDETAILMODE } from './../utils/enum';

import MapTree from './../maps/map-tree.component';
import TreePanel from './tree-panel.component';

export default class TreeDetail extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.updateProps(this.props);
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    let mode;
    TreeActions.fetchTree.defer(parseInt(props.params.treeId));
    // Instead of changing url, change # hashtag to remove extra rendering process.
    switch(props.location.hash.replace('#', '')) {
      case "":
        mode = TREEDETAILMODE.INFO;
        break;
      case "post":
        mode = TREEDETAILMODE.POST;
        break;
      case "parent":
        mode = TREEDETAILMODE.PARENT;
        break;
      case "history":
        mode = TREEDETAILMODE.HISTORY;
        break;
      case "all":
        mode = TREEDETAILMODE.ALL;
        break;
      default:
        mode = TREEDETAILMODE.INFO;
        break;
    }
    this.setState({mode: mode});
    // TreeActions.setSelected(parseInt(props.params.treeId));
  }
  render () {
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
        <TreePanel open={true} mode={this.state.mode} />
      </div>
    );
  }
}
