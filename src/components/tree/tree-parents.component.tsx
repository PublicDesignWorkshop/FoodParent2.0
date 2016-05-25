import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../../constraints/settings.json');
import * as styles from './tree-parents.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { LogInStatus } from './../app.component';
import { PersonModel, personStore } from './../../stores/person.store';
import ParentListComponent from './parent-list.component';

export interface ITreeParentsProps {
  userId: number;
  tree: TreeModel;
  login: LogInStatus;
}
export interface ITreeParentsStatus {
  editing?: boolean;
}
export default class TreeParentsComponent extends React.Component<ITreeParentsProps, ITreeParentsStatus> {
  static contextTypes: any;
  private tree: number;
  constructor(props : ITreeParentsProps) {
    super(props);
    let self: TreeParentsComponent = this;
    self.state = {
      editing: false,
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
    if (props.tree && props.tree.getId() != self.tree) {
      console.log("-------------");
      if (self.props.login == LogInStatus.MANAGER || self.props.login == LogInStatus.ADMIN) {
        if (props.tree.getParents().length > 0) {
          setTimeout(function() {
            personStore.fetchPersons(props.tree.getParents());
          }, 1);
        }
      }
      self.tree = props.tree.getId();
    }
  }

  render() {
    let self: TreeParentsComponent = this;
    if (self.props.login == LogInStatus.MANAGER || self.props.login == LogInStatus.ADMIN) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {

          }}>
            <FontAwesome className='' name='chain' /> Parents
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
            <ParentListComponent userId={self.props.userId} tree={self.props.tree} persons={personStore.getState().persons} />
          </AltContainer>
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
      if (self.props.login == LogInStatus.ADMIN || self.props.login == LogInStatus.MANAGER || self.props.login == LogInStatus.PARENT) {
        adopt = <span className={styles.adopt} onClick={()=> {
          self.props.tree.addParent(self.props.userId);
          treeStore.updateTree(self.props.tree);
        }}>ADOPT </span>;
        if (parents.indexOf(self.props.userId) > -1) {
          adopt = <span className={styles.unadopt} onClick={()=> {
            self.props.tree.removeParent(self.props.userId);
            treeStore.updateTree(self.props.tree);
          }}>UN-ADOPT</span>;
        }
      } else {
        adopt = <span className={styles.adopt} onClick={()=> {
          self.context.router.push({pathname: window.location.pathname, query: { login: true }});
        }}>BECOME A PARENT </span>;
      }
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {

          }}>
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
