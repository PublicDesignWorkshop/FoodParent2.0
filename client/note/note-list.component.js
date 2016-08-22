import $ from 'jquery';
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
    setTimeout(function() {
      if (this.props.note && this.props.note.id != 0) {
        console.log("1");
        $('.tree-history-wrapper').animate({ scrollTop: $('#note' + this.props.note.id).offset().top - 96 }, 0);
      }
    }.bind(this), 250);
  }
  componentWillReceiveProps(nextProps) {

  }
  render () {
    let notes = [];
    if (this.props.notes && this.props.notes.length > 0) {
      this.props.notes.forEach((note) => {
        if (this.props.note && note.id == this.props.note.id) {
          notes.push(<div id={"note" + note.id} key={"note" + note.id}><NoteInfo note={this.props.note} /></div>);
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
