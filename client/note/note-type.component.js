import React from 'react';
import AltContainer from 'alt-container';

require('./note-type.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let NoteActions = require('./../actions/note.actions');
let NoteStore = require('./../stores/note.store');
let AuthStore = require('./../stores/auth.store');


export default class NoteType extends React.Component {
  constructor(props, context) {
    super(props, context);
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

  }
  updateAttribute(type) {
    if (this.props.editing) {
      if (this.props.note.type != type) {
        NoteActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
      }
      this.props.note.type = type;
    }
  }
  render () {
    let actions;
    let style = "";
    let disabled = "";
    if (!this.props.editing) {
      style = " no-pointer";
      disabled = " disabled";
    }
    switch(this.props.note.type) {
      case NOTETYPE.UPDATE:
        actions = <div className="solid-button-group">
          <div className={"solid-button solid-button-green active" + style}>
            {localization(74)}
          </div>
          <div className={"solid-button solid-button-green" + style + disabled} onClick={() => {
            this.updateAttribute(NOTETYPE.PICKUP)
          }}>
            {localization(75)}
          </div>
        </div>;
        break;
      case NOTETYPE.PICKUP:
        actions = <div className="solid-button-group">
          <div className={"solid-button solid-button-brown" + style + disabled} onClick={() => {
            this.updateAttribute(NOTETYPE.UPDATE)
          }}>
            {localization(74)}
          </div>
          <div className={"solid-button solid-button-brown active" + style}>
            {localization(75)}
          </div>
        </div>;
        break;
    }
    return (
      <div>
        <div className="note-type-data">
          {actions}
        </div>
      </div>
    );
  }
}
