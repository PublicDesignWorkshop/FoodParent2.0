import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './tree.component.css';
var Settings = require('./../../constraints/settings.json');

import TreeFoodComponent from './tree-food.component';
import TreeAddressComponent from './tree-address.component';
import TreeDescriptionComponent from './tree-description.component';
import TreeFlagComponent from './tree-flag.component';
import TreeOwnershipComponent from './tree-ownership.component';
import TreeLocationComponent from './tree-location.component';
import TreeParentsComponent from './tree-parents.component';
import NoteListComponent from './../note/note-list.component';

import { TreeModel, treeStore } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { flagStore } from './../../stores/flag.store';
import { NoteModel, noteStore } from './../../stores/note.store';
import { noteActions } from './../../actions/note.actions';
import { authStore } from './../../stores/auth.store';
import { personStore } from './../../stores/person.store';
import { personActions } from './../../actions/person.actions';

import { localization } from './../../constraints/localization';
import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';

export interface ITreeProps {
  foods?: Array<FoodModel>;
  trees?: Array<TreeModel>;
  notes?: Array<NoteModel>;
  treeId: number;
  noteId: number;
}
export interface ITreeStatus {
  treeId?: number;
  editable?: boolean;
}
export default class TreeComponent extends React.Component<ITreeProps, ITreeStatus> {
  static contextTypes: any;
  constructor(props : ITreeProps) {
    super(props);
    let self: TreeComponent = this;
    self.state = {
      editable: false,
    };
  }
  public componentDidMount() {
    let self: TreeComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: TreeComponent = this;
  }

  public componentWillReceiveProps (nextProps: ITreeProps) {
    let self: TreeComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ITreeProps) => {
    let self: TreeComponent = this;
    if (props.trees.length != 0 && props.foods.length != 0) {
      let tree: TreeModel = treeStore.getTree(props.treeId);
      if (authStore.getAuth().getIsManager() && self.props.treeId != props.treeId) {
        setTimeout(function() {
          personActions.fetchPersons(tree.getParents());
        }, 0);
      }
      // Fetch only when different tree is selected.
      if (self.state.treeId != props.treeId) {
        setTimeout(function() {
          noteActions.fetchNotesFromTreeIds([tree.getId()]);
        }, 0);
      }
      let editable: boolean = false;
      if (tree) {
        if (authStore.getAuth().getIsManager()) {
          editable = true;
        }
        // if (tree.getOwner() == authStore.getAuth().getId() && authStore.getAuth().getId() != 0) {
        //   editable = true;
        // }
        if (authStore.getAuth().getIsAccessibleTempTree(tree.getId())) {
          editable = true;
          displaySuccessMessage(localization(675));
        }
      }
      self.setState({editable: editable, treeId: props.treeId});
    }
  }

  render() {
    let self: TreeComponent = this;
    if (self.props.treeId) {
      let tree: TreeModel = treeStore.getTree(self.props.treeId);
      let food: FoodModel = foodStore.getFood(tree.getFoodId());
      let deleteTree: JSX.Element;
      if (authStore.getAuth().getIsAdmin() || authStore.getAuth().getIsAccessibleTempTree(tree.getId())) {
        deleteTree = <div className={styles.button} onClick={()=> {
          self.context.router.push({pathname: window.location.pathname, query: { mode: "delete" }});
        }}>
          {localization(965)}
        </div>;
      }
      if (authStore.getAuth().getIsManager()) {
        return (
          <div className={styles.wrapper}>
            <div className={styles.treeinfo}>
              <TreeFoodComponent tree={tree} foods={self.props.foods} editable={self.state.editable} async={self.state.editable} />
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.context.router.push({pathname: Settings.uBaseName + '/'});
              }} /></div>
            </div>
            <div className={styles.basicinfo}>
              <TreeLocationComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
              <TreeAddressComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
              <TreeDescriptionComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
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
                <TreeFlagComponent tree={tree} flags={flagStore.getState().flags} editable={self.state.editable} async={self.state.editable} />
              </AltContainer>
              <TreeOwnershipComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
              <AltContainer stores={
                {
                  persons: function (props) {
                    return {
                      store: personStore,
                      value: personStore.getState().persons
                    };
                  }
                }
              }>
                <TreeParentsComponent tree={tree} />
              </AltContainer>
              <AltContainer stores={
                {
                  notes: function (props) {
                    return {
                      store: noteStore,
                      value: noteStore.getState().notes,
                    };
                  }
                }
              }>
                <NoteListComponent noteId={self.props.noteId} />
              </AltContainer>
            </div>
            {deleteTree}
          </div>
        );
      } else {
        return (
          <div className={styles.wrapper}>
            <div className={styles.treeinfo}>
              <TreeFoodComponent tree={tree} foods={self.props.foods} editable={self.state.editable} async={self.state.editable} />
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.context.router.push({pathname: Settings.uBaseName + '/'});
              }}/></div>
            </div>
            <div className={styles.basicinfo}>
              <TreeLocationComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
              <TreeAddressComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
              <TreeDescriptionComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
              <AltContainer stores={
                {
                  persons: function (props) {
                    return {
                      store: personStore,
                      value: personStore.getState().persons
                    };
                  }
                }
              }>
                <TreeParentsComponent tree={tree} />
              </AltContainer>
              <AltContainer stores={
                {
                  notes: function (props) {
                    return {
                      store: noteStore,
                      value: noteStore.getState().notes,
                    };
                  }
                }
              }>
                <NoteListComponent noteId={self.props.noteId} />
              </AltContainer>
            </div>
            {deleteTree}
          </div>
        );
      }
    }
  }
}

TreeComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
