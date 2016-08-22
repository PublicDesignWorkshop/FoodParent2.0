import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import $ from 'jquery';


require('./tree-food.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { FITERMODE } from './../utils/enum';
import { updateFilter } from './../utils/filter';

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
    let foods = FoodStore.getState().foods;
    foods.forEach(food => {
      if (!food.farm) {
        options.push({value: food.id, label: food.name});
        if ($.inArray(food.id, props.foods) > -1) {
          if (selected == null) {
            selected = [];
          }
          selected.push({value: food.id, label: food.name});
        }
      }
    });
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    let food = FoodStore.getFood(option.value);
    let label;
    if (food) {
      let iconUrl = food.icons['verified'];
      label = <span className="tree-food"><img className="tree-food-icon" src={iconUrl} /><span className="tree-food-name">{option.label}</span></span>;
    } else {
      label = <span className="tree-food"><img className="tree-food-icon" src={ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uTemporaryMarkerIcon} /><span className="tree-food-name">{option.label}</span></span>;
    }
    return label;
  }
  updateAttribute(selected) {
    var foods = [];
    if (selected) {
      selected.forEach(option => {
        foods.push(parseInt(option.value));
      });
    }
    updateFilter(FITERMODE.FOOD, foods, function(response) {  // Resolve
      TreeActions.fetchTrees();
    }, function(response) { // Reject

    });
    this.setState({selected: selected});
  }
  render () {
    return (
      <div className="tree-filter-wrapper">
        <div className="filter-label">
          <FontAwesome className='' name='apple' />{localization(633)}
        </div>
        <div className="filter-data brown-medium-multi">
          <Select name="food-select" multi={true} clearable={true} searchable={true} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(642)} backspaceToRemoveMessage="" />
        </div>
      </div>
    );
  }
}
