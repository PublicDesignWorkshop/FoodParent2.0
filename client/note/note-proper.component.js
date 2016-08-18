import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import $ from 'jquery';


require('./note-proper.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { FITERMODE, PICKUPTIME } from './../utils/enum';
import { updateFilter } from './../utils/filter';

let FoodStore = require('./../stores/food.store');
let FlagStore = require('./../stores/flag.store');

let NoteStore = require('./../stores/tree.store');
let NoteActions = require('./../actions/tree.actions');


export default class NoteProper extends React.Component {
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
    options.push({value: 1, label: localization(988)});
    options.push({value: 2, label: localization(989)});
    options.push({value: 3, label: localization(990)});
    switch(props.note.proper) {
      case PICKUPTIME.EARLY:
        selected = options[0];
        break;
      case PICKUPTIME.PROPER:
        selected = options[1];
        break;
      case PICKUPTIME.LATE:
        selected = options[2];
        break;
      default:
        selected = options[1];
        break;
    }
    this.setState({options: options, selected: selected});
  }
  renderOptionValue(option) {
    return (<span className="note-proper-name">{option.label}</span>);
  }
  updateAttribute(selected) {
    let prevProper = this.props.note.proper;
    if (selected) {
      switch(parseInt(selected.value)) {
        case 1:
          this.props.note.proper = PICKUPTIME.EARLY;
          break;
        case 2:
          this.props.note.proper = PICKUPTIME.PROPER;
          break;
        case 3:
          this.props.note.proper = PICKUPTIME.LATE;
          break;
      }
    }
    if (prevProper != this.props.note.proper) {
      NoteActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
    this.setState({selected: selected});
  }
  render () {
    let proper = "";
    switch(this.props.note.proper) {
      case PICKUPTIME.EARLY:
        proper = localization(988);
        break;
      case PICKUPTIME.PROPER:
        proper = localization(989);
        break;
      case PICKUPTIME.LATE:
        proper = localization(990);
        break;
    }
    if (this.props.editing) {
      return (
        <div className="tree-filter-wrapper">
          <div className="note-proper-label">
            <FontAwesome className='' name='hourglass-1' />{localization(71)}
          </div>
          <div className="note-proper-data">
            <div className="brown-medium-single">
              <Select name="proper-select" multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} valueRenderer={this.renderOptionValue} optionRenderer={this.renderOptionValue} onChange={this.updateAttribute} placeholder={localization(71)} backspaceToRemoveMessage="" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="tree-filter-wrapper disabled">
          <div className="note-proper-label">
            <FontAwesome className='' name='hourglass-1' />{localization(71)}
          </div>
          <div className="note-proper-data2">
            {proper}
          </div>
        </div>
      );
    }

  }
}
