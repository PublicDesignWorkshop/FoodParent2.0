import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './popup-trees.component.css';
var Settings = require('./../../constraints/settings.json');

import { TreeModel, treeStore } from './../../stores/tree.store';
import { treeActions } from './../../actions/tree.actions';
import { NoteModel, noteStore } from './../../stores/note.store';
import { noteActions } from './../../actions/note.actions';
import { authStore } from './../../stores/auth.store';

import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';
import { TreesMode } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface IPopupTreesProps {
  mode: TreesMode;
  treeId: number;
  noteId: number;
  noteCode?: any;
  treeCode?: any;
}
export interface IPopupTreesStatus {

}

export default class PopupTreesComponent extends React.Component<IPopupTreesProps, IPopupTreesStatus> {
  static contextTypes: any;
  constructor(props : IPopupTreesProps) {
    super(props);
    let self: PopupTreesComponent = this;
    this.state = {

    };
  }

  public componentDidMount() {
    let self: PopupTreesComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: PopupTreesComponent = this;
  }

  public componentWillReceiveProps (nextProps: IPopupTreesProps) {
    let self: PopupTreesComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: IPopupTreesProps) => {
    let self: PopupTreesComponent = this;
  }

  render() {
    let self: PopupTreesComponent = this;
    switch (self.props.mode) {
      case TreesMode.TREEADDMARKER:
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.message}>
              <span dangerouslySetInnerHTML={{__html: localization(640)}} />
              <span className={styles.button} onClick={()=> {
                self.context.router.replace({pathname: Settings.uBaseName + '/tree/add', query: { mode: "info" }});
              }}>
                {localization(929)}
              </span>
            </div>
          </div>
        );
      case TreesMode.TREEADDINFO:
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.message}>
              <span dangerouslySetInnerHTML={{__html: localization(641)}} />
              <span className={styles.button} onClick={()=> {
                if (treeStore.getState().temp.getFoodId() == 0) {
                  displayErrorMessage(localization(643));
                } else {
                  treeActions.createTree(treeStore.getState().temp);
                }
              }}>
                {localization(930)}
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
              }}>
                {localization(931)}
              </span>
              <span className={styles.button2} onClick={()=> {
                if (self.props.noteCode == 200) {
                  self.context.router.goBack();
                }
              }}>
                {localization(933)}
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
                if (tree && self.props.treeCode == 200) {
                  if (authStore.getAuth().getIsAdmin() || authStore.getAuth().getIsAccessibleTempTree(tree.getId())) {
                    treeActions.deleteTree(tree);
                  }
                }
              }}>
                {localization(931)}
              </span>
              <span className={styles.button2} onClick={()=> {
                if (tree && self.props.treeCode == 200) {
                  self.context.router.goBack();
                }
              }}>
                {localization(933)}
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

PopupTreesComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
