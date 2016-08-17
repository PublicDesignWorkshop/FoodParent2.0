import React from 'react';
import AltContainer from 'alt-container';

require('./tree-filter.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import { readFilter } from './../utils/filter';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let AuthStore = require('./../stores/auth.store');
import TreeFood from './tree-food.component';
import TreeRate from './tree-rate.component';
import TreeAdopt from './tree-adopt.component';


export default class TreeFilter extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    TreeActions.setSelected(null);
    this.setState({adopts: [], flags: [], foods: [], ownerships: [], rates: []});
    readFilter(function(response) { // Resolve callback.
      let adopts;
      if (response.adopt) {
        adopts = response.adopt.split(",").map(function(adopt) {
          return parseInt(adopt);
        });
      }
      let flags = response.flags.split(",").map(function(flag) {
        return parseInt(flag);
      });
      let foods = response.foods.split(",").map(function(food) {
        return parseInt(food);
      });
      let ownerships = response.ownerships.split(",").map(function(ownership) {
        return parseInt(ownership);
      });
      let rates = response.rates.split(",").map(function(rate) {
        return parseInt(rate);
      });
      this.setState({adopts: adopts, flags: flags, foods: foods, ownerships: ownerships, rates: rates});
    }.bind(this), function(response) {  // Reject callback.

    }.bind(this));
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {

  }
  render () {
    return (
      <div>
        <TreeFood foods={this.state.foods} />
        <TreeRate rates={this.state.rates} />
        <TreeAdopt adopts={this.state.adopts} />
      </div>
    );
  }
}

TreeFilter.contextTypes = {
    router: React.PropTypes.object.isRequired
}
