import React from 'react';
import AltContainer from 'alt-container';

require('./tree-graph.component.scss');

let MapStore = require('./../stores/map.store');
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');

import MapTree from './../maps/map-tree.component';
import TreePanel from './tree-panel.component';

export default class TreeGraph extends React.Component {
  constructor() {
    super();
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
    // TreeActions.fetchTrees(parseInt(props.params.treeId));
    TreeActions.setSelected(parseInt(props.params.treeId));
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
        <TreePanel />
      </div>
    );
  }
}
