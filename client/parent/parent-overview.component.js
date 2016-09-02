import React from 'react';
import AltContainer from 'alt-container';

require('./parent-overview.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
// import TreeFood from './tree-food.component';
// import TreeLocation from './tree-location.component';
// import TreeAddress from './tree-address.component';
// import TreeDescription from './tree-description.component';

let NoteActions = require('./../actions/note.actions');
let NoteStore = require('./../stores/note.store');
let PersonActions = require('./../actions/person.actions');
let PersonStore = require('./../stores/person.store');
let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let AuthStore = require('./../stores/auth.store');
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';

import ParentNotes from './parent-notes.component';
import ParentAdopts from './parent-adopts.component';

export default class ParentOverview extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    setTimeout(function() {
      NoteActions.fetchNotesFromParentContact.defer(AuthStore.getState().auth.contact);
    }, 100);
    setTimeout(function() {
      TreeActions.fetchTreesFromContact.defer(AuthStore.getState().auth.id);
    }, 200);
    this.setState({editing: false});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {

  }
  render () {
    return (
      <div className="parent-overview-wrapper">
      <div className="parent-overview-title">
        <FontAwesome className="icon" name='heartbeat' />
        <span className="icon-text">
          {localization(1007) /* Parent Info */}
        </span>
      </div>
        <div className="parent-overview-content">
          <AltContainer stores={
            {
              notes: function(props) {
                return {
                  store: NoteStore,
                  value: NoteStore.getState().notes
                }
              }
            }
          }>
            <ParentNotes />
          </AltContainer>
          <AltContainer stores={
            {
              trees: function(props) {
                return {
                  store: TreeStore,
                  value: TreeStore.getState().adopts
                }
              }
            }
          }>
            <ParentAdopts />
          </AltContainer>
        </div>
      </div>
    );
  }
}

ParentOverview.contextTypes = {
    router: React.PropTypes.object.isRequired
}
