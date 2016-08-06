import React from 'react';
import AltContainer from 'alt-container';

require('./tree-map.component.scss');

let MapStore = require('./../stores/map.store');


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
      <div className="trees-map-wrapper">
        <AltContainer stores={
          {
            location: function (props) {
              return {
                store: MapStore,
                value: MapStore.getState().location
              };
            },
          }
        }>
          <MapTree />
        </AltContainer>

        <TreePanel />
      </div>
    );
  }
}
