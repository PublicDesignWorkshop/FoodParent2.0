import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';

var Settings = require('./../../constraints/settings.json');
import * as styles from './ownership.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { FoodModel, foodStore } from './../../stores/food.store';
import { treeActions } from './../../actions/tree.actions';

export interface IOwnershipOption {
  value: number;
  label: string;
}

export interface IOwnershipProps {
  tree: TreeModel;
  editable: boolean;
  async: boolean;
}
export interface IOwnershipStatus {
  options?: Array<IOwnershipOption>;
  selected?: IOwnershipOption;
}

export default class OwnershipComponent extends React.Component<IOwnershipProps, IOwnershipStatus> {
  constructor(props : IOwnershipProps) {
    super(props);
    let self: OwnershipComponent = this;
    this.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: OwnershipComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: OwnershipComponent = this;
  }
  public componentWillReceiveProps (nextProps: IOwnershipProps) {
    let self: OwnershipComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IOwnershipProps) {
    let self: OwnershipComponent = this;
    if (props.tree) {
      let options = new Array<IOwnershipOption>();
      options.push({value: 0, label: "private"});
      options.push({value: 1, label: "public"});
      let selected: IOwnershipOption;
      if (self.props.tree.getOwnership() == 0) {
        selected = options[0];
      } else {
        selected = options[1];
      }
      self.setState({options: options, selected: selected});
    }
  }

  private updateAttribute = (selected) => {
    let self: OwnershipComponent = this;
    var ownership = 0;
    if (selected) {
      ownership = parseInt(selected.value);
    }
    self.props.tree.setOwnership(ownership);
    if (self.props.async) {let food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
    treeActions.updateTree(self.props.tree);
    } else {
      self.setState({selected: selected});
    }
  }

  render() {
    let self: OwnershipComponent = this;
    if (self.props.editable) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='home' /> Public
          </div>
          <div className={styles.name}>
            <Select name="ownership-select" multi={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select ownerships..." />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='home' /> Public
          </div>
          <div className={styles.name}>
            <Select name="ownership-select" multi={false} disabled searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select ownerships..." />
          </div>
        </div>
      );
    }
  }
}
