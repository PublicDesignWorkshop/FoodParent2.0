import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import $ from 'jquery';


require('./tree-adopt.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { FITERMODE } from './../utils/enum';
import { updateFilter } from './../utils/filter';

let FoodStore = require('./../stores/food.store');
let FlagStore = require('./../stores/flag.store');
let AuthStore = require('./../stores/auth.store');
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');


export default class TreeAdopt extends React.Component {
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

    options.push({value: 0, label: localization(631)});
    options.push({value: 1, label: localization(630)});
    options.push({value: 2, label: localization(629)});
    options.push({value: 3, label: localization(628)});

    if (props.adopts) {
      props.adopts.forEach(adopt => {
        if (adopt == 0) {
          selected = {value: 0, label: localization(631)};
        } else if (adopt == 1) {
          selected ={value: 1, label: localization(630)};
        } else if (adopt == 2) {
          selected = {value: 2, label: localization(629)};
        } else if (adopt == 3) {
          selected = {value: 3, label: localization(628)};
        }
      });
    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    return <span className="tree-flag-name">{option.label}</span>;
  }
  updateAttribute(selected) {
    let adopts = parseInt(selected.value);
    updateFilter(FITERMODE.ADOPT, adopts, function(response) {  // Resolve
      TreeActions.fetchTrees();
    }, function(response) { // Reject

    });
    this.setState({selected: selected});
  }
  render () {
    return (
      <div className="tree-filter-wrapper">
        <div className="filter-label">
          <FontAwesome className='' name='chain' />{localization(632)}
        </div>
        <div className="filter-data brown-medium-single">
          <Select name="food-select" multi={false} clearable={true} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(627)} backspaceToRemoveMessage="" />
        </div>
      </div>
    );
  }
}
