import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import $ from 'jquery';


require('./donate-source.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
let FoodStore = require('./../stores/food.store');
let TreeStore = require('./../stores/tree.store');

let DonateStore = require('./../stores/donate.store');
let DonateActions = require('./../actions/donate.actions');


export default class DonateSource extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
    this.renderOptionValue = this.renderOptionValue.bind(this);
  }
  componentWillMount() {
    this.setState({options: null, selected: null});
    if (this.props.donate) {

    }
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
    if (props.donate && props.trees) {
      props.trees.forEach(tree => {
        options.push({value: tree.id, label: tree.getName()});
        if ($.inArray(tree.id, props.donate.trees) > -1) {
          selected.push({value: tree.id, label: tree.getName()});
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
        <div className="donate-source-wrapper">
          <div className="donate-source-label">
            <FontAwesome className='' name='tag' />{localization(969)}
          </div>
          <div className="donate-source-data brown-medium-single active">
            <Select name="tree-select" multi={true} clearable={true} searchable={true} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(970)} backspaceToRemoveMessage="" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="donate-source-wrapper disabled">
          <div className="donate-source-label">
            <FontAwesome className='' name='tag' />{localization(969)}
          </div>
          <div className="donate-source-data brown-medium-single">
            <Select name="tree-select" multi={true} clearable={true} searchable={true} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(76)} backspaceToRemoveMessage="" disabled />
          </div>
        </div>
      );
    }
  }
}
