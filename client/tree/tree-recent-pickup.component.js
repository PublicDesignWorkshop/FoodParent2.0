import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';

require('./tree-recent-pickup.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { reverseGeocoding } from './../utils/geocoding';
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');
import { isLatLng } from './../utils/validation';
import NoteLine from './../note/note-line.component';
import { NOTETYPE } from './../utils/enum';


export default class TreeRecentPickup extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.updateProps(this.props);
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    if (props.notes != null && TreeStore.getState().temp != null) {
      let bFound = false;
      props.notes.forEach((note) => {
        if (note.type == NOTETYPE.PICKUP && note.tree == TreeStore.getState().temp.id) {
          bFound = true;
          this.setState({note: note});
        }
      });
      if (!bFound) {
        this.setState({note: null});
      }
    } else {
      this.setState({note: null});
    }
  }
  render () {
    let nopickup;
    if (this.state.note == null) {
      nopickup = <div className="tree-recent-pickup-text-sub">{localization(59)}</div>;
    }
    return (
      <div className="tree-recent-pickup-wrapper">
        <div className="tree-recent-pickup-label">
          <FontAwesome className='' name='shopping-basket' />{localization(61)}
        </div>
        <div className="tree-recent-pickup-data">
          <div className="tree-recent-pickup-text">
            <NoteLine note={this.state.note} link={true} />
            {nopickup}
          </div>
        </div>
      </div>
    );
  }
}
