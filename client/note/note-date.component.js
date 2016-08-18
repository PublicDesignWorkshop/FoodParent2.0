import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
let DateTimeField = require('react-bootstrap-datetimepicker');
import moment from 'moment';


require('./note-date.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
let NoteStore = require('./../stores/note.store');
let NoteActions = require('./../actions/note.actions');


export default class NoteDate extends React.Component {
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
    if (props.note != null) {
      if (props.note.comment && props.note.comment.trim() != "") {
        this.setState({comment: props.note.comment});
      } else {
        if (props.editing) {
          this.setState({comment: ""});
        } else {
          this.setState({comment: localization(95)});
        }
      }
    } else {
      this.setState({comment: localization(95)});
    }
  }
  updateAttribute(date) {
    console.log(date);
    // let prevDescription = this.props.tree.description;
    // if (this.state.description && this.state.description.trim() != "") {
    //   this.props.tree.description = this.state.description.trim();
    //   this.setState({description: this.props.tree.description});
    // } else {
    //   this.setState({description: ""});
    // }
    // if (prevDescription != this.state.description) {
    //   TreeActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    // }
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="note-date-wrapper">
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
        <div className="note-date-wrapper">
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
