import React from 'react';
import AltContainer from 'alt-container';

require('./tree-map.component.scss');

let MapStore = require('./../stores/map.store');
let TreeStore = require('./../stores/tree.store');


import MapTree from './../maps/map-tree.component';
import TreePanel from './tree-panel.component';


export default class TreeMap extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {

  }
  componentDidMount () {

  }
  componentWillReceiveProps() {

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
