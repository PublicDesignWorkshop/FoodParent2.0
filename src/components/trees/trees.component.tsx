import * as $ from 'jquery';
import * as React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as L from 'leaflet';
import './../../../node_modules/leaflet/dist/leaflet.css';
import * as styles from './trees.component.css';
var Settings = require('./../../constraints/settings.json');

import TreesPanelComponent from './trees-panel.component';
import TreesMapComponent from './trees-map.component';
import PopupTreesComponent from './../message/popup-trees.component';
import MessageComponent from './../message/message.component';

import { treeStore, TreeModel } from './../../stores/tree.store';
import { treeActions } from './../../actions/tree.actions';
import { foodStore } from './../../stores/food.store';
import { foodActions } from './../../actions/food.actions';
import { noteStore } from './../../stores/note.store';
import { flagStore } from './../../stores/flag.store';
import { flagActions } from './../../actions/flag.actions';
import { mapStore } from './../../stores/map.store';

import { TileMode, TreesMode } from './../../utils/enum';
import { calcRating } from './../../utils/rating';
import { resetFilter } from './../../utils/filter';

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
    treeActions.resetTrees();
    resetFilter();
    self.updateProps(self.props);
    $(document).on('keyup',function(evt) {
      if (evt.keyCode == 27) {
        if (self.state.mode != TreesMode.TREES) {
          self.context.router.push({pathname: Settings.uBaseName + '/'});
        }
      }
    });
  }
  public componentWillUnmount() {
    let self: TreesComponent = this;
    $(document).off('keyup');
  }
  public componentWillReceiveProps (nextProps: ITreesProps) {
    let self: TreesComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: ITreesProps) => {
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
      if (props.location.query.mode == "graph") {
        mode = TreesMode.TREEGRAPH;
      }
      if (props.location.query.mode == "delete") {
        mode = TreesMode.TREEDELETE;
      }
      if (props.location.query.note) {
        mode = TreesMode.TREENOTEEDIT;
        noteId = parseInt(props.location.query.note);
        if (props.location.query.mode == "delete") {
          mode = TreesMode.TREENOTEDELETE;
        }
      }
    }
    self.setState({mode: mode, treeId: treeId, noteId: noteId});
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
    }, Settings.iMapRenderDelay);
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
            position: function (props) {
              return {
                store: mapStore,
                value: mapStore.getState().position
              };
            },
          }
        }>
          <TreesMapComponent mode={self.state.mode} treeId={self.state.treeId} onRender={self.onMapRender} />
          <TreesPanelComponent mode={self.state.mode} treeId={self.state.treeId} noteId={self.state.noteId} />
          <AltContainer stores={
            {
              noteCode: function (props) {
                return {
                  store: noteStore,
                  value: noteStore.getState().code,
                };
              },
              treeCode: function (props) {
                return {
                  store: treeStore,
                  value: treeStore.getState().code,
                };
              }
            }
          }>
            <PopupTreesComponent mode={self.state.mode} treeId={self.state.treeId} noteId={self.state.noteId} />
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
