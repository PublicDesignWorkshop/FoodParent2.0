import React from 'react';
import AltContainer from 'alt-container';

require('./note-list.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import NoteLine from './../note/note-line.component';

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
    this.props.notes.forEach((note) => {
      notes.push(<NoteLine key={"note" + note.id} note={note} />);
    });
    return (
      <div className="note-list-wrapper">
        {notes}
      </div>
    );
  }
}
