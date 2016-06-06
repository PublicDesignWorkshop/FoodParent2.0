import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';

var Settings = require('./../../constraints/settings.json');
import * as styles from './flag.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { FlagModel, flagStore } from './../../stores/flag.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { FoodModel, foodStore } from './../../stores/food.store';
import { treeActions } from './../../actions/tree.actions';

export interface IFlagOption {
  value: number;
  label: string;
}

export interface IFlagProps {
  tree: TreeModel;
  flags: Array<FlagModel>;
  editable: boolean;
  async: boolean;
}
export interface IFlagStatus {
  options?: Array<IFlagOption>;
  selected?: Array<IFlagOption>;
}

export default class FlagComponent extends React.Component<IFlagProps, IFlagStatus> {
  constructor(props : IFlagProps) {
    super(props);
    let self: FlagComponent = this;
    this.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: FlagComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: FlagComponent = this;
  }
  public componentWillReceiveProps (nextProps: IFlagProps) {
    let self: FlagComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IFlagProps) {
    let self: FlagComponent = this;
    if (props.tree && props.flags) {
      var options = new Array<IFlagOption>();
      var selected = new Array<IFlagOption>();
      props.flags.forEach(flag => {
        options.push({value: flag.getId(), label: flag.getName()});
        if ($.inArray(flag.getId(), self.props.tree.getFlags()) != -1) {
          selected.push({value: flag.getId(), label: flag.getName()});
        }
      });
      self.setState({options: options, selected: selected});
    }
  }

  private updateAttribute = (selected) => {
    let self: FlagComponent = this;
    var flags = new Array<number>();
    if (selected) {
      selected.forEach(option => {
        flags.push(parseInt(option.value));
      });
    }
    self.props.tree.setFlags(flags);
    if (self.props.async) {
      let food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
      treeActions.updateTree(self.props.tree, "Successfully updated the flags of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.", "Failed to update the flags of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.");
    } else {
      self.setState({selected: selected});
    }
  }

  render() {
    let self: FlagComponent = this;
    if (self.props.editable) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='tags' /> Flags
          </div>
          <div className={styles.name}>
            <Select name="flag-select" multi={true} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select flags..." />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='tags' /> Flags
          </div>
          <div className={styles.name}>
            <Select name="flag-select" multi={true} disabled searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select flags..." />
          </div>
        </div>
      );
    }

  }
}
