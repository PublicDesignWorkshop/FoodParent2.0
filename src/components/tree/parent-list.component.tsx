import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './parent-list.component.css';
import { PersonModel, personStore } from './../../stores/person.store';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';

export interface IParentListProps {
  tree: TreeModel;
  persons: Array<PersonModel>;
  userId: number;
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
    let list: Array<JSX.Element> = new Array<JSX.Element>();
    let parents: Array<number> = self.props.tree.getParents();
    parents.forEach((parentId: number) => {
      let person: PersonModel = personStore.getPerson(parentId);
      if (person) {
        list.push(<span className={styles.parent} key={"parent" + parentId}>{person.getName()}</span>);
      }
    });
    if (list.length == 0) {
      list.push(<span key={"parent-no"}>No one adopts this tree.</span>);
    }
    let adopt: JSX.Element;
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
    return (
      <div className={styles.wrapper}>
        {list}
        {adopt}
      </div>
    );
  }
}
