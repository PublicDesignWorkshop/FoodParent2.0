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
    let stars = [];
    let comment;
    let amount;
    let proper;
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

    return (
      <div className={"note-info-wrapper" + style}>
        <NoteType note={this.props.note} editing={false} />
      </div>
    );
  }
}
