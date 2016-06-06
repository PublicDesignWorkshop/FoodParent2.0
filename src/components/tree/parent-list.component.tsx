import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './parent-list.component.css';
import { PersonModel, personStore } from './../../stores/person.store';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { authStore } from './../../stores/auth.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { treeActions } from './../../actions/tree.actions';

export interface IParentListProps {
  tree: TreeModel;
  persons?: Array<PersonModel>;
}
export interface IParentListStatus {

}
export default class ParentListComponent extends React.Component<IParentListProps, IParentListStatus> {
  constructor(props : IParentListProps) {
    super(props);
    let self: ParentListComponent = this;
    this.state = {

    };
  }
  public componentDidMount() {
    let self: ParentListComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: ParentListComponent = this;
  }
  public componentWillReceiveProps (nextProps: IParentListProps) {
    let self: ParentListComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IParentListProps) {
    let self: ParentListComponent = this;
  }

  render() {
    let self: ParentListComponent = this;
    let food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
    let list: Array<JSX.Element> = new Array<JSX.Element>();
    let parents: Array<number> = self.props.tree.getParents();
    self.props.persons.forEach((person: PersonModel) => {
      if ($.inArray(person.getId(), parents) > -1) {
        list.push(<span className={styles.parent} key={"parent" + person.getId()}>{person.getName()}</span>);
      }
    });
    if (list.length == 0) {
      list.push(<span key={"parent-no"}>No one adopts this tree.</span>);
    }
    let adopt: JSX.Element;
    adopt = <span className={styles.adopt} onClick={()=> {
      self.props.tree.addParent(authStore.getAuth().getId());
      treeActions.updateTree(self.props.tree, "Successfully adopted <strong>" + food.getName() + self.props.tree.getName() + "</strong>.", "Failed to adopt <strong>" + food.getName() + self.props.tree.getName() + "</strong>.");
    }}>ADOPT</span>;
    if (parents.indexOf(authStore.getAuth().getId()) > -1) {
      adopt = <span className={styles.unadopt} onClick={()=> {
        self.props.tree.removeParent(authStore.getAuth().getId());
        treeActions.updateTree(self.props.tree, "Successfully unadopted <strong>" + food.getName() + self.props.tree.getName() + "</strong>.", "Failed to unadopt <strong>" + food.getName() + self.props.tree.getName() + "</strong>.");
      }}>UN-ADOPT</span>;
    }
    return (
      <div className={styles.wrapper}>
        {list}
        {adopt}
      </div>
    );
  }
}
