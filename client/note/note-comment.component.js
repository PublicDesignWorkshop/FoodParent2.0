import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import Textarea from 'react-textarea-autosize';


require('./note-comment.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';
let NoteStore = require('./../stores/note.store');
let NoteActions = require('./../actions/note.actions');


export default class NoteComment extends React.Component {
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
  updateAttribute() {
    let prevComment = this.props.note.comment;
    if (this.state.comment && this.state.comment.trim() != "") {
      this.props.note.comment = this.state.comment.trim();
      this.setState({comment: this.props.note.comment});
    } else {
      this.setState({comment: ""});
    }
    if (prevComment != this.state.comment) {
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
        <div className={"note-comment-wrapper" + style}>
          <div className="note-comment-label">
            <FontAwesome className='' name='comment-o' />{localization(999)}
          </div>
          <div className="note-comment-data">
            <Textarea type="text" className="note-comment-input" placeholder={localization(601)}
              value={this.state.comment}
              onChange={(event: any)=> {
                this.setState({comment: event.target.value});
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
        <div className={"note-comment-wrapper" + style}>
          <div className="note-comment-label">
            <FontAwesome className='' name='comment-o' />{localization(999)}
          </div>
          <div className="note-comment-data">
            <div className="note-comment-text">
              {this.state.comment}
            </div>
          </div>
        </div>
      );
    }
  }
}
