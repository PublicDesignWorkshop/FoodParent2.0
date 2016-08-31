import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import $ from 'jquery';


require('./tree-ownership.component.scss');
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


export default class TreeOwnership extends React.Component {
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
    let selected = [];
    if (props.ownerships != null) {
      options.push({value: 0, label: localization(974)});
      options.push({value: 1, label: localization(975)});

      props.ownerships.forEach((ownership) => {
        if (ownership == 0) {
          selected.push(options[0]);
        } else {
          selected.push(options[1]);
        }
      })

    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    return <span className="tree-flag-name">{option.label}</span>;
  }
  updateAttribute(selected) {
    var ownerships = [];
    if (selected) {
      selected.forEach(option => {
        ownerships.push(parseInt(option.value));
      });
    }
    updateFilter(FITERMODE.OWNERSHIP, ownerships, function(response) {  // Resolve
      TreeActions.fetchTrees();
    }, function(response) { // Reject

    });
    this.setState({selected: selected});
  }
  render () {
    return (
      <div className="tree-filter-wrapper">
        <div className="filter-label">
          <FontAwesome className='' name='home' />{localization(977)}
        </div>
        <div className="filter-data brown-medium-single active">
          <Select name="flag-select" multi={true} clearable={true} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(970)} backspaceToRemoveMessage="" />
        </div>
      </div>
    );
  }
}
