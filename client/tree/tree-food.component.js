import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import $ from 'jquery';


require('./tree-food.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');
import { readFilter, updateFilter } from './../utils/filter';
import { FITERMODE } from './../utils/enum';

import { localization } from './../utils/localization';
let FoodStore = require('./../stores/food.store');
let FlagStore = require('./../stores/flag.store');

let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');


export default class TreeFood extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
    this.renderOptionValue = this.renderOptionValue.bind(this);
  }
  componentWillMount() {
    this.setState({options: null, selected: null});
  }
  componentDidMount () {
    this.updateProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    let options = [];
    let selected = null;
    if (props.tree != null) {
      let foods = FoodStore.getState().foods;
      options.push({value: 0, label: localization(642), disabled: true });
      foods.forEach(food => {
        if (props.tree.id == 0) {  //  == 0: new tree.
          options.push({value: food.id, label: food.name});
        } else {
          options.push({value: food.id, label: food.name + props.tree.getName() });
        }
        if (props.tree.food == food.id) {
          if (props.tree.id == 0) {  // food.id == 0: new tree.
            selected = {value: food.id, label: food.name};
          } else {
            selected = {value: food.id, label: food.name + props.tree.getName()};
          }
        }
      });

      if (selected == null) {
        selected = {value: 0, label: localization(642), disabled: true };
      }
    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    let food = FoodStore.getFood(option.value);
    let flags = FlagStore.getState().flags;
    let iconUrl;
    let bFound = false;
    let label;
    if (food) {
      for (let i = 0; i < flags.length && !bFound; i++) {
        if ($.inArray(flags[i].id, this.props.tree.flags) > -1) {
          iconUrl = food.icons[flags[i].name];
          bFound = true;
        }
      }
      if (iconUrl == null) {
        iconUrl = food.icons['verified'];
      }
      label = <span><img className="tree-food-icon" src={iconUrl} /><span className="tree-food-name">{option.label}</span></span>;
    } else {
      label = <span><img className="tree-food-icon" src={ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uTemporaryMarkerIcon} /><span className="tree-food-name">{option.label}</span></span>;
    }
    return label;
  }
  updateAttribute(selected) {
    var foodId = 0;
    if (selected) {
      foodId = parseInt(selected.value);
    }
    if (parseInt(this.state.selected.value) != parseInt(selected.value)) {
      TreeActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
    this.props.tree.food = foodId;
    // Add food type to filter so that other same type of trees can be revealed on the map.
    readFilter(function(response) { // Resolve callback.
      let foods = response.foods.split(",").map(function(food) {
        return parseInt(food);
      });
      if ($.inArray(foodId, foods) == -1) {
        foods.push(foodId);
      }
      console.log(foods);
      updateFilter(FITERMODE.FOOD, foods, function(response) {  // Resolve
        TreeActions.fetchTrees();
      }, function(response) { // Reject

      });
    }.bind(this), function(response) {  // Reject callback.

    }.bind(this));
    this.setState({selected: selected});
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="tree-food-wrapper">
          <Select name="food-select" multi={false} clearable={false} searchable={true} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder="" />
        </div>
      );
    } else {
      return (
        <div className="tree-food-wrapper disabled">
          <Select name="food-select" multi={false} clearable={false} searchable={true} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder="" disabled />
        </div>
      );
    }
  }
}
