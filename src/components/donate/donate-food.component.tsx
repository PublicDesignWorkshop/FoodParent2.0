import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './donate-food.component.css';
import { FoodModel, foodStore } from './../../stores/food.store';
import { DonateModel, donateStore } from './../../stores/donate.store';
import MessageLineComponent from './../message/message-line.component';
import { applyFilter, FilterMode, deleteFilter } from './../../utils/filter';
import { treeActions } from './../../actions/tree.actions';
import { donateActions } from './../../actions/donate.actions';

export interface IDonateFoodTypeOption {
  value: any;
  label: string;
}

export interface IDonateFoodProps {
  donate: DonateModel;
  editable: boolean;
  async: boolean;
  foods?: Array<FoodModel>;
}
export interface IDonateFoodStatus {
  options?: Array<IDonateFoodTypeOption>;
  selected?: IDonateFoodTypeOption;
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
      var options = new Array<IDonateFoodTypeOption>();
      var selected: IDonateFoodTypeOption;
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
      if (self.props.donate.getId() == 0) {
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
    let self: DonateFoodComponent = this;
  }
  public componentWillReceiveProps (nextProps: IDonateFoodProps) {
    let self: DonateFoodComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IDonateFoodProps) {
    let self: DonateFoodComponent = this;
    var selected: IDonateFoodTypeOption;
    let treeName: string = "";
    props.foods.forEach(food => {
      if (props.donate.getFoodId() == food.getId()) {
        selected = {value: food.getId(), label: food.getName()};
      }
    });
    self.setState({selected: selected});
  }
  private updateAttribute = (selected?: any) => {
    let self: DonateFoodComponent = this;
    var foodId = 0;
    if (selected) {
      foodId = parseInt(selected.value);
    }
    self.props.donate.setFoodId(foodId);
    if (self.props.async) {
      donateActions.updateDonate(self.props.donate);
    } else {
      self.setState({selected: selected});
    }
    if (self.props.donate.getId() == 0) {
      applyFilter(FilterMode.FOOD, [foodId], function(response) {
        deleteFilter(function () {
          treeActions.fetchTrees();
        });
      }, function(response) {

      }, function(response) {

      });
    } else {
      // Apply filter for a new tree food type to help users to figure out the location
      treeActions.fetchTrees(self.props.donate.getId());
    }
  }

  render() {
    let self: DonateFoodComponent = this;
    if (self.props.editable || self.props.donate.getId() == 0) {
      var food: FoodModel = foodStore.getFood(self.props.donate.getFoodId());
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onMouseUp={()=> {
            // if (self.props.editable) {
            //   self.setState({editing: true});
            // }
          }}>
            <FontAwesome className='' name='apple' /> Food Type
          </div>
          <div className={styles.edit}>
            <img className={styles.icon} src={Settings.uBaseName + Settings.uStaticImage + food.getIcon()} />
            <div className={styles.type}>
              <Select name="food-select" multi={false} searchable={true} clearable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select ownerships..." />
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
