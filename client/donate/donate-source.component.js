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
let TreeActions = require('./../actions/tree.actions');

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
      let food = FoodStore.getFood(props.donate.food);
      if (food && food.farm) {
        // value: -1 for doghead farm.
        options.push({value: -1, label: localization(48)});
        selected.push({value: -1, label: localization(48)});
        props.donate.trees = [-1];
      } else {
        props.trees.forEach(tree => {
          if (tree.id > 0) {
            options.push({value: tree.id, label: tree.getName()});
            if ($.inArray(tree.id, props.donate.trees) > -1) {
              selected.push({value: tree.id, label: tree.getName()});
            }
          }
        });
      }
    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    return <span className="tree-flag-name">{option.label}</span>;
  }
  updateAttribute(selected) {
    let trees = [];
    this.state.selected.forEach(option => {
      let tree = TreeStore.getTree(parseInt(option.value));
      if (tree) {
        tree.checked = false;
      }
    });
    if (selected) {
      selected.forEach(option => {
        let tree = TreeStore.getTree(parseInt(option.value));
        if (tree) {
          trees.push(tree.id);
          tree.checked = true;
        }
      });
    }
    if (this.props.donate && trees.length == 0) {
      let food = FoodStore.getFood(this.props.donate.food);
      if (food && food.farm) {
        this.props.donate.trees = [-1]; // -1 for Doghead farm.
      }
    }
    this.props.donate.trees = trees;
    DonateActions.setCode(94);
    TreeActions.setCode(200);
    this.setState({selected: selected});
  }
  componentWillUnmount() {
    this.props.donate.selectmode = false;
  }
  render () {
    let actions, popup;
    if (this.props.donate && !this.props.donate.selectmode) {
      actions = <div className="only-for-handheld">
        <div className="solid-button-group">
          <div className="solid-button solid-button-green" onClick={() => {
            this.props.donate.selectmode = true;
            this.forceUpdate();
            $('.donation-panel-wrapper').addClass('close');
          }}>
            {localization(47) /* DELETE THIS TREE */}
          </div>
        </div>
      </div>;
    }
    if (this.props.donate && this.props.donate.selectmode) {
      popup = <div className="popup-wrapper popup-red open">
        <div className="popup-message">
          <span dangerouslySetInnerHTML={{__html: localization(46)}} />
          <span className="popup-button" onClick={()=> {
            this.props.donate.selectmode = false;
            this.forceUpdate();
            $('.donation-panel-wrapper').removeClass('close');
          }}>
            {localization(45)}
          </span>
        </div>
      </div>;
    }
    if (this.props.editing) {
      return (
        <div className="donate-source-wrapper">
          <div className="donate-source-label">
            <FontAwesome className='' name='mail-forward' />{localization(610)}
          </div>
          <div className="donate-source-data brown-medium-single active">
            <Select name="tree-select" multi={true} clearable={true} searchable={true} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(611)} backspaceToRemoveMessage="" />
          </div>
          {actions}
          {popup}
        </div>
      );
    } else {
      return (
        <div className="donate-source-wrapper disabled">
          <div className="donate-source-label">
            <FontAwesome className='' name='tag' />{localization(610)}
          </div>
          <div className="donate-source-data brown-medium-single">
            <Select name="tree-select" multi={true} clearable={true} searchable={true} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(76)} backspaceToRemoveMessage="" disabled />
          </div>
        </div>
      );
    }
  }
}
