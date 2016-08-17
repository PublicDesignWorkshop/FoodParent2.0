import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import $ from 'jquery';


require('./tree-rate.component.scss');
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

    options.push({value: 0, label: localization(936)});
    options.push({value: 1, label: localization(937)});
    options.push({value: 2, label: localization(938)});
    options.push({value: 3, label: localization(939)});
    options.push({value: 4, label: localization(940)});
    options.push({value: 5, label: localization(941)});

    if (props.rates) {
      props.rates.forEach(rate => {
        if (selected == null)
          selected = [];
        if (rate == 0) {
          selected.push({value: 0, label: localization(936)});
        } else if (rate == 1) {
          selected.push({value: 1, label: localization(937)});
        } else if (rate == 2) {
          selected.push({value: 2, label: localization(938)});
        } else if (rate == 3) {
          selected.push({value: 3, label: localization(939)});
        } else if (rate == 4) {
          selected.push({value: 4, label: localization(940)});
        } else if (rate == 5) {
          selected.push({value: 5, label: localization(941)});
        }
      });
    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    let stars = [];
    if (option.value == 0) {
      stars.push(<FontAwesome key={"star 0"} className='' name='star-o' />);
    } else {
      for (let i=0; i<5; i++) {
        if (i >= option.value) {
          // stars.push(<FontAwesome key={"star" + i} className='' name='star-o' />);
        } else {
          stars.push(<FontAwesome key={"star" + i} className='' name='star' />);
        }
      }
    }
    return (<span className="tree-flag-name">{stars}<span>{" (" + option.label + ")"}</span></span>);
  }
  updateAttribute(selected) {
    var rates = [];
    if (selected) {
      selected.forEach(option => {
        rates.push(parseInt(option.value));
      });
    }
    updateFilter(FITERMODE.RATE, rates, function(response) {  // Resolve
      TreeActions.fetchTrees();
    }, function(response) { // Reject

    });
    this.setState({selected: selected});
  }
  render () {
    return (
      <div className="tree-filter-wrapper">
        <div className="filter-label">
          <FontAwesome className='' name='star' />{localization(670)}
        </div>
        <div className="brown-medium-multi">
          <Select name="food-select" multi={true} clearable={true} searchable={true} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(671)} backspaceToRemoveMessage="" />
        </div>
      </div>
    );
  }
}
