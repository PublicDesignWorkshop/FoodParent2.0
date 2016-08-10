import React from 'react';
import AltContainer from 'alt-container';

require('./tree-info.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import TreeFood from './tree-food.component';
import TreeLocation from './tree-location.component';
import TreeAddress from './tree-address.component';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');


export default class TreeInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {

  }
  componentDidMount () {

  }
  componentWillReceiveProps() {

  }
  render () {
    return (
      <div className="tree-info-wrapper">
        <AltContainer stores={
          {
            tree: function(props) {
              return {
                store: TreeStore,
                value: TreeStore.getState().temp
              }
            }
          }
        }>
          <TreeFood />
          <TreeLocation />
          <TreeAddress />
        </AltContainer>
      </div>
    );
  }
}

TreeInfo.contextTypes = {
    router: React.PropTypes.object.isRequired
}
