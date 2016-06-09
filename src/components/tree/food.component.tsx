import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';

var Settings = require('./../../constraints/settings.json');
import * as styles from './food.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { applyFilter, FilterMode, deleteFilter } from './../../utils/filter';
import { treeActions } from './../../actions/tree.actions';

export interface IFoodOption {
  value: any;
  label: string;
}

export interface IFoodProps {
  tree: TreeModel;
  foods: Array<FoodModel>;
  editable: boolean;
  async: boolean;
}
export interface IFoodStatus {
  options?: Array<IFoodOption>;
  selected?: IFoodOption;
}

export default class FoodComponent extends React.Component<IFoodProps, IFoodStatus> {
  constructor(props : IFoodProps) {
    super(props);
    let self: FoodComponent = this;
    this.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: FoodComponent = this;
    if (self.props.tree && self.props.foods) {
      var options = new Array<IFoodOption>();
      var selected: IFoodOption;
      let treeName: string = "";
      if (self.props.tree.getId()) {
        treeName = self.props.tree.getName();
      }
      self.props.foods.forEach(food => {
        options.push({value: food.getId(), label: food.getName() + treeName });
        if (self.props.tree.getFoodId() == food.getId()) {
          selected = {value: food.getId(), label: food.getName() + treeName};
        }
      });
      self.setState({options: options, selected: selected});
      var foodId = 0;
      if (selected) {
        foodId = parseInt(selected.value);
      }
      // Apply filter for a new tree food type to help users to figure out the location
      if (self.props.tree.getId() == 0) {
        applyFilter(FilterMode.FOOD, [foodId], function(response) {
          deleteFilter(function () {
            treeActions.fetchTrees();
          });
        }, function(response) {

        }, function(response) {

        });
      }
    }
  }
  public componentWillUnmount() {
    let self: FoodComponent = this;
  }
  public componentWillReceiveProps (nextProps: IFoodProps) {
    let self: FoodComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IFoodProps) {
    let self: FoodComponent = this;
    var selected: IFoodOption;
    let treeName: string = "";
    if (props.tree.getId()) {
      treeName = props.tree.getName();
    }
    props.foods.forEach(food => {
      if (props.tree.getFoodId() == food.getId()) {
        selected = {value: food.getId(), label: food.getName() + treeName};
      }
    });
    self.setState({selected: selected});
  }
  
  private updateAttribute = (selected) => {
    let self: FoodComponent = this;
    var foodId = 0;
    if (selected) {
      foodId = parseInt(selected.value);
    }
    self.props.tree.setFoodId(foodId);
    if (self.props.async) {
      treeActions.updateTree(self.props.tree);
    } else {
      self.setState({selected: selected});
    }
    if (self.props.tree.getId() == 0) {
      applyFilter(FilterMode.FOOD, [foodId], function(response) {
        deleteFilter(function () {
          treeActions.fetchTrees();
        });
      }, function(response) {

      }, function(response) {

      });
    } else {
      // Apply filter for a new tree food type to help users to figure out the location
      treeActions.fetchTrees(self.props.tree.getId());
    }
  }

  render() {
    let self: FoodComponent = this;
    var food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
    if (self.props.editable) {
      return (
        <div className={styles.wrapper}>
          <img className={styles.icon} src={Settings.uBaseName + Settings.uStaticImage + food.getIcon()} />
          <div className={styles.name}>
            <Select name="food-select" multi={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select ownerships..." />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
        <img className={styles.icon} src={Settings.uBaseName + Settings.uStaticImage + food.getIcon()} />
          <div className={styles.name}>
            <Select name="food-select" multi={false} disabled searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select ownerships..." />
          </div>
        </div>
      );
    }
  }
}
