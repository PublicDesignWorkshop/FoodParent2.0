import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './tree-parent-list.component.css';
var Settings = require('./../../constraints/settings.json');

import { PersonModel } from './../../stores/person.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { foodActions } from './../../actions/food.actions';
import { TreeModel } from './../../stores/tree.store';
import { treeActions } from './../../actions/tree.actions';
import { authStore } from './../../stores/auth.store';

import { localization } from './../../constraints/localization';

export interface ITreeParentListProps {
  tree: TreeModel;
  persons?: Array<PersonModel>;
}
export interface ITreeParentListStatus {

}

export default class TreeParentListComponent extends React.Component<ITreeParentListProps, ITreeParentListStatus> {
  constructor(props : ITreeParentListProps) {
    super(props);
    let self: TreeParentListComponent = this;
    this.state = {

    };
  }
  public componentDidMount() {
    let self: TreeParentListComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: TreeParentListComponent = this;
  }

  public componentWillReceiveProps (nextProps: ITreeParentListProps) {
    let self: TreeParentListComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: ITreeParentListProps) {
    let self: TreeParentListComponent = this;
  }

  render() {
    let self: TreeParentListComponent = this;
    let food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
    let list: Array<JSX.Element> = new Array<JSX.Element>();
    let parents: Array<number> = self.props.tree.getParents();
    self.props.persons.forEach((person: PersonModel) => {
      if ($.inArray(person.getId(), parents) > -1) {
        list.push(<span className={styles.parent} key={"parent" + person.getId()}>{person.getName()}</span>);
      }
    });
    if (list.length == 0) {
      list.push(<span key={"parent-no"}>{localization(981)}</span>);
    }
    let adopt: JSX.Element;
    adopt = <span className={styles.adopt} onClick={()=> {
      self.props.tree.addParent(authStore.getAuth().getId());
      treeActions.adoptTree(self.props.tree);
    }}>{localization(985)}</span>;
    if (parents.indexOf(authStore.getAuth().getId()) > -1) {
      adopt = <span className={styles.unadopt} onClick={()=> {
        self.props.tree.removeParent(authStore.getAuth().getId());
        treeActions.unadoptTree(self.props.tree);
      }}>{localization(986)}</span>;
    }
    let adoptable: JSX.Element;
    if (food != null && !food.getAdaptability()) {
      adoptable = <span className={styles.adopt} onClick={()=> {
        food.setAdaptability(true);
        foodActions.updateFood(food);
      }}>{localization(624)}</span>;
    } else if (food != null && food.getAdaptability()) {
      adoptable = <span className={styles.adopt} onClick={()=> {
        food.setAdaptability(false);
        foodActions.updateFood(food);
      }}>{localization(625)}</span>;
    }
    return (
      <div className={styles.wrapper}>
        {list}
        {adoptable}
        {adopt}
      </div>
    );
  }
}
