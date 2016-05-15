import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';

var Settings = require('./../../constraints/settings.json');
import * as styles from './filter-food.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';

export interface IFilterFoodOption {
  value: number;
  label: string;
}

export interface IFilterFoodProps {
  foods: Array<FoodModel>;
}
export interface IFilterFoodStatus {
  options?: Array<IFilterFoodOption>;
  selected?: IFilterFoodOption;
}

export default class FilterFoodComponent extends React.Component<IFilterFoodProps, IFilterFoodStatus> {
  constructor(props : IFilterFoodProps) {
    super(props);
    let self: FilterFoodComponent = this;
    this.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: FilterFoodComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: FilterFoodComponent = this;
  }
  public componentWillReceiveProps (nextProps: IFilterFoodProps) {
    let self: FilterFoodComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IFilterFoodProps) {
    let self: FilterFoodComponent = this;
    if (props.foods) {
      var options = new Array<IFilterFoodOption>();
      var selected: IFilterFoodOption;
      props.foods.forEach(food => {
        options.push({value: food.getId(), label: food.getName()});
      });
      self.setState({options: options, selected: selected});
    }
  }

  private updateAttribute = (selected) => {
    let self: FilterFoodComponent = this;
    self.setState({selected: selected});
  }

  render() {
    let self: FilterFoodComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.value}>
          <Select name="food-select" multi={true} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select ownerships..." />
        </div>
      </div>
    );
  }
}
