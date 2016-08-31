import React from 'react';
import AltContainer from 'alt-container';

require('./note-info.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';
import NoteType from './note-type.component';
import NoteRate from './note-rate.component';
import NoteComment from './note-comment.component';
import NoteDate from './note-date.component';
import NoteAmount from './note-amount.component';
import NoteProper from './note-proper.component';
import NoteImage from './note-image.component';
import NoteAuthor from './note-author.component';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let NoteActions = require('./../actions/note.actions');
let NoteStore = require('./../stores/note.store');
let AuthStore = require('./../stores/auth.store');


export default class NoteInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    let editing = false;
    if (this.props.editing) {
      editing = this.props.editing;
    }
    this.setState({editing: editing, remove: false});
  }
  componentDidMount () {
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {

  }
  render () {
    let style = "";
    let actions;
    let popup;
    let buttonStyle;
    if (this.props.note) {
      switch(this.props.note.type) {
        case NOTETYPE.CHANGE:
          style = " note-info-light";
          break;
        case NOTETYPE.UPDATE:
          style = " note-info-brown";
          break;
        case NOTETYPE.PICKUP:
          style = " note-info-green";
        break;
      }
      if (this.props.note.id == 0) {
        style += " scrollable";
      }
      switch(this.props.note.type) {
        case NOTETYPE.UPDATE:
          buttonStyle = " solid-button-brown";
          break;
        case NOTETYPE.PICKUP:
          buttonStyle = " solid-button-green";
          break;
      }
    }
    if (this.props.note) {
      if (this.state.editing && this.props.note.id) {
        actions = <div>
          <div className="solid-button-group same-border-color-padding">
            <div className={"solid-button" + buttonStyle} onClick={() => {
              this.setState({editing: false, remove: false});
              NoteActions.updateNote(NoteStore.getState().temp);
            }}>
              {localization(930) /* SAVE */}
            </div>
            <div className={"solid-button" + buttonStyle} onClick={() => {
              this.setState({editing: false, remove: false});
              NoteActions.setSelected(this.props.note.id);
            }}>
              {localization(933) /* CANCEL */}
            </div>
          </div>
          <div className="danger-zone">{localization(927) /* DELETE THIS NOTE */}</div>
          <div className="solid-button-group">
            <div className="solid-button solid-button-red" onClick={() => {
              this.setState({remove: true});
              // this.context.router.push({pathname: window.location.pathname, hash: "#delete"});
            }}>
              {localization(931) /* DELETE THIS TREE */}
            </div>
          </div>
        </div>;
      } else if (this.state.editing && this.props.note.id == 0) { // Create a new note.
        actions = <div>
          <div className="solid-button-group same-border-color-padding">
            <div className={"solid-button" + buttonStyle} onClick={() => {
              this.setState({editing: false, remove: false});
              NoteActions.createNote.defer(NoteStore.getState().temp);
            }}>
              {localization(930) /* SAVE */}
            </div>
          </div>
        </div>;
      } else {
        if (this.props.note.isEditable()) {
          actions = <div className="solid-button-group same-border-color-padding">
            <div className={"solid-button" + buttonStyle} onClick={() => {
              this.setState({editing: true});
            }}>
              {localization(928) /* EDIT */}
            </div>
            <div className={"solid-button" + buttonStyle} onClick={() => {
              NoteActions.setSelected(null);
            }}>
              {localization(72) /* CLOSE */}
            </div>
          </div>;
        } else {
          actions = <div className="solid-button-group same-border-color-padding">
            <div className={"solid-button" + buttonStyle} onClick={() => {
              NoteActions.setSelected(null);
            }}>
              {localization(72) /* CLOSE */}
            </div>
          </div>;
        }
      }
    }
    if (this.state.remove) {
      popup = <div className="popup-wrapper popup-red open">
        <div className="popup-message">
          <span dangerouslySetInnerHTML={{__html: localization(606)}} />
          <span className="popup-button" onClick={()=> {
            NoteActions.deleteNote(NoteStore.getState().temp);
          }}>
            {localization(931)}
          </span>
          <span className="popup-button" onClick={()=> {
            this.setState({remove: false});
          }}>
            {localization(933)}
          </span>
        </div>
      </div>;
    }
    let authorEditing = false;
    if (this.props.note && this.props.note.id == 0 && AuthStore.getState().auth.id == 0 && AuthStore.getState().auth.contact == "") {
      authorEditing = true;
    }
    if (this.props.note && this.state.editing && this.props.note.isEditable() && AuthStore.getState().auth.id == 0 && AuthStore.getState().auth.contact == "") {
      authorEditing = true;
    }
    if (this.props.note) {
      if (this.props.note.type == NOTETYPE.UPDATE) {
        return (
          <div className={"note-info-wrapper" + style}>
            <NoteImage note={this.props.note} editing={this.state.editing} />
            <NoteRate note={this.props.note} editing={this.state.editing} />
            <NoteComment note={this.props.note} editing={this.state.editing} />
            <NoteDate note={this.props.note} editing={this.state.editing} />
            <NoteAuthor note={this.props.note} editing={authorEditing} />
            {actions}
            {popup}
          </div>
        );
      } else {
        return (
          <div className={"note-info-wrapper" + style}>
            <NoteImage note={this.props.note} editing={this.state.editing} />
            <NoteAmount note={this.props.note} editing={this.state.editing} />
            <NoteProper note={this.props.note} editing={this.state.editing} />
            <NoteComment note={this.props.note} editing={this.state.editing} />
            <NoteDate note={this.props.note} editing={this.state.editing} />
            <NoteAuthor note={this.props.note} editing={authorEditing} />
            {actions}
            {popup}
          </div>
        );
      }
    } else {
      return (<div></div>);
    }
  }
}
// In case of adding a pickup note option.
// <NoteType note={this.props.note} editing={this.state.editing} />
