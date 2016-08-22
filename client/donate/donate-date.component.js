import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
let DateTimeField = require('react-bootstrap-datetimepicker');
import moment from 'moment';


require('./donate-date.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';
import { localization } from './../utils/localization';
let DonateStore = require('./../stores/donate.store');
let DonateActions = require('./../actions/donate.actions');


export default class DonateDate extends React.Component {
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
    let prevDate = this.props.donate.date;
    if (date) {
      this.props.donate.date = date;
    }
    if (prevDate != date) {
      DonateActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    let style = "";
    if (this.props.donate.type == NOTETYPE.DONATE) {
      style = " donate-comment-brown";
    }
    if (this.props.editing) {
      return (
        <div className={"donate-date-wrapper" + style}>
          <div className="donate-date-label">
            <FontAwesome className='' name='calendar-o' />{localization(935)}
          </div>
          <div className="donate-date-data">
            <div className="donate-date-input">
              <DateTimeField mode="date" dateTime={this.props.donate.getFormattedDate()} maxDate={moment(new Date())} format={ServerSetting.sUIDateFormat} onChange={(event: any)=> {
                this.updateAttribute(moment(event, ServerSetting.sUIDateFormat));
              }}/>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={"donate-date-wrapper" + style}>
          <div className="donate-date-label">
            <FontAwesome className='' name='calendar-o' />{localization(935)}
          </div>
          <div className="donate-date-data">
            <div className="donate-date-text">
              {this.props.donate.getFormattedDate()}
            </div>
          </div>
        </div>
      );
    }
  }
}
