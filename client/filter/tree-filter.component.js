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


export default class TreeFilter extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    TreeActions.setSelected(null);
    this.setState({adopt: [], flags: [], foods: [], ownerships: [], rates: []});
    readFilter(function(response) { // Resolve callback.
      let adopt = response.adopt;
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
      this.setState({adopt: adopt, flags: flags, foods: foods, ownerships: ownerships, rates: rates});
    }.bind(this), function(response) {  // Reject callback.

    }.bind(this));
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    // if (TreeStore.getState().selected != this.state.selected) {
    //   this.setState({selected: TreeStore.getState().selected, editing: false, editable: AuthStore.getState().auth.canEditTree(TreeStore.getState().selected)});
    // }
  }
  render () {
    return (
      <div className="tree-filter-wrapper">
        <TreeFood foods={this.state.foods} />
      </div>
    );
  }
}

TreeFilter.contextTypes = {
    router: React.PropTypes.object.isRequired
}
