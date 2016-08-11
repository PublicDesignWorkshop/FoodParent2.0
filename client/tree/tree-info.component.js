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

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');


export default class TreeInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({editing: false});
  }
  componentDidMount () {

  }
  componentWillReceiveProps() {

  }
  render () {
    let actions = <div>
      <div className="solid-button-group">
        <div className="solid-button solid-button-green" onClick={() => {
          this.setState({editing: true});
        }}>
          {localization(928)}
        </div>
      </div>
    </div>;
    if (this.state.editing) {
      actions = <div>
        <div className="solid-button-group">
          <div className="solid-button solid-button-green" onClick={() => {
            this.setState({editing: false});
          }}>
            {localization(930) /* SAVE */}
          </div>
          <div className="solid-button solid-button-green" onClick={() => {
            TreeActions.setSelected(TreeStore.getState().selected);
            this.setState({editing: false});
          }}>
            {localization(933) /* CANCEL */}
          </div>
        </div>
        <div className="danger-zone">{localization(927) /* DELETE THIS TREE */}</div>
        <div className="solid-button-group">
          <div className="solid-button solid-button-red" onClick={() => {
            this.setState({editing: false});
          }}>
            {localization(965) /* DELETE THIS TREE */}
          </div>
        </div>
      </div>;
    }
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
          <TreeFood editing={this.state.editing} />
          <TreeLocation editing={this.state.editing} />
          <TreeAddress editing={this.state.editing} />
          <TreeDescription editing={this.state.editing} />
        </AltContainer>
        {actions}
      </div>
    );
  }
}

TreeInfo.contextTypes = {
    router: React.PropTypes.object.isRequired
}
