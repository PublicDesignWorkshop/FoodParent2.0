import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../../constraints/settings.json');
import * as styles from './tree.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { FlagModel, flagStore } from './../../stores/flag.store';
import { NoteModel, noteStore } from './../../stores/note.store';
import { authStore } from './../../stores/auth.store';
import { personStore } from './../../stores/person.store';
import FoodComponent from './food.component';
import AddressComponent from './address.component';
import DescriptionComponent from './description.component';
import FlagComponent from './flag.component';
import OwnershipComponent from './ownership.component';
import LocationComponent from './location.component';
import TreeParentsComponent from './tree-parents.component';
import { LogInStatus } from './../app.component';
import NoteListComponent from './../note/note-list.component';
import { personActions } from './../../actions/person.actions';
import { noteActions } from './../../actions/note.actions';

export interface ITreeProps {
  foods?: Array<FoodModel>;
  trees?: Array<TreeModel>;
  notes?: Array<NoteModel>;
  treeId: number;
  noteId: number;
}
export interface ITreeStatus {
  editable: boolean;
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
      setTimeout(function() {
        personActions.fetchPersons(tree.getParents());
      }, 0);
      setTimeout(function() {
        noteActions.fetchNotesFromTreeIds([tree.getId()]);
      }, 0);
      let editable: boolean = false;
      if (tree) {
        if (authStore.getAuth().getIsManager()) {
          editable = true;
        }
        if (tree.getOwner() == authStore.getAuth().getId() && authStore.getAuth().getId() != 0) {
          editable = true;
        }
        self.setState({editable: editable});
      }
    }
  }

  render() {
    let self: TreeComponent = this;
    if (self.props.treeId) {
      let tree: TreeModel = treeStore.getTree(self.props.treeId);
      let food: FoodModel = foodStore.getFood(tree.getFoodId());
      if (authStore.getAuth().getIsManager()) {
        return (
          <div className={styles.wrapper}>
            <div className={styles.treeinfo}>
              <FoodComponent tree={tree} foods={self.props.foods} editable={self.state.editable} async={self.state.editable} />
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.context.router.push({pathname: Settings.uBaseName + '/'});
                //self.setState({editable: self.state.editable});
              }} /></div>
            </div>
            <div className={styles.basicinfo}>
              <LocationComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
              <AddressComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
              <DescriptionComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
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
                <FlagComponent tree={tree} flags={flagStore.getState().flags} editable={self.state.editable} async={self.state.editable} />
              </AltContainer>
              <OwnershipComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
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
            <div className={styles.button} onClick={()=> {
              self.context.router.push({pathname: window.location.pathname, query: { mode: "delete" }});
            }}>
              DELETE TREE
            </div>
          </div>
        );
      } else {
        return (
          <div className={styles.wrapper}>
            <div className={styles.treeinfo}>
              <FoodComponent tree={tree} foods={self.props.foods} editable={self.state.editable} async={self.state.editable} />
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.context.router.push({pathname: Settings.uBaseName + '/'});
                //self.setState({editable: self.state.editable});
              }}/></div>
            </div>
            <div className={styles.basicinfo}>
              <LocationComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
              <AddressComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
              <DescriptionComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
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
          </div>
        );
      }
    }
    //
    //
    //   if (self.props.login == LogInStatus.ADMIN || self.props.login == LogInStatus.MANAGER) {
    //
    //   } else {
    //     return (
    //       <div className={styles.wrapper}>
    //         <div className={styles.treeinfo}>
    //           <FoodComponent tree={tree} foods={self.props.foods} editable={self.state.editable} async={self.state.editable} />
    //           <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
    //             self.context.router.push({pathname: Settings.uBaseName + '/'});
    //             //self.setState({editable: self.state.editable});
    //           }}/></div>
    //         </div>
    //         <div className={styles.basicinfo2}>
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
    //             <LocationComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
    //             <AddressComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
    //             <DescriptionComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
    //             <TreeParentsComponent login={self.props.login} tree={tree} userId={self.props.userId} />
    //             <NoteListComponent notes={self.props.notes} noteId={self.props.noteId} />
    //           </AltContainer>
    //         </div>
    //       </div>
    //     );
    //   }
    // } else {
    //   return (
    //     <div className={styles.wrapper}>
    //     </div>
    //   );
    // }
  }
}

TreeComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
