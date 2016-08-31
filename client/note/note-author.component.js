import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import { isValidEmailAddressOrBlank } from './../utils/validation';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';

require('./note-author.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');
import { localization } from './../utils/localization';
import { NOTETYPE } from './../utils/enum';
let NoteStore = require('./../stores/note.store');
let NoteActions = require('./../actions/note.actions');

export default class NoteAuthor extends React.Component {
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
      this.setState({author: props.note.person});
    } else {
      this.setState({author: ""});
    }

  }
  updateAttribute() {
    let error: any = null;
    try {
      isValidEmailAddressOrBlank(this.state.author.trim());
      let prevAuthor = this.props.note.person;
      if (this.state.author) {
        this.props.note.person = this.state.author;
        this.setState({author: this.props.note.person});
      } else {
        this.setState({author: ""});
      }
      if (prevAuthor != this.state.author) {
        NoteActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
      }
    } catch(e) {
      this.setState({author: ""});
      displayFailMessage(localization(e.message));
      if (__DEV__) {
        console.error(localization(e.message));
      }
      error = e.message;
    }
  }
  render () {
    let style = "";
    if (this.props.note.type == NOTETYPE.UPDATE) {
      style = " note-comment-brown";
    }
    if (this.props.editing) {
      return (
        <div className={"note-author-wrapper" + style}>
          <div className="note-author-label">
            <FontAwesome className='' name='user' />{localization(64)}
          </div>
          <div className="note-author-data">
            <input type="email" name="email" className="note-author-input" id={"author-contact"} key={"author-contact"} placeholder={localization(682)}
              value={this.state.author}
              autoComplete
              onChange={(event: any)=> {
                this.setState({author: event.target.value.trim()});
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
      let author = this.state.author;
      if (author == null || author.trim() == "") {
        author = localization(63);
      }
      return (
        <div className={"note-author-wrapper" + style}>
          <div className="note-author-label">
            <FontAwesome className='' name='user' />{localization(64)}
          </div>
          <div className="note-author-data">
            <div className="note-author-text">
              {author}
            </div>
          </div>
        </div>
      );
    }
  }
}
