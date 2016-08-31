import React from 'react';
import AltContainer from 'alt-container';

require('./tree-history.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import TreeFood from './tree-food.component';
import NoteList from './../note/note-list.component';
import NoteUpdateGraph from './../note/note-update-graph.component';
import NotePickupGraph from './../note/note-pickup-graph.component';
import NoteDonateGraph from './../note/note-donate-graph.component';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let NoteActions = require('./../actions/note.actions');
let NoteStore = require('./../stores/note.store');
let DonateActions = require('./../actions/donate.actions');
let DonateStore = require('./../stores/donate.store');
let AuthStore = require('./../stores/auth.store');


export default class TreeHistory extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateNoteStore = this.updateNoteStore.bind(this);
  }
  componentWillMount() {
    this.updateProps(this.props);
  }
  componentDidMount () {
    NoteStore.listen(this.updateNoteStore);
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    // if (props.tree) {
    //   NoteActions.fetchNotesFromTreeIds.defer(props.tree.id);
    //   DonateActions.fetchDonatesFromTreeId.defer(props.tree.id);
    // }

  }
  componentWillUnmount() {
    NoteStore.unlisten(this.updateNoteStore);
    NoteActions.setSelected(null);
  }
  updateNoteStore() {
    this.forceUpdate();
  }
  render () {
    return (
      <div className="tree-history-wrapper">
        <AltContainer stores={
          {
            tree: function(props) {
              return {
                store: TreeStore,
                value: TreeStore.getState().temp
              }
            }
          }
        }>
          <TreeFood editing={false} />
        </AltContainer>
        <AltContainer stores={
          {
            donates: function(props) {
              return {
                store: DonateStore,
                value: DonateStore.getState().donates
              }
            },
            notes: function(props) {
              return {
                store: NoteStore,
                value: NoteStore.getState().notes
              }
            },
            note: function(props) {
              return {
                store: NoteStore,
                value: NoteStore.getState().temp
              }
            },
          }
        }>
          <NoteUpdateGraph />

          <NoteDonateGraph />
          <NoteList />
        </AltContainer>
      </div>
    );
  }
}

TreeHistory.contextTypes = {
    router: React.PropTypes.object.isRequired
}

// In case of adding a pickup data graph.
// <NotePickupGraph />
