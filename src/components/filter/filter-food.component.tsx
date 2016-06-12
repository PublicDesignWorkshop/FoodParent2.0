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
import { resetFilter, readFilter, applyFilter, FilterMode } from './../../utils/filter';
import { treeActions } from './../../actions/tree.actions';

export interface IFilterFoodOption {
  value: number;
  label: string;
}

export interface IFilterFoodProps {
  foods: Array<FoodModel>;
}
export interface IFilterFoodStatus {
  options?: Array<IFilterFoodOption>;
  selected?: Array<IFilterFoodOption>;
}

export default class FilterFoodComponent extends React.Component<IFilterFoodProps, IFilterFoodStatus> {
  private bFirstLoad: boolean;
  constructor(props : IFilterFoodProps) {
    super(props);
    let self: FilterFoodComponent = this;
    self.bFirstLoad = true;
    self.state = {
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
    if (props.foods.length > 0) {
      if (self.bFirstLoad) {
        self.bFirstLoad = false;
        readFilter(function(response) {
          let foods: Array<number> = response.foods.split(",").map(function(item) {
            return parseInt(item);
          });
          var selected = new Array<IFilterFoodOption>();
          foods.forEach(food => {
            if (food != -1 && food != 0) {
              let label: string = foodStore.getFood(food).getName();
              selected.push({value: food, label: label});
            }
          });
          self.setState({selected: selected});
          treeActions.fetchTrees();
        }, function(response) {

        }, function(response) {

        });
      }

      var options = new Array<IFilterFoodOption>();
      props.foods.forEach(food => {
        options.push({value: food.getId(), label: food.getName()});
      });
      self.setState({options: options});
    }
  }

  private updateAttribute = (selected) => {
    let self: FilterFoodComponent = this;
    self.setState({selected: selected});
    var foods = new Array<number>();
    if (selected) {
      selected.forEach(option => {
        foods.push(parseInt(option.value));
      });
      applyFilter(FilterMode.FOOD, foods, function(response) {
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    } else {
      applyFilter(FilterMode.FOOD, new Array<number>(), function(response) {
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    }
  }

  private resetAttribute = () => {
    let self: FilterFoodComponent = this;
    resetFilter(function(response) {
      let foods: Array<number> = response.foods.split(",").map(function(item) {
        return parseInt(item);
      });
      var selected = new Array<IFilterFoodOption>();
      foods.forEach(food => {
        if (food != 0 && food != -1) {
          let label: string = foodStore.getFood(food).getName();
          selected.push({value: food, label: label});
        }
      });
      self.setState({selected: selected});
      treeActions.fetchTrees();
    }, function(response) {

    }, function(response) {

    });
  }

  renderOptionValue(option): JSX.Element {
    let food: FoodModel = foodStore.getFood(option.value);
    let label: JSX.Element;
    if (food) {
       label = <span><img className={styles.icon} src={Settings.uBaseName + Settings.uStaticImage + food.getIcon()} /><span>{option.label}</span></span>;
    } else {
      label = <span><img className={styles.icon} src={Settings.uBaseName + Settings.uStaticImage + Settings.uTemporaryMarkerIcon} /><span>{option.label}</span></span>;
    }
    return label;
  }

  render() {
    let self: FilterFoodComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.label} onMouseUp={()=> {
          // if (self.props.editable) {
          //   self.setState({editing: true});
          // }
        }}>
          <FontAwesome className='' name='apple ' /> Food Types
        </div>
        <div className={styles.value}>
          <Select name="food-select" multi={true} searchable={true} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select food types..." valueRenderer={self.renderOptionValue} />
          <div className={styles.button} onClick={()=> {
            self.resetAttribute();
          }}>
            In-Season/Upcoming Foods
          </div>
        </div>
      </div>
    );
  }
}
