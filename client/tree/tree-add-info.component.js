import React from 'react';
import AltContainer from 'alt-container';

require('./tree-info.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import TreeFood from './tree-food.component';
import TreeLocation from './tree-location.component';
import TreeAddress from './tree-address.component';
import TreeDescription from './tree-description.component';
import TreeFlag from './tree-flag.component';
import TreeOwnership from './tree-ownership.component';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');


export default class TreeAddInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({selected: TreeStore.getState().selected});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    if (TreeStore.getState().selected != this.state.selected) {
      this.setState({selected: TreeStore.getState().selected});
    }
  }
  render () {
    let actions = <div>
    <div className="solid-button-group">
      <div className="solid-button solid-button-green" onClick={() => {
        TreeActions.createTree(TreeStore.getState().temp);
        // this.setState({editing: true});
        // TreeActions.setEditing(TreeStore.getState().selected, true);
      }}>
        {localization(930) /* SAVE */}
      </div>
    </div>
      <div className="solid-button-group">
        <div className="solid-button solid-button-red" onClick={() => {
          this.context.router.push({pathname: ServerSetting.uBase + '/'});
          // this.setState({editing: true});
          // TreeActions.setEditing(TreeStore.getState().selected, true);
        }}>
          {localization(933) /* CANCEL */}
        </div>
      </div>
    </div>;
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
          <TreeFood editing={true} />
          <TreeLocation editing={true} />
          <TreeAddress editing={true} />
          <TreeDescription editing={true} />
          <TreeFlag editing={true} />
          <TreeOwnership editing={true} />
        </AltContainer>
        {actions}
      </div>
    );
  }
}

TreeAddInfo.contextTypes = {
    router: React.PropTypes.object.isRequired
}
