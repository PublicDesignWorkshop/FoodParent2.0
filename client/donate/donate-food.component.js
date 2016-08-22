import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import $ from 'jquery';


require('./donate-food.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');
import { FITERMODE } from './../utils/enum';
import { updateFilter } from './../utils/filter';
import { localization } from './../utils/localization';

let FoodStore = require('./../stores/food.store');
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');

let DonateStore = require('./../stores/donate.store');
let DonateActions = require('./../actions/donate.actions');


export default class DonateFood extends React.Component {
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
      options.push({value: food.id, label: food.name});
      if (food.id == props.donate.food) {
        selected = {value: food.id, label: food.name};
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
    let prevFood = this.props.donate.food;
    if (selected.value) {
      this.props.donate.food = selected.value;
    }
    if (prevFood != selected.value) {
      this.props.donate.trees = [];
      DonateActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
    updateFilter(FITERMODE.FOOD, [selected.value], function(response) {  // Resolve
      TreeActions.fetchTrees();
    }, function(response) { // Reject

    });
    this.setState({selected: selected});
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="donate-food-wrapper">
          <div className="donate-food-label">
            <FontAwesome className='' name='apple' />{localization(633)}
          </div>
          <div className="donate-food-data brown-medium-single">
            <Select name="food-select" multi={false} clearable={false} searchable={true} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(642)} backspaceToRemoveMessage="" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="donate-food-wrapper">
          <div className="donate-food-label">
            <FontAwesome className='' name='apple' />{localization(633)}
          </div>
          <div className="donate-food-data brown-medium-single">
            <Select name="food-select" multi={false} clearable={false} searchable={true} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(642)} backspaceToRemoveMessage="" disabled />
          </div>
        </div>
      );
    }

  }
}
