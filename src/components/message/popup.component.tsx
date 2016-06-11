import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../../constraints/settings.json');
import * as styles from './popup.component.css';
import TreeComponent from './../tree/tree.component';
import { TreesMode } from './../trees.component';
import { DonationsMode } from './../donations/donations.component';
import TreesControlsComponent from './../trees-controls.component';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { NoteModel, noteStore } from './../../stores/note.store';
import { authStore } from './../../stores/auth.store';
import { checkLogin, checkAdmin } from './../../utils/authentication';
import { LogInStatus } from './../app.component';
import { noteActions } from './../../actions/note.actions';
import { treeActions } from './../../actions/tree.actions';
import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';
import { localization } from './../../constraints/localization';


export interface IPopupProps {
  mode: TreesMode;
  treeId: number;
  noteId: number;
  noteCode?: any;
}
export interface IPopupStatus {

}
export default class PopupComponent extends React.Component<IPopupProps, IPopupStatus> {
  static contextTypes: any;
  constructor(props : IPopupProps) {
    super(props);
    let self: PopupComponent = this;
    this.state = {

    };
  }
  public componentDidMount() {
    let self: PopupComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: PopupComponent = this;
  }
  public componentWillReceiveProps (nextProps: IPopupProps) {
    let self: PopupComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: IPopupProps) => {
    let self: PopupComponent = this;
  }

  render() {
    let self: PopupComponent = this;
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
                treeActions.createTree(treeStore.getState().temp);
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
      case TreesMode.TREEDELETE:
        let tree: TreeModel = treeStore.getTree(self.props.treeId);
        return (
          <div className={styles.wrapper + " " + styles.slidein + " " + styles.error}>
            <div className={styles.message}>
              <span dangerouslySetInnerHTML={{__html: localization(636)}} />
              <span className={styles.button2} onClick={()=> {
                if (tree && self.props.noteCode == 200) {
                  if (authStore.getAuth().getIsAdmin()) {
                    treeActions.deleteTree(tree);
                  }
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

PopupComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
