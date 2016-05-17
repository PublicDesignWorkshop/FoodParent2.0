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
import FoodComponent from './food.component';
import AddressComponent from './address.component';
import DescriptionComponent from './description.component';
import FlagComponent from './flag.component';
import OwnershipComponent from './ownership.component';
import LocationComponent from './location.component';
import { LogInStatus } from './../app.component';
import NoteListComponent from './../note/note-list.component';

export interface ITreeProps {
  foods: Array<FoodModel>;
  trees: Array<TreeModel>;
  treeId: number;
  noteId: number;
  login: LogInStatus;
  userId: number;
  notes: Array<NoteModel>;
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
    flagStore.fetchFlags();
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
      var tree: TreeModel = treeStore.getTree(props.treeId);
      let editable: boolean = false;
      if (tree) {
        if (props.login == LogInStatus.MANAGER || props.login == LogInStatus.ADMIN) {
          editable = true;
        } else {
          if (tree.getOwner() == props.userId && props.userId != 0) {
            editable = true;
          }
        }
        self.setState({editable: editable});
      }
    }
  }

  render() {
    let self: TreeComponent = this;
    if (self.props.treeId) {
      var tree: TreeModel = treeStore.getTree(self.props.treeId);
      var food: FoodModel = foodStore.getFood(tree.getFoodId());
      if (self.props.login == LogInStatus.ADMIN || self.props.login == LogInStatus.MANAGER) {
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
                <LocationComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
                <AddressComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
                <DescriptionComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
                <FlagComponent tree={tree} flags={flagStore.getState().flags} editable={self.state.editable} async={self.state.editable} />
                <OwnershipComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
                <NoteListComponent notes={self.props.notes} noteId={self.props.noteId} />
              </AltContainer>
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
            <div className={styles.basicinfo2}>
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
                <LocationComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
                <AddressComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
                <DescriptionComponent tree={tree} editable={self.state.editable} async={self.state.editable} />
                <NoteListComponent notes={self.props.notes} noteId={self.props.noteId} />
              </AltContainer>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className={styles.wrapper}>
        </div>
      );
    }
  }
}

TreeComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
