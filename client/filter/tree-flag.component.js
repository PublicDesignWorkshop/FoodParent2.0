import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import $ from 'jquery';


require('./tree-flag.component.scss');
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


export default class TreeRate extends React.Component {
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
    options.push({value: 0, label: localization(24)});  // alive
    options.push({value: 1, label: localization(25)});  // dead
    if (props.dead == 1) { // dead
      selected = options[1];
    } else {
      selected = options[0];
    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    return <span className="tree-flag-name">{option.label}</span>;
  }
  updateAttribute(selected) {
    updateFilter(FITERMODE.DEAD, [parseInt(selected.value)], function(response) {  // Resolve
      TreeActions.fetchTrees();
    }, function(response) { // Reject

    });
    this.setState({selected: selected});
  }
  render () {
    return (
      <div className="tree-filter-wrapper">
        <div className="filter-label">
          <FontAwesome className='' name='tag' />{localization(969)}
        </div>
        <div className="filter-data brown-medium-single active">
          <Select name="flag-select" multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(970)} backspaceToRemoveMessage="" />
        </div>
      </div>
    );
  }
}
