import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./tree-food.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
let FoodStore = require('./../stores/food.store');
let TreeStore = require('./../stores/tree.store');


export default class TreeFood extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
    this.renderOptionValue = this.renderOptionValue.bind(this);
  }
  componentWillMount() {
    this.setState({options: null, selected: null, editing: false});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    let options = [];
    let selected = null;
    let tree = TreeStore.getTree(props.tree);
    if (tree != null) {
      let foods = FoodStore.getState().foods;
      options.push({value: 0, label: localization(642), disabled: true });
      foods.forEach(food => {
        options.push({value: food.id, label: food.name + tree.getName() });
        if (tree.food == food.id) {
          selected = {value: food.id, label: food.name + tree.getName()};
        }
      });
    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    let food = FoodStore.getFood(option.value);
    let label;
    if (food) {
       label = <span><img className="tree-food-icon" src={ServerSetting.uBase + ServerSetting.uStaticImage + food.icon} /><span className="tree-food-name">{option.label}</span></span>;
    } else {
      label = <span><img className="tree-food-icon" src={ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uTemporaryMarkerIcon} /><span className="tree-food-name">{option.label}</span></span>;
    }
    return label;
  }
  updateAttribute() {

  }
  render () {
    let icon;
    let tree = TreeStore.getTree(this.props.tree);
    if (tree != null) {
      icon = FoodStore.getFood(tree.food).icon;
    } else {
      icon = MapSetting.uTemporaryMarkerIcon;
    }
    if (this.state.editing) {
      return (
        <div className="tree-food-wrapper fade-in">
          <Select name="food-select" multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(971)} />
        </div>
      );
    } else {
      return (
        <div className="tree-food-wrapper fade-in disabled">
          <Select name="food-select" multi={false} disabled clearable={false} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(971)} />
        </div>
      );
    }
  }
}
