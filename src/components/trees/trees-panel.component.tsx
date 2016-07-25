import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as moment from 'moment';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './trees-panel.component.css';
var Settings = require('./../../constraints/settings.json');

import TreeComponent from './../tree/tree.component';
import TreeAddComponent from './../tree/tree-add.component';;
import TreesControlsComponent from './trees-controls.component';
import NoteAddComponent from './../note/note-add.component';
import NoteEditComponent from './../note/note-edit.component';
import TrresFilterComponent from './../filter/trees-filter.component';
import NotifyComponent from './../notify/notify.component';
import TreeGraphComponent from './../tree/tree-graph.component';

import { TreeModel, treeStore } from './../../stores/tree.store';
import { FoodModel } from './../../stores/food.store';
import { FlagModel, flagStore } from './../../stores/flag.store';
import { noteStore } from './../../stores/note.store';
import { TileMode, TreesMode } from './../../utils/enum';
import { mapActions } from './../../actions/map.actions';

import { localization } from './../../constraints/localization';

export interface ITreesPanelProps {
  treeId: number;
  noteId: number;
  foods?: Array<FoodModel>;
  trees?: Array<TreeModel>;
  flags?: Array<FlagModel>;
  tile?: TileMode;
  mode: TreesMode;
}
export interface ITreesPanelStatus {
  open?: boolean;
}

export default class TreesPanelComponent extends React.Component<ITreesPanelProps, ITreesPanelStatus> {
  static contextTypes: any;
  constructor(props : ITreesPanelProps) {
    super(props);
    let self: TreesPanelComponent = this;
    self.state = {
      open: false,
    };
  }

  public componentDidMount() {
    let self: TreesPanelComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: TreesPanelComponent = this;
  }

  public componentWillReceiveProps (nextProps: ITreesPanelProps) {
    let self: TreesPanelComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ITreesPanelProps) => {
    let self: TreesPanelComponent = this;
    let tree: TreeModel = treeStore.getTree(props.treeId);
    let open: boolean = false;
    if (tree || props.mode == TreesMode.TREESFILTER ||  props.mode == TreesMode.TREEADDINFO || props.mode == TreesMode.NOTIFY) {
      open = true;
    }
    self.setState({open: open});
  }

