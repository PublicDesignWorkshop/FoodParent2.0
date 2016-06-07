import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../constraints/settings.json');
import * as styles from './trees-message.component.css';
import TreeComponent from './tree/tree.component';
import { TreesMode } from './trees.component';
import TreesControlsComponent from './trees-controls.component';
import { TreeModel, treeStore } from './../stores/tree.store';
import { FoodModel, foodStore } from './../stores/food.store';
import { NoteModel, noteStore } from './../stores/note.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { checkLogin, checkAdmin } from './../utils/authentication';
import { LogInStatus } from './app.component';
import { noteActions } from './../actions/note.actions';
import { displaySuccessMessage, displayErrorMessage } from './../utils/message';
import { localization } from './../constraints/localization';


export interface ITreesMessageProps {
  mode: TreesMode;
  treeId: number;
  noteId: number;
  noteCode?: any;
}
export interface ITreesMessageStatus {

}
export default class TreesMessageComponent extends React.Component<ITreesMessageProps, ITreesMessageStatus> {
  static contextTypes: any;
  constructor(props : ITreesMessageProps) {
    super(props);
    let self: TreesMessageComponent = this;
    this.state = {

    };
  }
  public componentDidMount() {
    let self: TreesMessageComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreesMessageComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreesMessageProps) {
    let self: TreesMessageComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ITreesMessageProps) => {
    let self: TreesMessageComponent = this;
  }

  render() {
    let self: TreesMessageComponent = this;
    switch (self.props.mode) {
      case TreesMode.TREEADDMARKER:
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.message}>
              <strong>Move</strong> the <strong>New Tree</strong> to a designated location.
              <span className={styles.button} onClick={()=> {
                self.context.router.replace({pathname: Settings.uBaseName + '/tree/add', query: { mode: "info" }});
              }} >
                NEXT
              </span>
            </div>
          </div>
        );
      case TreesMode.TREEADDINFO:
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.message}>
              <strong>Fill out</strong> information for the <strong>New Tree</strong>.
              <span className={styles.button} onClick={()=> {
                self.context.router.replace({pathname: Settings.uBaseName + '/tree/add', query: { mode: "save" }});
              }} >
                SAVE
              </span>
            </div>
          </div>
        );
      case TreesMode.TREENOTEDELETE:
        let note: NoteModel = noteStore.getNote(self.props.noteId);
        return (
          <div className={styles.wrapper + " " + styles.slidein + " " + styles.error}>
            <div className={styles.message}>
              <span dangerouslySetInnerHTML={{__html: localization(606)}} />
              <span className={styles.button2} onClick={()=> {
                if (self.props.noteCode == 200) {
                  noteActions.deleteNote(note);
                }
              }} >
                DELETE
              </span>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.wrapper}>
          </div>
        );
    }
  }
}

TreesMessageComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
