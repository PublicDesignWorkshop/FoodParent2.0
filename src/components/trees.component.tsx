import * as React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import * as L from 'leaflet';
import * as AltContainer from 'alt-container';

var Settings = require('./../constraints/settings.json');
import * as styles from './trees.component.css';
import './../../node_modules/leaflet/dist/leaflet.css';
import { treeStore, TreeModel, TreeState } from './../stores/tree.store';
import { foodStore, FoodModel, FoodState } from './../stores/food.store';
import { treeActions } from './../actions/tree.actions';
import { foodActions } from './../actions/food.actions';
import MapComponent from './map.component' ;
import TreesPanelComponent from './trees-panel.component';
import TreesMessageComponent from './trees-message.component';
import { TileMode } from './map.component';

export enum TreesMode {
  NONE, TREEDETAIL, TREEADDMARKER, TREEADDINFO, TREEADDSAVE
}
export interface ITreesProps {
  params: any;
  location: any;
}
export interface ITreesStatus {
  trees?: Array<TreeModel>;
  treeId?: number;
  zoom?: number;
  position?: null;
  mode?: TreesMode;
  tile?: TileMode;
}
export default class TreesComponent extends React.Component<ITreesProps, ITreesStatus> {
  static contextTypes: any;
  constructor(props : ITreesProps) {
    super(props);
    let self: TreesComponent = this;
    this.state = {
      treeId: null,
      trees: null,
      zoom: Settings.iDefaultZoom,
      position: null,
      mode: TreesMode.TREEDETAIL,
      tile: TileMode.GRAY
    };
  }
  public componentDidMount() {
    let self: TreesComponent = this;
    treeStore.listen(self.onChange);
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreesComponent = this;
    treeStore.unlisten(self.onChange);
  }
  public componentWillReceiveProps (nextProps: ITreesProps) {
    let self: TreesComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: ITreesProps) => {
    console.warn("--updateProps");
    let self: TreesComponent = this;
    let treeId = null;
    let mode: TreesMode = TreesMode.TREEDETAIL;
    if (props.params.treeId == "add") {
      treeId = 0;
      if (props.location.query.mode == "marker") {
        mode = TreesMode.TREEADDMARKER;
      } else if (props.location.query.mode == "info") {
        if (treeStore.getTree(0)) {
          mode = TreesMode.TREEADDINFO;
        } else {
          self.context.router.replace({pathname: Settings.uBaseName + '/trees/add', query: { mode: "marker" }});
        }
      } else if (props.location.query.mode == "save") {
        var tree: TreeModel = treeStore.getTree(0);
        if (tree) {
          treeStore.createTree(tree);
          self.context.router.replace({pathname: Settings.uBaseName + '/'});
        } else {
          self.context.router.replace({pathname: Settings.uBaseName + '/trees/add', query: { mode: "marker" }});
        }
      }
    } else if (props.params.treeId) {
      treeId = parseInt(props.params.treeId);
    }
    self.setState({treeId: treeId, mode: mode});
  }
  onChange = (store: TreeState) => {
    let self: TreesComponent = this;
    //self.setState({trees: store.trees, treeId: self.state.treeId});
  }
  onTile = (tile: TileMode) => {
    let self: TreesComponent = this;
    self.setState({tile: tile});
  }

  public onMapRender = () => {
    let self: TreesComponent = this;
    setTimeout(function () {
      foodStore.fetchFoods();
      treeStore.fetchTrees();
    }, 1500);
  }
  public renderTree = (treeId: number) => {
    let self: TreesComponent = this;
    //self.setState({trees: self.state.trees, treeId: treeId, bClose: self.state.bClose});
  }
  public changeLocation = () => {
    let self: TreesComponent = this;
  }
  onZoom = (zoom: number) => {
    let self: TreesComponent = this;
    self.setState({zoom: zoom});
  }
  onGeo = (position: Position) => {
    let self: TreesComponent = this;
    self.setState({position: new L.LatLng(position.coords.latitude, position.coords.longitude)});
  }
  offGeo = () => {
    let self: TreesComponent = this;
    self.setState({position: null});
  }

  render() {
    let self: TreesComponent = this;
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
            }
          }
        }>
          <MapComponent tile={self.state.tile} mode={self.state.mode} treeId={self.state.treeId} foods={foodStore.getState().foods} trees={treeStore.getState().trees} onRender={self.onMapRender} zoom={self.state.zoom} onZoom={self.onZoom} position={self.state.position} offGeo={self.offGeo} />
          <TreesPanelComponent tile={self.state.tile} onTile={self.onTile} mode={self.state.mode} treeId={self.state.treeId} foods={foodStore.getState().foods} trees={treeStore.getState().trees} zoom={self.state.zoom} onZoom={self.onZoom} onGeo={self.onGeo} />
          <TreesMessageComponent mode={self.state.mode} />
        </AltContainer>
      </div>
    );
  }
}

TreesComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
