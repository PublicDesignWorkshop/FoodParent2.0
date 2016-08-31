import $ from 'jquery';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';

require('./tree-parent-summary.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { reverseGeocoding } from './../utils/geocoding';
let TreeStore = require('./../stores/tree.store');
let AuthStore = require('./../stores/auth.store');
let TreeActions = require('./../actions/tree.actions');
import { isLatLng } from './../utils/validation';
import NoteLine from './../note/note-line.component';
import { NOTETYPE } from './../utils/enum';


export default class TreeParentSummary extends React.Component {
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

  }
  render () {
    let overview;
    if (this.props.tree) {
      let parents = this.props.tree.getParents();
      if (parents != null && parents.length > 0) {
        if (parents.length == 1) {
          if (AuthStore.getState().auth.id != 0 && this.props.tree && $.inArray(AuthStore.getState().auth.id, this.props.tree.getParents()) != -1) {  // You are the only person who adopted this tree.
            overview = <div className="tree-parent-summary-text">{localization(56)}</div>;
          } else {
            overview = <div className="tree-parent-summary-text">{parents.length + " " + localization(982)}</div>;
          }
        } else {
          if (AuthStore.getState().auth.id != 0 && this.props.tree && $.inArray(AuthStore.getState().auth.id, this.props.tree.getParents()) != -1) {
            if ((parents.length - 1) == 1) {
              overview = <div className="tree-parent-summary-text">{localization(55) + " " + (parents.length - 1) + " " + localization(21)}</div>;
            } else {
              overview = <div className="tree-parent-summary-text">{localization(55) + " " + (parents.length - 1) + " " + localization(983)}</div>;
            }
          } else {
            overview = <div className="tree-parent-summary-text">{parents.length + " " + localization(983)}</div>;
          }

        }
      } else {
        overview = <div className="tree-parent-summary-text">{localization(981)}</div>;
      }
    }

    return (
      <div className="tree-parent-summary-wrapper">
        <div className="tree-parent-summary-label">
          <FontAwesome className='' name='users' />{localization(984)}
        </div>
        <div className="tree-parent-summary-data">
          {overview}
        </div>
      </div>
    );
  }
}
