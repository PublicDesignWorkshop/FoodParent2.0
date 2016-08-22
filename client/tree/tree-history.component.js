import React from 'react';
import AltContainer from 'alt-container';

require('./tree-history.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import TreeFood from './tree-food.component';
import NoteList from './../note/note-list.component';
import NoteGraph from './../note/note-graph.component';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let NoteActions = require('./../actions/note.actions');
let NoteStore = require('./../stores/note.store');
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
    if (props.tree)
      NoteActions.fetchNotesFromTreeIds.defer(props.tree.id);
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
        <NoteGraph />
        <AltContainer stores={
          {
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
          <NoteList />
        </AltContainer>
      </div>
    );
  }
}

TreeHistory.contextTypes = {
    router: React.PropTypes.object.isRequired
}
