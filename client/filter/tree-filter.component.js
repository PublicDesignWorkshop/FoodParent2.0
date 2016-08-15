import React from 'react';
import AltContainer from 'alt-container';

require('./tree-filter.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let AuthStore = require('./../stores/auth.store');


export default class TreeFilter extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    // this.setState({selected: TreeStore.getState().selected, editing: false, editable: false});
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
        FILTER
      </div>
    );
  }
}

TreeFilter.contextTypes = {
    router: React.PropTypes.object.isRequired
}
