import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../../constraints/settings.json');
import * as styles from './tree-parents.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { LogInStatus } from './../app.component';
import { PersonModel, personStore } from './../../stores/person.store';
import { authStore } from './../../stores/auth.store';
import ParentListComponent from './parent-list.component';
import { treeActions } from './../../actions/tree.actions';
import { FoodModel, foodStore } from './../../stores/food.store';

export interface ITreeParentsProps {
  tree: TreeModel;
  persons?: Array<PersonModel>;
}
export interface ITreeParentsStatus {

}
export default class TreeParentsComponent extends React.Component<ITreeParentsProps, ITreeParentsStatus> {
  static contextTypes: any;
  constructor(props : ITreeParentsProps) {
    super(props);
    let self: TreeParentsComponent = this;
    self.state = {

    };
  }
  public componentDidMount() {
    let self: TreeParentsComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreeParentsComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreeParentsProps) {
    let self: TreeParentsComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: ITreeParentsProps) {
    let self: TreeParentsComponent = this;
    //
    //
    // if (props.tree && props.tree.getId() != self.tree) {
    //   console.log("-------------");
    //   if (self.props.login == LogInStatus.MANAGER || self.props.login == LogInStatus.ADMIN) {
    //     if (props.tree.getParents().length > 0) {
    //       setTimeout(function() {
    //         personStore.fetchPersons(props.tree.getParents());
    //       }, 1);
    //     }
    //   }
    //   self.tree = props.tree.getId();
    // }
  }

  render() {
    let self: TreeParentsComponent = this;
    let food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
    if (authStore.getAuth().getIsManager()) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='chain' /> Parents
          </div>
          <div className={styles.editname}>
            <ParentListComponent tree={self.props.tree} persons={self.props.persons} />
          </div>
        </div>
      );
    } else {
      let status: string = "";
      let parents: Array<number> = self.props.tree.getParents();
      if (parents.length == 0) {
        status = "No one adopts this tree.";
      } else if (parents.length == 1) {
        status = parents.length + " person adopts this tree.";
      } else if (parents.length > 1) {
        status = parents.length + " people adopt this tree.";
      }
      let adopt: JSX.Element;
      if (!authStore.getAuth().getIsGuest()) {
        adopt = <span className={styles.adopt} onClick={()=> {
          self.props.tree.addParent(authStore.getAuth().getId());
          treeActions.adoptTree(self.props.tree);
        }}>ADOPT </span>;
        if (parents.indexOf(authStore.getAuth().getId()) > -1) {
          adopt = <span className={styles.unadopt} onClick={()=> {
            self.props.tree.removeParent(authStore.getAuth().getId());
            treeActions.unadoptTree(self.props.tree);
          }}>UN-ADOPT</span>;
        }
      } else {
        adopt = <span className={styles.adopt} onClick={()=> {
          self.context.router.push({pathname: window.location.pathname, query: { user: 'signup' }});
        }}>BECOME A PARENT </span>;
      }
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='chain' /> Parents
          </div>
          <div className={styles.editname}>
            {status}
            {adopt}
          </div>
        </div>
      );
    }
  }
}

TreeParentsComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
