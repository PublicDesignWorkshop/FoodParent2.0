import * as $ from 'jquery';
import * as React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as L from 'leaflet';
import './../../../node_modules/leaflet/dist/leaflet.css';
import * as styles from './screenshot.component.css';
var Settings = require('./../../constraints/settings.json');

import { treeStore, TreeModel } from './../../stores/tree.store';
import { treeActions } from './../../actions/tree.actions';
import { foodStore } from './../../stores/food.store';
import { foodActions } from './../../actions/food.actions';
import { flagStore } from './../../stores/flag.store';
import { flagActions } from './../../actions/flag.actions';
import { mapStore } from './../../stores/map.store';

import { TileMode, TreesMode } from './../../utils/enum';
import ScreenshotMapComponent from './screenshot-map.component';
import ScreenshotAddressComponent from './screenshot-address.component';

export interface IScreenshotProps {
  params: any;
  location: any;
}
export interface IScreenshotStatus {
  trees?: Array<TreeModel>;
  treeId?: number;
  zoom?: number;
  tile?: TileMode;
}
export default class ScreenshotComponent extends React.Component<IScreenshotProps, IScreenshotStatus> {
  static contextTypes: any;
  constructor(props : IScreenshotProps) {
    super(props);
    let self: ScreenshotComponent = this;
    this.state = {
      treeId: null,
      trees: null,
      zoom: Settings.iScreenshotZoom,
      tile: TileMode.SATELLITE
    };
  }
  public componentDidMount() {
    let self: ScreenshotComponent = this;
    treeActions.resetTrees();
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: ScreenshotComponent = this;
  }
  public componentWillReceiveProps (nextProps: IScreenshotProps) {
    let self: ScreenshotComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: IScreenshotProps) => {
    let self: ScreenshotComponent = this;
    let treeId = parseInt(props.params.treeId);
    self.setState({treeId: treeId});
  }
  public onMapRender = () => {
    let self: ScreenshotComponent = this;
    setTimeout(function() {
      flagActions.fetchFlags();
      foodActions.fetchFoods();
      treeActions.fetchTree(self.state.treeId);
    }, Settings.iMapRenderDelay);
  }
  render() {
    let self: ScreenshotComponent = this;
    return (
      <div className={styles.wrapper}>
        <AltContainer stores={
          {
            foods: function (props) {
              return {
                store: foodStore,
                value: foodStore.getState().foods
              };
            },
            trees: function (props) {
              return {
                store: treeStore,
                value: treeStore.getState().trees
              };
            },
            flags: function (props) {
              return {
                store: flagStore,
                value: flagStore.getState().flags
              };
            },
          }
        }>
          <ScreenshotMapComponent treeId={self.state.treeId} tile={TileMode.SATELLITE} onRender={self.onMapRender} />
          <ScreenshotAddressComponent treeId={self.state.treeId} />
        </AltContainer>
      </div>
    );
  }
}

ScreenshotComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
