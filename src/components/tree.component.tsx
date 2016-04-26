import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../constraints/settings.json');
import * as styles from './tree.component.css';
import { TreeModel, treeStore } from './../stores/tree.store';
import { FoodModel, foodStore } from './../stores/food.store';
import { FlagModel, flagStore } from './../stores/flag.store';
import { OwnershipModel, ownershipStore } from './../stores/ownership.store';
import AddressComponent from './address.component';
import DescriptionComponent from './description.component';
import FlagComponent from './flag.component';
import PublicComponent from './pub.component';
import LocationComponent from './location.component';
import { LogInStatus } from './app.component';

export interface ITreeProps {
  foods: Array<FoodModel>;
  trees: Array<TreeModel>;
  treeId: number;
  login: LogInStatus;
  userId: number;
}
export interface ITreeStatus {
  bOpen: boolean;
  bEditable: boolean;
}
export default class TreeComponent extends React.Component<ITreeProps, ITreeStatus> {
  static contextTypes: any;
  constructor(props : ITreeProps) {
    super(props);
    let self: TreeComponent = this;
    this.state = {
      bOpen: false,
      bEditable: false,
    };
  }
  public componentDidMount() {
    let self: TreeComponent = this;
    flagStore.fetchFlags();
    //ownershipStore.fetchOwnerships();
  }
  public componentWillUnmount() {
    let self: TreeComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreeProps) {
    let self: TreeComponent = this;
    if (nextProps.trees.length != 0 && nextProps.foods.length != 0) {
      var tree: TreeModel = treeStore.getTree(nextProps.treeId);
      let bOpen: boolean = false;
      let bEditable: boolean = false;
      if (tree) {
        bOpen = true;
        if (nextProps.login == LogInStatus.MANAGER || nextProps.login == LogInStatus.ADMIN) {
          bEditable = true;
        } else {
          if (tree.getOwner() == nextProps.userId) {
            bEditable = true;
          }
        }
      }
      self.setState({bOpen: bOpen, bEditable: bEditable});
    }
  }

  render() {
    let self: TreeComponent = this;
    if (self.state.bOpen) {
      var tree: TreeModel = treeStore.getTree(self.props.treeId);
      var food: FoodModel = foodStore.getFood(tree.getFoodId());
      return (
        <div className={styles.wrapper + " " + styles.slidein}>
          <div className={styles.treeinfo}>
            <img className={styles.icon} src={Settings.uBaseName + Settings.uStaticImage + food.getIcon()} />
            <div className={styles.name}>{food.getName() + ' #' + tree.getId()}</div>
            <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
              self.context.router.push({pathname: Settings.uBaseName + '/'});
              self.setState({bOpen: false, bEditable: self.state.bEditable});
            }}/></div>
          </div>
          <div className={styles.basicinfo}>
            <AltContainer stores={
              {
                foods: function (props) {
                  return {
                    store: foodStore,
                    value: foodStore.getState().foods
                  };
                },
                flags: function (props) {
                  return {
                    store: flagStore,
                    value: flagStore.getState().flags
                  };
                },
                ownership: function (props) {
                  return {
                    store: ownershipStore,
                    value: ownershipStore.getState().ownerships
                  };
                }
              }
            }>
              <LocationComponent tree={tree} editable={self.state.bEditable} />
              <AddressComponent tree={tree} editable={self.state.bEditable} />
              <DescriptionComponent tree={tree} editable={self.state.bEditable} />
              <FlagComponent tree={tree} flags={flagStore.getState().flags} editable={self.state.bEditable} />
              <PublicComponent tree={tree} editable={self.state.bEditable} />
            </AltContainer>
          </div>
        </div>
      );
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
