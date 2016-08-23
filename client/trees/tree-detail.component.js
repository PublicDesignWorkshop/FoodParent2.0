import React from 'react';
import AltContainer from 'alt-container';

require('./tree-detail.component.scss');

let MapStore = require('./../stores/map.store');
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');
let FoodActions = require('./../actions/food.actions');
let NoteActions = require('./../actions/note.actions');
let DonateActions = require('./../actions/donate.actions');
import { TREEDETAILMODE } from './../utils/enum';
import { localization } from './../utils/localization';

import MapTree from './../maps/map-tree.component';
import TreePanel from './tree-panel.component';

export default class TreeDetail extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateNoteStore = this.updateNoteStore.bind(this);
  }
  componentWillMount() {
    this.updateProps(this.props);
  }
  componentDidMount () {
    TreeStore.listen(this.updateNoteStore);
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  componentWillUnmount() {
    TreeStore.unlisten(this.updateNoteStore);
  }
  updateNoteStore() {
    this.forceUpdate();
  }
  updateProps(props) {
    let mode;
    let remove = false;
    TreeActions.fetchTree.defer(parseInt(props.params.treeId));
    // Instead of changing url, change # hashtag to remove extra rendering process.
    switch(props.location.hash.replace('#', '')) {
      case "":
        mode = TREEDETAILMODE.INFO;
        NoteActions.fetchRecentNotesFromTreeId.defer(parseInt(props.params.treeId));
        DonateActions.fetchRecentDonatesFromTreeId.defer(parseInt(props.params.treeId));
        break;
      case "post":
        mode = TREEDETAILMODE.POST;
        break;
      case "parent":
        mode = TREEDETAILMODE.PARENT;
        break;
      case "history":
        mode = TREEDETAILMODE.HISTORY;
        NoteActions.fetchNotesFromTreeIds.defer(parseInt(props.params.treeId));
        DonateActions.fetchDonatesFromTreeId.defer(parseInt(props.params.treeId));
        break;
      case "all":
        mode = TREEDETAILMODE.ALL;
        break;
      case "delete":
        remove = true;
        mode = TREEDETAILMODE.INFO;
        break;
      default:
        mode = TREEDETAILMODE.INFO;
        break;
    }
    this.setState({mode: mode, remove: remove});
    // TreeActions.setSelected(parseInt(props.params.treeId));
  }
  render () {
    let action;
    if (this.state.remove) {
      action = <div className="popup-wrapper popup-red open">
        <div className="popup-message">
          <span dangerouslySetInnerHTML={{__html: localization(636)}} />
          <span className="popup-button" onClick={()=> {
            TreeActions.deleteTree(TreeStore.getState().temp);
          }}>
            {localization(931)}
          </span>
          <span className="popup-button" onClick={()=> {
            this.context.router.push({pathname: window.location.pathname});
          }}>
            {localization(933)}
          </span>
        </div>
      </div>;
    }
    let open = false;
    if (TreeStore.getState().temp != null) {
      open = true;
    }
    return (
      <div className="tree-map-wrapper">
        <AltContainer stores={
          {
            location: function(props) {
              return {
                store: MapStore,
                value: MapStore.getState().location
              };
            },
            trees: function(props) {
              return {
                store: TreeStore,
                value: TreeStore.getState().trees
              }
            },
            selected: function(props) {
              return {
                store: TreeStore,
                value: TreeStore.getState().selected
              }
            }
          }
        }>
          <MapTree />
        </AltContainer>
        <TreePanel open={open} mode={this.state.mode} />
        {action}
      </div>
    );
  }
}
TreeDetail.contextTypes = {
    router: React.PropTypes.object.isRequired
}
