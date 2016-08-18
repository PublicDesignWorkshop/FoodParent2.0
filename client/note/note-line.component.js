import React from 'react';
import AltContainer from 'alt-container';

require('./note-line.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let NoteActions = require('./../actions/note.actions');
let NoteStore = require('./../stores/note.store');
let AuthStore = require('./../stores/auth.store');


export default class NoteLine extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.selectNote = this.selectNote.bind(this);
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
  selectNote() {
    NoteActions.setSelected(this.props.note.id);
  }
  render () {
    let style = "";
    let stars = [];
    let comment;
    let amount;
    let proper;
    switch(this.props.note.type) {
      case NOTETYPE.CHANGE:
        style = " note-line-light";
        break;
      case NOTETYPE.UPDATE:
        style = " note-line-green";
        if (this.props.note.rate == 0) {
          stars.push(<FontAwesome key={"star 0"} className='' name='star-o' />);
        } else {
          for (let i=0; i<5; i++) {
            if (i < this.props.note.rate) {
              stars.push(<FontAwesome key={"star" + i} className='' name='star' />);
            }
          }
        }
        stars = <span className="tag tag-green">{stars}</span>;
        comment = this.props.note.comment.trim();
        break;
      case NOTETYPE.PICKUP:
        style = " note-line-brown";
        comment = this.props.note.comment.trim();
        switch(this.props.note.amountType) {
          case AMOUNTTYPE.LBS:
            amount = "(" + this.props.note.amount.toFixed(ServerSetting.iAmountPrecision) + " lbs.)";
            break;
          case AMOUNTTYPE.KG:
            amount = "(" + (this.props.note.amount * ServerSetting.fKGToG * ServerSetting.fGToLBS).toFixed(ServerSetting.iAmountPrecision) + " lbs.)";
            break;
          case AMOUNTTYPE.G:
            amount = "(" + (this.props.note.amount * ServerSetting.fGToLBS).toFixed(ServerSetting.iAmountPrecision) + " lbs.)";
            break;
        }
        switch(this.props.note.proper) {
          case PICKUPTIME.EARLY:
            proper = <span className="tag tag-brown">{localization(988)}</span>;
            break;
          case PICKUPTIME.PROPER:
            proper = <span className="tag tag-brown">{localization(989)}</span>;
            break;
          case PICKUPTIME.LATE:
            proper = <span className="tag tag-brown">{localization(990)}</span>;
            break;
        }
      break;
    }

    return (
      <div className={"note-line-wrapper" + style} onClick={this.selectNote}>
        {this.props.note.getFormattedDate()}&nbsp;-&nbsp;
        {comment}&nbsp;
        {stars}{amount}&nbsp;
        {proper}
      </div>
    );
  }
}
