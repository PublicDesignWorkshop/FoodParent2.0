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
let FoodStore = require('./../stores/food.store');
let FlagStore = require('./../stores/flag.store');

let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');


export default class TreeFlag extends React.Component {
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
    if (props.tree != null) {
      let flags = FlagStore.getState().flags;
      flags.forEach(flag => {
        if (ServerSetting.iDeadFlagId == flag.id && props.tree.id == 0) {
          // Dead flag should not be added for a new tree.
        } else {
          options.push({value: flag.id, label: flag.name});
          if ($.inArray(flag.id, props.tree.flags) != -1) {
            selected.push({value: flag.id, label: flag.name});
          }
        }
      });
    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    return <span className="tree-flag-name">{option.label}</span>;
  }
  updateAttribute(selected) {
    let flags = [];
    if (selected) {
      selected.forEach(option => {
        flags.push(parseInt(option.value));
      });
    }
    TreeActions.setCode(94);
    this.props.tree.flags = flags;
    this.setState({selected: selected});
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="tree-flag-wrapper">
          <div className="tree-flag-label">
            <FontAwesome className='' name='tag' />{localization(969)}
          </div>
          <div className="tree-flag-data brown-medium-single active">
            <Select name="flag-select" multi={true} clearable={true} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(970)} backspaceToRemoveMessage="" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="tree-flag-wrapper disabled">
          <div className="tree-flag-label">
            <FontAwesome className='' name='tag' />{localization(969)}
          </div>
          <div className="tree-flag-data brown-medium-single">
            <Select name="flag-select" multi={true} clearable={true} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(76)} backspaceToRemoveMessage="" disabled />
          </div>
        </div>
      );
    }
  }
}
