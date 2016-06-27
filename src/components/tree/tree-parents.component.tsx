import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './tree-parents.component.css';
var Settings = require('./../../constraints/settings.json');

import TreeParentListComponent from './tree-parent-list.component';

import { TreeModel } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { treeActions } from './../../actions/tree.actions';
import { PersonModel, personStore } from './../../stores/person.store';
import { authStore } from './../../stores/auth.store';
import { personActions } from './../../actions/person.actions';

import { localization } from './../../constraints/localization';

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
    setTimeout(function() {
      personActions.fetchPersons(self.props.tree.getParents());
    }, 0);
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

  }

  render() {
    let self: TreeParentsComponent = this;
    let food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
    if (authStore.getAuth().getIsManager()) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='chain' /> {localization(984)}
          </div>
          <div className={styles.editname}>
            <AltContainer stores={
              {
                persons: function (props) {
                  return {
                    store: personStore,
                    value: personStore.getState().persons,
                  };
                }
              }
            }>
              <TreeParentListComponent tree={self.props.tree} />
            </AltContainer>
          </div>
        </div>
      );
    } else {
      let status: string = localization(981);
      let parents: Array<number> = self.props.tree.getParents();
      if (parents.length == 1) {
        status = parents.length + " " + localization(982);
      } else if (parents.length > 1) {
        status = parents.length + " " + localization(983);
      }
      let adopt: JSX.Element;
      if (food != null && !food.getAdaptability()) {
        adopt = <span className={styles.unableadopt}>{localization(626)}</span>;
      } else if (!authStore.getAuth().getIsGuest()) {
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
      } else {
        adopt = <span className={styles.adopt} onClick={()=> {
          self.context.router.push({pathname: window.location.pathname, query: { user: 'signup' }});
        }}>{localization(987)}</span>;
      }
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='chain' /> {localization(984)}
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
