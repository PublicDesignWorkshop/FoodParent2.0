import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';

require('./note-amount.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');
import { localization } from './../utils/localization';
let NoteStore = require('./../stores/note.store');
let NoteActions = require('./../actions/note.actions');
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';


export default class NoteAmount extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
    this.updateAmountType = this.updateAmountType.bind(this);
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
    let options = [];
    options.push({value: 1, label: "lbs."});
    options.push({value: 2, label: "kg"});
    options.push({value: 3, label: "g"});
    let selected;
    switch(props.note.amountType) {
      case AMOUNTTYPE.LBS:
        selected = options[0];
        break;
      case AMOUNTTYPE.KG:
        selected = options[1];
        break;
      case AMOUNTTYPE.G:
        selected = options[2];
        break;
    }
    this.setState({options: options, selected: selected, amount: parseFloat(parseFloat(props.note.amount).toFixed(ServerSetting.iAmountPrecision))});
  }
  updateAttribute() {
    let prevAmount = this.props.note.amount;
    if (this.state.amount) {
      this.props.note.amount = this.state.amount;
      this.setState({amount: this.props.note.amount});
    } else {
      this.setState({amount: 0});
    }
    if (prevAmount != this.state.amount) {
      NoteActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  updateAmountType(selected) {
    let prevAmountType = this.props.note.amountType;
    switch(selected.value) {
      case 1:
        this.props.note.amountType = AMOUNTTYPE.LBS;
        break;
      case 2:
        this.props.note.amountType = AMOUNTTYPE.KG;
        break;
      case 3:
        this.props.note.amountType = AMOUNTTYPE.G;
        break;
    }
    if (prevAmountType != this.props.note.amountType) {
      NoteActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
    this.setState({selected: selected});
  }
  render () {
    let style = "";
    if (this.props.note.type == NOTETYPE.PICKUP) {
      style = " note-comment-brown";
    }
    if (this.props.editing) {
      return (
        <div className={"note-amount-wrapper" + style}>
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
              <div className="brown-medium-single">
                <Select className="note-unit-select" name="unit-select" multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={this.state.options} value={this.state.selected} onChange={this.updateAmountType} />
              </div>
          </div>
        </div>
      );
    } else {
      let unit = "";
      switch(this.props.note.amountType) {
        case AMOUNTTYPE.LBS:
          unit = " lbs.";
          break;
        case AMOUNTTYPE.KG:
          unit = " kg";
          break;
        case AMOUNTTYPE.G:
          unit = " g";
          break;
      }
      return (
        <div className={"note-amount-wrapper" + style}>
          <div className="note-amount-label">
            <FontAwesome className='' name='shopping-basket' />{localization(998)}
          </div>
          <div className="note-amount-data">
            <div className="note-amount-text">
              {this.state.amount}{unit}
            </div>
          </div>
        </div>
      );
    }
  }
}
