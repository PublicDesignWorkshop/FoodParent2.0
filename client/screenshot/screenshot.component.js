import React from 'react';
import AltContainer from 'alt-container';

require('./screenshot.component.scss');

let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');

import { localization } from './../utils/localization';

import MapScreenshot from './../maps/map-screenshot.component';
import ScreenshotInfo from './screenshot-info.component';

export default class TreeDetail extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.updateProps(this.props);
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    // this.updateProps(nextProps);
  }
  componentWillUnmount() {

  }

  updateProps(props) {
    TreeActions.fetchTree(parseInt(props.params.treeId));
  }
  render () {
    return (
      <div className="screenshot-wrapper">
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
          <MapScreenshot />
          <ScreenshotInfo />
        </AltContainer>
      </div>
    );
  }
}
