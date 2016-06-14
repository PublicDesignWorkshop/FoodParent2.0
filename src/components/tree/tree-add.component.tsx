import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './tree-add.component.css';
var Settings = require('./../../constraints/settings.json');

import TreeFoodComponent from './tree-food.component';
import TreeAddressComponent from './tree-address.component';
import TreeDescriptionComponent from './tree-description.component';
import TreeFlagComponent from './tree-flag.component';
import TreeOwnershipComponent from './tree-ownership.component';
import TreeLocationComponent from './tree-location.component';

import { TreeModel } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { flagStore } from './../../stores/flag.store';
import { authStore } from './../../stores/auth.store';

export interface ITreeAddProps {
  foods?: Array<FoodModel>;
  trees?: Array<TreeModel>;
  tree?: TreeModel;
}
export interface ITreeAddStatus {

}

export default class TreeAddComponent extends React.Component<ITreeAddProps, ITreeAddStatus> {
  static contextTypes: any;
  constructor(props : ITreeAddProps) {
    super(props);
    let self: TreeAddComponent = this;
    this.state = {

    };
  }
  public componentDidMount() {
    let self: TreeAddComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreeAddComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreeAddProps) {
    let self: TreeAddComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ITreeAddProps) => {
    let self: TreeAddComponent = this;
    // if (props.foods.length != 0) {
    //   if (authStore.getAuth().getIsManager()) {
    //
    //   } else {
    //
    //   }
    // }
  }

  render() {
    let self: TreeAddComponent = this;
    if (self.props.tree && self.props.foods.length) {
      var food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
      return (
        <div className={styles.wrapper}>
          <div className={styles.treeinfo}>
            <TreeFoodComponent tree={self.props.tree} foods={self.props.foods} editable={true} async={false} />
            <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
              self.context.router.push({pathname: Settings.uBaseName + '/'});
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
              <TreeLocationComponent tree={self.props.tree} editable={true} async={false} />
              <TreeAddressComponent tree={self.props.tree} editable={true} async={false} />
              <TreeDescriptionComponent tree={self.props.tree} editable={true} async={false} />
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

TreeAddComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
