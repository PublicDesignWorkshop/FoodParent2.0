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
        <div className="note-comment-wrapper">
          <div className="note-comment-label">
            <FontAwesome className='' name='comment-o' />{localization(968)}
          </div>
          <div className="note-comment-data">
            <Textarea type="text" className="note-comment-input" placeholder={localization(973)}
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
        <div className="note-comment-wrapper">
          <div className="note-comment-label">
            <FontAwesome className='' name='comment-o' />{localization(968)}
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
