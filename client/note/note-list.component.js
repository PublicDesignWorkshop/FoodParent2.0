import React from 'react';
import AltContainer from 'alt-container';

require('./note-list.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import NoteLine from './../note/note-line.component';
import NoteInfo from './../note/note-info.component';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let AuthStore = require('./../stores/auth.store');


export default class NoteList extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {

  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {

  }
  render () {
    let notes = [];
    if (this.props.notes && this.props.notes.length > 0) {
      this.props.notes.forEach((note) => {
        if (this.props.note && note.id == this.props.note.id) {
          notes.push(<NoteInfo key={"note" + note.id} note={this.props.note} />);
        } else {
          notes.push(<NoteLine key={"note" + note.id} note={note} />);
        }
      });
    }
    return (
      <div className="note-list-wrapper">
        {notes}
      </div>
    );
  }
}
