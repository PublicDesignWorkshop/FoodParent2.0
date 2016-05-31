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
import { calcRating } from './../utils/rating';

export enum TreesMode {
  NONE, TREEDETAIL, TREEADDMARKER, TREEADDINFO, TREEADDSAVE, TREESFILTER, TREENOTEEDIT, TREENOTEDELETE
}
export interface ITreesProps {
  params: any;
  location: any;
}
export interface ITreesStatus {
  trees?: Array<TreeModel>;
  treeId?: number;
  noteId?: number;
  zoom?: number;
  position?: L.LatLng;
  mode?: TreesMode;
  tile?: TileMode;
  location?: L.LatLng;
}
export default class TreesComponent extends React.Component<ITreesProps, ITreesStatus> {
  static contextTypes: any;
  constructor(props : ITreesProps) {
    super(props);
    let self: TreesComponent = this;
    this.state = {
      treeId: null,
      trees: null,
      noteId: null,
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
    let noteId = null;
    let mode: TreesMode = TreesMode.TREEDETAIL;
    let location: L.LatLng;
    let zoom: number = self.state.zoom;
    if (props.location.query.lat && props.location.query.lng && props.location.query.move == "true") {
      location = new L.LatLng(props.location.query.lat, props.location.query.lng);
      zoom = Settings.iFocusZoom;
    }

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
          // self.context.router.replace({pathname: Settings.uBaseName + '/'});
        } else {
          self.context.router.replace({pathname: Settings.uBaseName + '/trees/add', query: { mode: "marker" }});
        }
      }
    } else if (props.params.treeId == "filter") {
      mode = TreesMode.TREESFILTER;
    } else if (props.params.treeId) {
      if (props.location.query.note) {
        mode = TreesMode.TREENOTEEDIT;
        noteId = parseInt(props.location.query.note);
        if (props.location.query.mode == "delete") {
          mode = TreesMode.TREENOTEDELETE;
        }
      }
      treeId = parseInt(props.params.treeId);
    }
    self.setState({treeId: treeId, mode: mode, noteId: noteId, location: location, zoom: zoom});
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
    calcRating(function () {
      foodStore.fetchFoods();
      treeStore.fetchTrees();
    });
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
          <MapComponent tile={self.state.tile} mode={self.state.mode} treeId={self.state.treeId} foods={foodStore.getState().foods} trees={treeStore.getState().trees} onRender={self.onMapRender} zoom={self.state.zoom} onZoom={self.onZoom} position={self.state.position} offGeo={self.offGeo} location={self.props.location} />
          <TreesPanelComponent tile={self.state.tile} onTile={self.onTile} mode={self.state.mode} treeId={self.state.treeId} foods={foodStore.getState().foods} trees={treeStore.getState().trees} zoom={self.state.zoom} onZoom={self.onZoom} onGeo={self.onGeo} noteId={self.state.noteId} />
          <TreesMessageComponent mode={self.state.mode} treeId={self.state.treeId} noteId={self.state.noteId} />
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
