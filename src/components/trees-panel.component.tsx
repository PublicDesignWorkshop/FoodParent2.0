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
import { TileMode } from './map.component';
import { noteActions } from './../actions/note.actions';

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
    if (tree || props.mode == TreesMode.TREESFILTER) {
      open = true;
      setTimeout(function () {
        // let treeIds: Array<number> = new Array<number>();
        // treeIds.push(tree.getId());
        // noteStore.fetchNotesFromTreeIds(treeIds);
      }, 0);
    }
    self.setState({open: open});
  }

  render() {
    let self: TreesPanelComponent = this;
    console.log(self.props.mode);
    if (!self.state.open) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <TreesControlsComponent tile={self.props.tile} />
          </div>
          <div className={styles.right}>
          </div>
        </div>
      );
    } else {
      switch(self.props.mode) {
        case TreesMode.TREEDETAIL:
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.left}>
              <TreesControlsComponent tile={self.props.tile} />
            </div>
            <div className={styles.right}>
              <TreeComponent trees={self.props.trees} foods={self.props.foods} treeId={self.props.treeId} noteId={self.props.noteId} />
              <AltContainer stores={
                {
                  note: function (props) {
                    return {
                      store: noteStore,
                      value: noteStore.getState().temp,
                    };
                  }
                }
              }>
                <NoteAddComponent treeId={self.props.treeId} />
              </AltContainer>
            </div>
          </div>
        );
        case TreesMode.TREENOTEEDIT:
        case TreesMode.TREENOTEDELETE:
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <TreesControlsComponent tile={self.props.tile} />
              </div>
              <div className={styles.right}>
                <TreeComponent trees={self.props.trees} foods={self.props.foods} treeId={self.props.treeId} noteId={self.props.noteId} />
                <AltContainer stores={
                  {
                    note: function (props) {
                      return {
                        store: noteStore,
                        value: noteStore.getNote(self.props.noteId),
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
                <TreesControlsComponent tile={self.props.tile} />
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
      }
    }





    //
    //

    //
    //
    //
    //
    //
    //
    //
    //
    //     } else {
    //
    //     }
    //   case TreesMode.TREEADDMARKER:
    //     return (
    //       <div className={styles.wrapper}>
    //         <div className={styles.left}>
    //           <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
    //         </div>
    //         <div className={styles.right}>
    //         </div>
    //       </div>
    //     );
    //   case TreesMode.TREEADDINFO:
    //     return (
    //       <div className={styles.wrapper + " " + styles.slidein}>
    //         <div className={styles.left}>
    //           <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
    //         </div>
    //         <div className={styles.right}>
    //           <TreeAddComponent login={self.state.login} userId={self.state.userId} treeId={self.props.treeId} foods={self.props.foods} trees={self.props.trees} />
    //         </div>
    //       </div>
    //     );
    //   case TreesMode.TREESFILTER:
    //     return (
    //       <div className={styles.wrapper + " " + styles.slidein}>
    //         <div className={styles.left}>
    //           <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
    //         </div>
    //         <div className={styles.right}>
    //           <AltContainer stores={
    //             {
    //               flags: function (props) {
    //                 return {
    //                   store: flagStore,
    //                   value: flagStore.getState().flags
    //                 };
    //               }
    //             }
    //           }>
    //             <TrresFilterComponent login={self.state.login} foods={self.props.foods} trees={self.props.trees} flags={flagStore.getState().flags} />
    //           </AltContainer>
    //         </div>
    //       </div>
    //     );
    //   case TreesMode.TREENOTEEDIT:
    //   case TreesMode.TREENOTEDELETE:
    //     if (self.state.open) {
    //       return (
    //         <div className={styles.wrapper + " " + styles.slidein}>
    //           <div className={styles.left}>
    //             <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
    //           </div>
    //           <div className={styles.right}>
    //             <AltContainer stores={
    //               {
    //                 notes: function (props) {
    //                   return {
    //                     store: noteStore,
    //                     value: noteStore.getState().notes,
    //                   };
    //                 },
    //                 error: function (props) {
    //                   return {
    //                     store: noteStore,
    //                     value: new Array<string>(noteStore.getState().errorMessage),
    //                   };
    //                 }
    //               }
    //             }>
    //               <TreeComponent login={self.state.login} userId={self.state.userId} treeId={self.props.treeId} noteId={self.props.noteId} foods={self.props.foods} trees={self.props.trees} notes={noteStore.getState().notes}/>
    //             </AltContainer>
    //             <AltContainer stores={
    //               {
    //                 foods: function (props) {
    //                   return {
    //                     store: foodStore,
    //                     value: foodStore.getState().foods
    //                   };
    //                 },
    //                 note: function (props) {
    //                   return {
    //                     store: noteStore,
    //                     value: noteStore.getNote(self.props.noteId),
    //                   };
    //                 },
    //                 error: function (props) {
    //                   return {
    //                     store: noteStore,
    //                     value: new Array<string>(noteStore.getState().errorMessage),
    //                   };
    //                 }
    //               }
    //             }>
    //               <NoteEditComponent login={self.state.login} userId={self.state.userId} treeId={self.props.treeId} trees={self.props.trees} note={noteStore.getNote(self.props.noteId)} error={new Array<string>(noteStore.getState().errorMessage)} foods={foodStore.getState().foods} />
    //             </AltContainer>
    //           </div>
    //         </div>
    //       );
    //     } else {
    //       return (
    //         <div className={styles.wrapper}>
    //           <div className={styles.left}>
    //             <TreesControlsComponent login={self.state.login} zoom={self.props.zoom} onZoom={self.props.onZoom} onGeo={self.props.onGeo} tile={self.props.tile} onTile={self.props.onTile} />
    //           </div>
    //           <div className={styles.right}>
    //           </div>
    //         </div>
    //       );
    //     }
    // }
  }
}

TreesPanelComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
