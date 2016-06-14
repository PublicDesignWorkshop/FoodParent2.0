import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as styles from './donate-food.component.css';
var Settings = require('./../../constraints/settings.json');

import { FoodModel, foodStore } from './../../stores/food.store';
import { DonateModel } from './../../stores/donate.store';
import { donateActions } from './../../actions/donate.actions';
import { treeActions } from './../../actions/tree.actions';

import { applyFilter, FilterMode, deleteFilter } from './../../utils/filter';
import { ISelectOption } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface IDonateFoodProps {
  donate: DonateModel;
  editable: boolean;
  async: boolean;
  foods?: Array<FoodModel>;
}
export interface IDonateFoodStatus {
  options?: Array<ISelectOption>;
  selected?: ISelectOption;
}

export default class DonateFoodComponent extends React.Component<IDonateFoodProps, IDonateFoodStatus> {
  constructor(props : IDonateFoodProps) {
    super(props);
    let self: DonateFoodComponent = this;
    this.state = {

    };
  }

  public componentDidMount() {
    let self: DonateFoodComponent = this;
    if (self.props.donate && self.props.foods) {
      var options = new Array<ISelectOption>();
      var selected: ISelectOption;
      self.props.foods.forEach(food => {
        options.push({value: food.getId(), label: food.getName()});
        if (self.props.donate.getFoodId() == food.getId()) {
          selected = {value: food.getId(), label: food.getName()};
        }
      });
      self.setState({options: options, selected: selected});
      var foodId = 0;
      if (selected) {
        foodId = parseInt(selected.value);
      }
      // Apply filter for a new tree food type to help users to figure out the location
      applyFilter(FilterMode.FOOD, [foodId], function(response) {
        deleteFilter(function () {
          treeActions.fetchTrees();
        });
      }, function(response) {

      }, function(response) {

      });
    }
  }

  public componentWillUnmount() {
    let self: DonateFoodComponent = this;
  }

  public componentWillReceiveProps (nextProps: IDonateFoodProps) {
    let self: DonateFoodComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IDonateFoodProps) {
    let self: DonateFoodComponent = this;
    var selected: ISelectOption;
    props.foods.forEach(food => {
      if (props.donate.getFoodId() == food.getId()) {
        selected = {value: food.getId(), label: food.getName()};
      }
    });
    var foodId = 0;
    if (selected) {
      foodId = parseInt(selected.value);
    }
    if (self.state.selected && self.state.selected.value != selected.value) {
      // Apply filter for a new tree food type to help users to figure out the location
      applyFilter(FilterMode.FOOD, [foodId], function(response) {
        deleteFilter(function () {
          treeActions.fetchTrees();
        });
      }, function(response) {

      }, function(response) {

      });
    }
    self.setState({selected: selected});
  }
  private updateAttribute = (selected?: any) => {
    let self: DonateFoodComponent = this;
    var foodId = 0;
    if (selected) {
      foodId = parseInt(selected.value);
    }
    self.props.donate.setFoodId(foodId);
    if (self.state.selected == null || self.state.selected.value != selected.value) {
      // Apply filter for a new tree food type to help users to figure out the location
      applyFilter(FilterMode.FOOD, [foodId], function(response) {
        deleteFilter(function () {
          treeActions.fetchTrees();
        });
      }, function(response) {

      }, function(response) {

      });
      if (self.props.donate.getId() == 0) {
        donateActions.setTempDonateSource([]);
      } else {
        donateActions.setDonateSource(self.props.donate.getId(), []);
      }
    }
    if (self.props.async) {
      // donateActions.updateDonate(self.props.donate);
    } else {
      self.setState({selected: selected});
    }
  }

  render() {
    let self: DonateFoodComponent = this;
    if (self.props.editable || self.props.donate.getId() == 0) {
      let food: FoodModel = foodStore.getFood(self.props.donate.getFoodId());
      let image: JSX.Element;
      if (food) {
         image = <img className={styles.icon} src={Settings.uBaseName + Settings.uStaticImage + food.getIcon()} />;
      } else {
        image = <img className={styles.icon} src={Settings.uBaseName + Settings.uStaticImage + Settings.uTemporaryMarkerIcon} />;
      }
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='apple' /> {localization(633)}
          </div>
          <div className={styles.edit}>
            {image}
            <div className={styles.type}>
              <Select name="food-select" multi={false} searchable={true} clearable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder={localization(971)} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
        </div>
      );
    }
  }
}
