import $ from 'jquery';
import React from 'react';
import AltContainer from 'alt-container';

require('./note-list.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import NoteLine from './../note/note-line.component';
import DonateFromTreeLine from './../donate/donatefromtree-line.component';
import NoteInfo from './../note/note-info.component';
import { NOTETYPE } from './../utils/enum';
import { sortNoteByDateDESC } from './../utils/sort';


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
        $('.tree-history-wrapper').animate({ scrollTop: $('#note' + this.props.note.id).offset().top - 96 }, 0);
      }
    }.bind(this), 250);
  }
  componentWillReceiveProps(nextProps) {

  }
  render () {
    let notes = [];
    let list;
    if (this.props.notes && this.props.donates) {
      list = this.props.notes.slice();
      list.push(...this.props.donates);
      list = list.sort(sortNoteByDateDESC);
    }
    if (list && list.length > 0) {
      list.forEach((note) => {
        if (note.type == NOTETYPE.DONATE) {
          notes.push(<div id={"donate" + note.id} key={"donate" + note.id}><DonateFromTreeLine donate={note} link={true} /></div>);
        } else if (this.props.note && note.id == this.props.note.id) {
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
