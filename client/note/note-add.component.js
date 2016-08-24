import React from 'react';
import AltContainer from 'alt-container';

require('./note-add.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import TreeFood from './../tree/tree-food.component';
import NoteInfo from './../note/note-info.component';


let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let NoteActions = require('./../actions/note.actions');
let NoteStore = require('./../stores/note.store');
let AuthStore = require('./../stores/auth.store');


export default class NoteAdd extends React.Component {
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
    if (props.tree && (NoteStore.getState().temp == null || NoteStore.getState().temp.id != 0)) {
      NoteActions.createTempNote.defer(TreeStore.getState().temp.id);
    }
  }
  componentWillUnmount() {
    NoteStore.unlisten(this.updateNoteStore);
    // NoteActions.setSelected(null);
  }
  updateNoteStore() {
    this.forceUpdate();
  }
  render () {
    return (
      <div className="note-add-wrapper">
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
            note: function(props) {
              return {
                store: NoteStore,
                value: NoteStore.getState().temp
              }
            },
          }
        }>
          <NoteInfo editing={true} />
        </AltContainer>
      </div>
    );
  }
}
