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
        options.push({value: food.id, label: food.name + props.tree.getName() });
        if (props.tree.food == food.id) {
          selected = {value: food.id, label: food.name + props.tree.getName()};
        }
      });
    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    let food = FoodStore.getFood(option.value);
    let image;
    let flags = FlagStore.getState().flags;
    let bFound = false;
    if (food != null && image == null) {
      image = food.icon['verified'].replace("_verified.png", ".svg");
    }
    let label;
    if (food) {
       label = <span><img className="tree-food-icon" src={image} /><span className="tree-food-name">{option.label}</span></span>;
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
    this.setState({selected: selected});
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="tree-food-wrapper">
          <Select name="food-select" multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder="" />
        </div>
      );
    } else {
      return (
        <div className="tree-food-wrapper disabled">
          <Select name="food-select" multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder="" disabled />
        </div>
      );
    }
  }
}
