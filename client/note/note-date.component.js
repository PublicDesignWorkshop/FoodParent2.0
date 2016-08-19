import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
let DateTimeField = require('react-bootstrap-datetimepicker');
import moment from 'moment';


require('./note-date.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';
import { localization } from './../utils/localization';
let NoteStore = require('./../stores/note.store');
let NoteActions = require('./../actions/note.actions');


export default class NoteDate extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
  }
  componentWillMount() {

  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {

  }
  updateAttribute(date) {
    let prevDate = this.props.note.date;
    if (date) {
      this.props.note.date = date;
    }
    if (prevDate != date) {
      NoteActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    let style = "";
    if (this.props.note.type == NOTETYPE.PICKUP) {
      style = " note-comment-brown";
    }
    if (this.props.editing) {
      return (
        <div className={"note-date-wrapper" + style}>
          <div className="note-date-label">
            <FontAwesome className='' name='calendar-o' />{localization(935)}
          </div>
          <div className="note-date-data">
            <div className="note-date-input">
              <DateTimeField mode="date" dateTime={this.props.note.getFormattedDate()} maxDate={moment(new Date())} format={ServerSetting.sUIDateFormat} onChange={(event: any)=> {
                this.updateAttribute(moment(event, ServerSetting.sUIDateFormat));
              }}/>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={"note-date-wrapper" + style}>
          <div className="note-date-label">
            <FontAwesome className='' name='calendar-o' />{localization(935)}
          </div>
          <div className="note-date-data">
            <div className="note-date-text">
              {this.props.note.getFormattedDate()}
            </div>
          </div>
        </div>
      );
    }
  }
}
