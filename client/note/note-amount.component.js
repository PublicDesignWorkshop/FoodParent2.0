import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import Textarea from 'react-textarea-autosize';


require('./note-amount.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
let NoteStore = require('./../stores/note.store');
let NoteActions = require('./../actions/note.actions');


export default class NoteAmount extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
  }
  componentWillMount() {
    this.updateProps(this.props);
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    this.setState({amount: parseFloat(parseFloat(props.note.amount).toFixed(ServerSetting.iAmountPrecision))});
  }
  updateAttribute() {
    let prevAmount = this.props.note.amount;
    if (this.state.amount && this.state.amount.trim() != "") {
      this.props.note.amount = this.state.amount.trim();
      this.setState({amount: this.props.note.amount});
    } else {
      this.setState({amount: 0});
    }
    if (prevAmount != this.state.amount) {
      NoteActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="note-amount-wrapper">
          <div className="note-amount-label">
            <FontAwesome className='' name='shopping-basket' />{localization(998)}
          </div>
          <div className="note-amount-data">
            <input type="text" className="note-amount-input" placeholder={localization(673)}
              value={this.state.amount}
              onChange={(event: any)=> {
                this.setState({amount: event.target.value});
              }}
              onKeyPress={(event)=> {
                if (event.key == 'Enter') {
                  this.updateAttribute();
                }
              }}
              onBlur={()=> {
                this.updateAttribute();
              }} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="note-amount-wrapper">
          <div className="note-amount-label">
            <FontAwesome className='' name='shopping-basket' />{localization(998)}
          </div>
          <div className="note-amount-data">
            <div className="note-amount-text">
              {this.state.amount}
            </div>
          </div>
        </div>
      );
    }
  }
}
