import React from 'react';

require('./tree-add.component.scss');

import MapTree from './../maps/map-tree.component';


export default class TreeAdd extends React.Component {
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
        <MapTree />
      </div>
    );
  }
}
