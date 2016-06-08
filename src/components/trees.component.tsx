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
import { noteStore } from './../stores/note.store';
import { treeActions } from './../actions/tree.actions';
import { foodActions } from './../actions/food.actions';
import MapComponent from './map.component' ;
import TreesPanelComponent from './trees-panel.component';
import TreesMessageComponent from './trees-message.component';
import { TileMode } from './map.component';
import { calcRating } from './../utils/rating';
import { mapStore } from './../stores/map.store';
import { flagStore } from './../stores/flag.store';
import { flagActions } from './../actions/flag.actions';
import MessageComponent from './message/message.component';

export enum TreesMode {
  NONE, TREES, TREEDETAIL, TREEDELETE, TREEADDMARKER, TREEADDINFO, TREEADDSAVE, TREESFILTER, TREENOTEEDIT, TREENOTEDELETE
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
      mode: TreesMode.TREES,
      tile: TileMode.GRAY
    };
  }
  public componentDidMount() {
    let self: TreesComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreesComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreesProps) {
    let self: TreesComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: ITreesProps) => {
    console.warn("- Update props -");
    let self: TreesComponent = this;
    let treeId = null;
    let noteId = null;
    let mode: TreesMode = TreesMode.TREES;
    if (props.params.treeId == "filter") {
      mode = TreesMode.TREESFILTER;
    } else if (props.params.treeId == "add") {
      if (props.location.query.mode == "marker") {
        mode = TreesMode.TREEADDMARKER;
        if (!treeStore.getState().temp) {
          setTimeout(function () {
            treeActions.resetTempTree();
          }, 0)
        }
      } else if (props.location.query.mode == "info") {
        if (treeStore.getState().temp) {
          mode = TreesMode.TREEADDINFO;
        } else {
          self.context.router.replace({pathname: Settings.uBaseName + '/tree/add', query: { mode: "marker" }});
        }
      }
    } else if (props.params.treeId) {
      mode = TreesMode.TREEDETAIL;
      treeId = parseInt(props.params.treeId);
      if (props.location.query.mode) {
        mode = TreesMode.TREEDELETE;
      } else if (props.location.query.note) {
        mode = TreesMode.TREENOTEEDIT;
        noteId = parseInt(props.location.query.note);
        if (props.location.query.mode == "delete") {
          mode = TreesMode.TREENOTEDELETE;
        }
      }
    }

    self.setState({mode: mode, treeId: treeId, noteId: noteId});



    // let location: L.LatLng;
    // let zoom: number = self.state.zoom;
    // if (props.location.query.lat && props.location.query.lng && props.location.query.move == "true") {
    //   location = new L.LatLng(props.location.query.lat, props.location.query.lng);
    //   zoom = Settings.iFocusZoom;
    // }
    //
    // if (props.params.treeId == "add") {
    //   treeId = 0;
    //   if (props.location.query.mode == "marker") {
    //     mode = TreesMode.TREEADDMARKER;
    //   } else if (props.location.query.mode == "info") {
    //     if (treeStore.getTree(0)) {
    //       mode = TreesMode.TREEADDINFO;
    //     } else {
    //       self.context.router.replace({pathname: Settings.uBaseName + '/trees/add', query: { mode: "marker" }});
    //     }
    //   } else if (props.location.query.mode == "save") {
    //     var tree: TreeModel = treeStore.getTree(0);
    //     if (tree) {
    //       treeStore.createTree(tree);
    //       // self.context.router.replace({pathname: Settings.uBaseName + '/'});
    //     } else {
    //       self.context.router.replace({pathname: Settings.uBaseName + '/trees/add', query: { mode: "marker" }});
    //     }
    //   }
    // } else if (props.params.treeId == "filter") {
    //   mode = TreesMode.TREESFILTER;
    // } else if (props.params.treeId) {
    //   if (props.location.query.note) {
    //     mode = TreesMode.TREENOTEEDIT;
    //     noteId = parseInt(props.location.query.note);
    //     if (props.location.query.mode == "delete") {
    //       mode = TreesMode.TREENOTEDELETE;
    //     }
    //   }
    //   treeId = parseInt(props.params.treeId);
    // }
    // self.setState({treeId: treeId, mode: mode, noteId: noteId, location: location, zoom: zoom});
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
    setTimeout(function() {
      flagActions.fetchFlags();
      foodActions.fetchFoods();
      calcRating(function () {
        if (self.state.treeId) {
          treeActions.fetchTrees(self.state.treeId);
        } else {
          treeActions.fetchTrees();
        }
      });
    }, 500);

  }
  public renderTree = (treeId: number) => {
    let self: TreesComponent = this;
    //self.setState({trees: self.state.trees, treeId: treeId, bClose: self.state.bClose});
  }
  // public changeLocation = () => {
  //   let self: TreesComponent = this;
  // }
  // onZoom = (zoom: number) => {
  //   let self: TreesComponent = this;
  //   self.setState({zoom: zoom});
  // }
  // onGeo = (position: Position) => {
  //   let self: TreesComponent = this;
  //   self.setState({position: new L.LatLng(position.coords.latitude, position.coords.longitude)});
  // }
  // offGeo = () => {
  //   let self: TreesComponent = this;
  //   self.setState({position: null});
  // }

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
            },
            tile: function (props) {
              return {
                store: mapStore,
                value: mapStore.getTile('map'),
              };
            },
            flags: function (props) {
              return {
                store: flagStore,
                value: flagStore.getState().flags
              };
            },
            tempTree: function (props) {
              return {
                store: treeStore,
                value: treeStore.getState().temp
              };
            },
          }
        }>
          <MapComponent mode={self.state.mode} treeId={self.state.treeId} onRender={self.onMapRender} />
          <TreesPanelComponent mode={self.state.mode} treeId={self.state.treeId} noteId={self.state.noteId} />
          <AltContainer stores={
            {
              noteCode: function (props) {
                return {
                  store: noteStore,
                  value: noteStore.getState().code,
                };
              }
            }
          }>
            <TreesMessageComponent mode={self.state.mode} treeId={self.state.treeId} noteId={self.state.noteId} />
          </AltContainer>
          <MessageComponent />
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
