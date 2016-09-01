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
let FoodStore = require('./../stores/food.store');
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
    let selected = null;
    if (props.tree != null) {
      options.push({value: 1, label: localization(975)});
      options.push({value: 0, label: localization(974)});
      if (props.tree.ownership == 0) {
        selected = options[1];
      } else {
        selected = options[0];
      }
    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    return <span className="tree-flag-name">{option.label}</span>;
  }
  updateAttribute(selected) {
    let ownership = 0;
    if (selected) {
      ownership = parseInt(selected.value);
    }
    TreeActions.setCode(94);
    this.props.tree.ownership = ownership;
    this.setState({selected: selected});
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="tree-ownership-wrapper">
          <div className="tree-ownership-label">
            <FontAwesome className='' name='home' />{localization(977)}
          </div>
          <div className="tree-ownership-data brown-medium-single active">
            <Select name="ownership-select" multi={false} backspaceToRemoveMessage="" clearable={false} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(970)} />
          </div>
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}