  render() {
    let self: TreesPanelComponent = this;
    if (!self.state.open) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <TreesControlsComponent tile={self.props.tile} mode={self.props.mode} />
          </div>
          <div className={styles.right}>
          </div>
        </div>
      );
    } else {
      switch(self.props.mode) {
        case TreesMode.TREEDETAIL:
        case TreesMode.TREEDELETE:
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <TreesControlsComponent tile={self.props.tile} mode={self.props.mode} />
              </div>
              <div className={styles.right}>
                <TreeComponent trees={self.props.trees} foods={self.props.foods} treeId={self.props.treeId} noteId={self.props.noteId} />
                <div className={styles.buttongroup}>
                  <div className={styles.button2 + " " + styles.locate} onClick={()=> {
                    let tree: TreeModel = treeStore.getTree(self.props.treeId);
                    if (tree) {
                      mapActions.moveToWithMarker('map', tree.getLocation(), Settings.iFocusZoom);
                    }
                  }}>{localization(961)}</div>
                  <div className={styles.button2 + " " + styles.selected}>{localization(962)}</div>
                  <div className={styles.button2} onClick={()=> {
                    self.context.router.push({pathname: window.location.pathname, query: { mode: "graph" }});
                  }}>{localization(963)}</div>
                </div>
                <AltContainer stores={
                  {
                    note: function (props) {
                      return {
                        store: noteStore,
                        value: noteStore.getState().temp,
                      };
                    },
                    code: function (props) {
                      return {
                        store: noteStore,
                        value: noteStore.getState().code,
                      };
                    }
                  }
                }>
                  <NoteAddComponent treeId={self.props.treeId} />
                </AltContainer>
              </div>
            </div>
          );
        case TreesMode.TREEGRAPH:
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <TreesControlsComponent tile={self.props.tile} mode={self.props.mode} />
              </div>
              <div className={styles.right}>
                <TreeComponent trees={self.props.trees} foods={self.props.foods} treeId={self.props.treeId} noteId={self.props.noteId} />
                <div className={styles.buttongroup}>
                  <div className={styles.button2 + " " + styles.locate} onClick={()=> {
                    let tree: TreeModel = treeStore.getTree(self.props.treeId);
                    if (tree) {
                      mapActions.moveToWithMarker('map', tree.getLocation(), Settings.iFocusZoom);
                    }
                  }}>{localization(961)}</div>
                  <div className={styles.button2} onClick={()=> {
                    self.context.router.push({pathname: window.location.pathname});
                  }}>{localization(962)}</div>
                  <div className={styles.button2 + " " + styles.selected}>{localization(963)}</div>
                </div>
                <AltContainer stores={
                  {
                    tree: function (props) {
                      return {
                        store: treeStore,
                        value: treeStore.getTree(self.props.treeId),
                      };
                    },
                    notes: function (props) {
                      return {
                        store: noteStore,
                        value: noteStore.getState().notes,
                      };
                    }
                  }
                }>
                  <TreeGraphComponent />
                </AltContainer>
              </div>
            </div>
          );
        case TreesMode.TREENOTEEDIT:
        case TreesMode.TREENOTEDELETE:
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <TreesControlsComponent tile={self.props.tile} mode={self.props.mode} />
              </div>
              <div className={styles.right}>
                <TreeComponent trees={self.props.trees} foods={self.props.foods} treeId={self.props.treeId} noteId={self.props.noteId} />
                <div className={styles.buttongroup}>
                  <div className={styles.button2 + " " + styles.locate} onClick={()=> {
                    let tree: TreeModel = treeStore.getTree(self.props.treeId);
                    if (tree) {
                      mapActions.moveToWithMarker('map', tree.getLocation(), Settings.iFocusZoom);
                    }
                  }}>{localization(961)}</div>
                  <div className={styles.button2} onClick={()=> {
                    self.context.router.push({pathname: window.location.pathname});
                  }}>{localization(962)}</div>
                  <div className={styles.button2} onClick={()=> {
                    self.context.router.push({pathname: window.location.pathname, query: { mode: "graph" }});
                  }}>{localization(963)}</div>
                </div>
                <AltContainer stores={
                  {
                    note: function (props) {
                      return {
                        store: noteStore,
                        value: noteStore.getNote(self.props.noteId),
                      };
                    },
                    code: function (props) {
                      return {
                        store: noteStore,
                        value: noteStore.getState().code,
                      };
                    }
                  }
                }>
                  <NoteEditComponent trees={self.props.trees} foods={self.props.foods} treeId={self.props.treeId} note={noteStore.getNote(self.props.noteId)} />
                </AltContainer>
              </div>
            </div>
          );
        case TreesMode.TREESFILTER:
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <TreesControlsComponent tile={self.props.tile} mode={self.props.mode} />
              </div>
              <div className={styles.right}>
                <AltContainer stores={
                  {
                    flags: function (props) {
                      return {
                        store: flagStore,
                        value: flagStore.getState().flags
                      };
                    }
                  }
                }>
                  <TrresFilterComponent foods={self.props.foods} trees={self.props.trees} />
                </AltContainer>
              </div>
            </div>
          );
        case TreesMode.TREEADDINFO:
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <TreesControlsComponent tile={self.props.tile} mode={self.props.mode} />
              </div>
              <div className={styles.right}>
                <AltContainer stores={
                  {
                    tree: function (props) {
                      return {
                        store: treeStore,
                        value: treeStore.getState().temp,
                      };
                    },
                    code: function (props) {
                      return {
                        store: treeStore,
                        value: treeStore.getState().code,
                      };
                    }
                  }
                }>
                  <TreeAddComponent trees={self.props.trees} foods={self.props.foods} />
                </AltContainer>
              </div>
            </div>
          );
        case TreesMode.NOTIFY:
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <TreesControlsComponent tile={self.props.tile} mode={self.props.mode} />
              </div>
              <div className={styles.right}>
                <NotifyComponent />
              </div>
            </div>
          );
      }
    }
  }
}

TreesPanelComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
