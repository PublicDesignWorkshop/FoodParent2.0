import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import $ from 'jquery';


require('./note-rate.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { FITERMODE } from './../utils/enum';
import { updateFilter } from './../utils/filter';

let FoodStore = require('./../stores/food.store');
let FlagStore = require('./../stores/flag.store');

let NoteStore = require('./../stores/tree.store');
let NoteActions = require('./../actions/tree.actions');


export default class NoteRate extends React.Component {
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

    if (props.note.rate == 0) {
      selected = {value: 0, label: localization(936)};
    } else if (props.note.rate == 1) {
      selected = {value: 1, label: localization(937)};
    } else if (props.note.rate == 2) {
      selected = {value: 2, label: localization(938)};
    } else if (props.note.rate == 3) {
      selected = {value: 3, label: localization(939)};
    } else if (props.note.rate == 4) {
      selected = {value: 4, label: localization(940)};
    } else if (props.note.rate == 5) {
      selected = {value: 5, label: localization(941)};
    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    let stars = [];
    if (option.value == 0) {
      stars.push(<FontAwesome key={"star 0"} className='' name='star' />);
    } else {
      for (let i=0; i<5; i++) {
        if (i >= option.value) {
          // stars.push(<FontAwesome key={"star" + i} className='' name='star-o' />);
        } else {
          stars.push(<FontAwesome key={"star" + i} className='' name='star' />);
        }
      }
    }
    return (<span className="note-rate-name">{stars}<span>{" (" + option.label + ")"}</span></span>);
  }
  updateAttribute(selected) {
    let prevRate = this.props.note.rate;
    if (selected) {
      this.props.note.rate = parseInt(selected.value);
    }
    if (prevRate != parseInt(selected.value)) {
      NoteActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
    this.setState({selected: selected});
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="note-rate-wrapper">
          <div className="note-rate-label">
            <FontAwesome className='' name='star-half-o' />{localization(670)}
          </div>
          <div className="note-rate-data active">
            <div className="green-medium-single">
              <Select name="rate-select" multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(671)} backspaceToRemoveMessage="" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="note-rate-wrapper">
          <div className="note-rate-label">
            <FontAwesome className='' name='star-half-o' />{localization(670)}
          </div>
          <div className="note-rate-data">
            <div className="green-medium-single">
              <Select name="rate-select" disabled multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(671)} backspaceToRemoveMessage="" />
            </div>
          </div>
        </div>
      );
    }

  }
}
