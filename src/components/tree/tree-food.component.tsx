import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './tree-food.component.css';
var Settings = require('./../../constraints/settings.json');

import { TreeModel } from './../../stores/tree.store';
import { treeActions } from './../../actions/tree.actions';
import { FoodModel, foodStore } from './../../stores/food.store';
import { applyFilter, FilterMode, deleteFilter } from './../../utils/filter';

import { localization } from './../../constraints/localization';
import { ISelectOption } from './../../utils/enum';

export interface ITreeFoodProps {
  tree: TreeModel;
  foods: Array<FoodModel>;
  editable: boolean;
  async: boolean;
}
export interface ITreeFoodStatus {
  options?: Array<ISelectOption>;
  selected?: ISelectOption;
}

export default class TreeFoodComponent extends React.Component<ITreeFoodProps, ITreeFoodStatus> {
  constructor(props : ITreeFoodProps) {
    super(props);
    let self: TreeFoodComponent = this;
    this.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: TreeFoodComponent = this;
    if (self.props.tree && self.props.foods) {
      var options = new Array<ISelectOption>();
      var selected: ISelectOption;
      let treeName: string = "";
      if (self.props.tree.getId()) {
        treeName = self.props.tree.getName();
      }
      options.push({value: 0, label: localization(642), disabled: true });
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
      // // Apply filter for a new tree food type to help users to figure out the location
      // if (self.props.tree.getId() == 0) {
      //   applyFilter(FilterMode.FOOD, [foodId], function(response) {
      //     deleteFilter(function () {
      //       treeActions.fetchTrees();
      //     });
      //   }, function(response) {
      //
      //   }, function(response) {
      //
      //   });
      // }
    }
  }

  public componentWillUnmount() {
    let self: TreeFoodComponent = this;
  }

  public componentWillReceiveProps (nextProps: ITreeFoodProps) {
    let self: TreeFoodComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: ITreeFoodProps) {
    let self: TreeFoodComponent = this;
    var selected: ISelectOption;
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
    let self: TreeFoodComponent = this;
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
    // if (self.props.tree.getId() == 0) {
    //   applyFilter(FilterMode.FOOD, [foodId], function(response) {
    //     deleteFilter(function () {
    //       treeActions.fetchTrees();
    //     });
    //   }, function(response) {
    //
    //   }, function(response) {
    //
    //   });
    // } else {
    //   // Apply filter for a new tree food type to help users to figure out the location
    //   treeActions.fetchTrees(self.props.tree.getId());
    // }
  }

  render() {
    let self: TreeFoodComponent = this;
    let food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
    let icon: string;
    if (food) {
      icon = food.getIcon();
    } else {
      icon = Settings.uTemporaryMarkerIcon;
    }
    if (self.props.editable) {
      return (
        <div className={styles.wrapper}>
          <img className={styles.icon} src={Settings.uBaseName + Settings.uStaticImage + icon} />
          <div className={styles.name}>
            <Select name="food-select" multi={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder={localization(971)} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
        <img className={styles.icon} src={Settings.uBaseName + Settings.uStaticImage + icon} />
          <div className={styles.name}>
            <Select name="food-select" multi={false} disabled searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder={localization(971)} />
          </div>
        </div>
      );
    }
  }
}
