import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';
import * as moment from 'moment';

var Settings = require('./../constraints/settings.json');
import * as styles from './trees-panel.component.css';
import TreeComponent from './tree/tree.component';
import TreeAddComponent from './tree/tree-add.component';
import { TreesMode } from './trees.component';
import TreesControlsComponent from './trees-controls.component';
import NoteAddComponent from './note/note-add.component';
import NoteEditComponent from './note/note-edit.component';
import TrresFilterComponent from './filter/trees-filter.component';
import { TreeModel, treeStore } from './../stores/tree.store';
import { FoodModel, foodStore } from './../stores/food.store';
import { FlagModel, flagStore } from './../stores/flag.store';
import { NoteModel, noteStore, NoteType, PickupTime, AmountType } from './../stores/note.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { checkLogin, checkAdmin } from './../utils/authentication';
import { LogInStatus } from './app.component';
import { TileMode } from './map.component';

export interface ITreesPanelProps {
  treeId: number;
  noteId: number;
  foods: Array<FoodModel>;
  trees: Array<TreeModel>;
  zoom: number;
  onZoom: Function;
  onGeo: PositionCallback;
  mode: TreesMode;
  tile: TileMode;
  onTile: Function;
}
export interface ITreesPanelStatus {
  login?: LogInStatus;
  userId?: number;
  open?: boolean;
}
export default class TreesPanelComponent extends React.Component<ITreesPanelProps, ITreesPanelStatus> {
  static contextTypes: any;
  private bFirstLoad: boolean;
  constructor(props : ITreesPanelProps) {
    super(props);
    let self: TreesPanelComponent = this;
    self.bFirstLoad = true;
    self.state = {
      login: LogInStatus.GUEST,
      userId: null,
      open: false,
    };
  }
  public componentDidMount() {
    let self: TreesPanelComponent = this;
    self.updateProps(self.props);
    self.createNewNote();
  }
  public componentWillUnmount() {
    let self: TreesPanelComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreesPanelProps) {
    let self: TreesPanelComponent = this;
    if (self.bFirstLoad || self.props.treeId != nextProps.treeId) {
      self.updateProps(nextProps);
    }
  }

  private createNewNote = () => {
    let self: TreesPanelComponent = this;
    let note: NoteModel = new NoteModel({
      id: "0",
      type: NoteType.POST.toString(),
      tree: "0",
      person: "0",
      comment: "",
      picture: "",
      rate: "0",
      amount: "0",
      proper: PickupTime.PROPER.toString(),
      date: moment(new Date()).format(Settings.sServerDateFormat),
    });
    noteStore.addNote(note);
  }

  private updateProps = (props: ITreesPanelProps) => {
    let self: TreesPanelComponent = this;
    if (props.trees.length != 0 && props.foods.length != 0) {
      var tree: TreeModel = treeStore.getTree(props.treeId);
      let open: boolean = false;
      if (tree) {
        self.bFirstLoad = false;
        open = true;
        setTimeout(function () {
          let treeIds: Array<number> = new Array<number>();
          treeIds.push(tree.getId());
          noteStore.fetchNotesFromTreeIds(treeIds);
        }, 1);
      }
      addLoading();
      checkLogin(function(response1) { // login
        checkAdmin(function(response2) { // Admin
          console.log("manager");
          removeLoading();
          self.setState({login: LogInStatus.MANAGER, userId: parseInt(response1.id), open: open});
        }, function(response) { // Parent
          console.log("parent");
          removeLoading();
          self.setState({login: LogInStatus.PARENT, userId: parseInt(response1.id), open: open});
        }, function(response) { // Error
          removeLoading();
        });
      }, function(response) { // Not logged in
        removeLoading();
        console.log("guest");
        self.setState({login: LogInStatus.GUEST, userId: 0, open: open});
      }, function(response) { // Error
        removeLoading();
      });
    }
  }

  render() {
    let self: TreesPanelComponent = this;
    switch(self.props.mode) {
      case TreesMode.TREEDETAIL:
        if (self.state.open) {
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
              </div>
              <div className={styles.right}>
                <AltContainer stores={
                  {
                    notes: function (props) {
                      return {
                        store: noteStore,
                        value: noteStore.getState().notes,
                      };
                    },
                    error: function (props) {
                      return {
                        store: noteStore,
                        value: new Array<string>(noteStore.getState().errorMessage),
                      };
                    }
                  }
                }>
                  <TreeComponent login={self.state.login} userId={self.state.userId} treeId={self.props.treeId} foods={self.props.foods} trees={self.props.trees} notes={noteStore.getState().notes}/>
                </AltContainer>
                <AltContainer stores={
                  {
                    note: function (props) {
                      return {
                        store: noteStore,
                        value: noteStore.getNote(0),
                      };
                    },
                    error: function (props) {
                      return {
                        store: noteStore,
                        value: new Array<string>(noteStore.getState().errorMessage),
                      };
                    }
                  }
                }>
                  <NoteAddComponent login={self.state.login} userId={self.state.userId} treeId={self.props.treeId} trees={self.props.trees} note={noteStore.getNote(0)} error={new Array<string>(noteStore.getState().errorMessage)} />
                </AltContainer>
              </div>
            </div>
          );
        } else {
          return (
            <div className={styles.wrapper}>
              <div className={styles.left}>
                <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
              </div>
              <div className={styles.right}>
              </div>
            </div>
          );
        }
      case TreesMode.TREEADDMARKER:
        return (
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
            </div>
            <div className={styles.right}>
            </div>
          </div>
        );
      case TreesMode.TREEADDINFO:
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.left}>
              <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
            </div>
            <div className={styles.right}>
              <TreeAddComponent login={self.state.login} userId={self.state.userId} treeId={self.props.treeId} foods={self.props.foods} trees={self.props.trees} />
            </div>
          </div>
        );
      case TreesMode.TREESFILTER:
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.left}>
              <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
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
                <TrresFilterComponent foods={self.props.foods} trees={self.props.trees} flags={flagStore.getState().flags} />
              </AltContainer>
            </div>
          </div>
        );
      case TreesMode.TREENOTEEDIT:
        if (self.state.open) {
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
              </div>
              <div className={styles.right}>
                <AltContainer stores={
                  {
                    notes: function (props) {
                      return {
                        store: noteStore,
                        value: noteStore.getState().notes,
                      };
                    },
                    error: function (props) {
                      return {
                        store: noteStore,
                        value: new Array<string>(noteStore.getState().errorMessage),
                      };
                    }
                  }
                }>
                  <TreeComponent login={self.state.login} userId={self.state.userId} treeId={self.props.treeId} foods={self.props.foods} trees={self.props.trees} notes={noteStore.getState().notes}/>
                </AltContainer>
                <AltContainer stores={
                  {
                    note: function (props) {
                      return {
                        store: noteStore,
                        value: noteStore.getNote(self.props.noteId),
                      };
                    },
                    error: function (props) {
                      return {
                        store: noteStore,
                        value: new Array<string>(noteStore.getState().errorMessage),
                      };
                    }
                  }
                }>
                  <NoteEditComponent login={self.state.login} userId={self.state.userId} treeId={self.props.treeId} trees={self.props.trees} note={noteStore.getNote(self.props.noteId)} error={new Array<string>(noteStore.getState().errorMessage)} />
                </AltContainer>
              </div>
            </div>
          );
        } else {
          return (
            <div className={styles.wrapper}>
              <div className={styles.left}>
                <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
              </div>
              <div className={styles.right}>
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
