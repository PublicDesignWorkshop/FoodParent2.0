import React from 'react';
import AltContainer from 'alt-container';

require('./tree-map.component.scss');

let MapStore = require('./../stores/map.store');
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');


import MapTree from './../maps/map-tree.component';
import TreeFilterPanel from './tree-filter-panel.component';


export default class TreeFilter extends React.Component {
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
    // TreeActions.setSelected.defer(parseInt(props.params.treeId));
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
            }
          }
        }>
          <MapTree />
        </AltContainer>
        <TreeFilterPanel open={true}/>
      </div>
    );
  }
}
