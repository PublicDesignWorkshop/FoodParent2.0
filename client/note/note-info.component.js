import React from 'react';
import AltContainer from 'alt-container';

require('./note-info.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';
import NoteType from './note-type.component';

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
    this.setState({editing: false});
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
    switch(this.props.note.type) {
      case NOTETYPE.CHANGE:
        style = " note-info-light";
        break;
      case NOTETYPE.UPDATE:
        style = " note-info-green";
        break;
      case NOTETYPE.PICKUP:
        style = " note-info-brown";
      break;
    }

    let actions;
    let buttonStyle;
    switch(this.props.note.type) {
      case NOTETYPE.UPDATE:
        buttonStyle = " static-button-green";
        break;
      case NOTETYPE.PICKUP:
        buttonStyle = " static-button-brown";
        break;
    }
    if (this.state.editing) {
      actions = <div className="static-button-group">
        <div className={"static-button" + buttonStyle} onClick={() => {
          this.setState({editing: false});
        }}>
          {localization(930) /* SAVE */}
        </div>
        <div className={"static-button" + buttonStyle} onClick={() => {
          this.setState({editing: false});
          NoteActions.setSelected(this.props.note.id);
        }}>
          {localization(933) /* CANCEL */}
        </div>
      </div>;
    } else {
      actions = <div className="static-button-group">
        <div className={"static-button" + buttonStyle} onClick={() => {
          this.setState({editing: true});
        }}>
          {localization(928) /* EDIT */}
        </div>
      </div>;
    }

    return (
      <div className={"note-info-wrapper" + style}>
        <NoteType note={this.props.note} editing={this.state.editing} />
        {actions}
      </div>
    );
  }
}
