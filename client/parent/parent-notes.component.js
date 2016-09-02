import React from 'react';
import AltContainer from 'alt-container';

require('./parent-notes.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
// import TreeFood from './tree-food.component';
// import TreeLocation from './tree-location.component';
// import TreeAddress from './tree-address.component';
// import TreeDescription from './tree-description.component';

let PersonActions = require('./../actions/person.actions');
let PersonStore = require('./../stores/person.store');
let AuthStore = require('./../stores/auth.store');
import ParentContact from './parent-contact.component';
import ParentName from './parent-name.component';
import ParentAddress from './parent-address.component';
import ParentAuth from './parent-auth.component';
import ParentPassword from './parent-password.component';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
import NoteLine from './../note/note-line.component';


export default class ParentNotes extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({total: 0, since: ""});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    if (props.notes && props.notes.length > 0) {
      this.setState({total: props.notes.length, since: props.notes[props.notes.length-1].date.format(ServerSetting.sUIDateFormat)});
    }

  }
  render () {
    let nopost;
    if (this.props.notes == null || this.props.notes.length == 0) {
      nopost = <div className="parent-recent-post-text-sub">{localization(59)}</div>;
    }
    let notes = [];
    let list = this.props.notes;
    if (list && list.length > 0) {
      list.forEach((note) => {
        notes.push(<NoteLine key={"note" + note.id} note={note} link={true} full={true} />);
      });
    }


    return (
      <div className="parent-notes-wrapper">
        <div className="parent-notes-title">
          <span className="parent-total-text">
            {localization(1009) /* TOTAL */}
          </span>
          &nbsp;
          <span className="parent-total-number">
            {this.state.total}
          </span>
          &nbsp;
          <span className="parent-total-text">
            {localization(1008) /* CONTRIBUTIONS */}
            &nbsp;
            {localization(1010) /* SINCE */}
            &nbsp;
            {this.state.since}
            .
          </span>
        </div>
        <div className="parent-notes-content">
          <div className="parent-recent-post-label">
            <FontAwesome className='' name='pencil-square' />{localization(1011)}
          </div>
          <div className="parent-recent-post-data">
            <div className="parent-recent-post-text">
              {notes}
              {nopost}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ParentNotes.contextTypes = {
    router: React.PropTypes.object.isRequired
}

              // <NoteLine note={this.state.note} link={true} />
