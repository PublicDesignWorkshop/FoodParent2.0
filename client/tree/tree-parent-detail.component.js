import $ from 'jquery';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';

require('./tree-parent-detail.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { reverseGeocoding } from './../utils/geocoding';
let TreeStore = require('./../stores/tree.store');
let AuthStore = require('./../stores/auth.store');
let TreeActions = require('./../actions/tree.actions');
let PersonActions = require('./../actions/person.actions');
import { isLatLng } from './../utils/validation';
import NoteLine from './../note/note-line.component';
import { NOTETYPE } from './../utils/enum';


export default class TreeParentDetail extends React.Component {
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
    let total;
    let parents = [];
    if (this.props.persons) {
      this.props.persons.forEach((person) => {
        if (person.name.trim() != "") {
          parents.push(<div className="tree-parent-detail-text" key={"parent" + person.id}>{person.name + " (" + person.contact + ")"}</div>);
        } else {
          parents.push(<div className="tree-parent-detail-text" key={"parent" + person.id}>{person.contact}</div>);
        }
      });
    }
    total = <span className="total-parent-icon">{parents.length}</span>;

    return (
      <div className="tree-parent-detail-wrapper">
        <div className="tree-parent-detail-label">
          <FontAwesome className='' name='users' />{localization(984)} {total}
        </div>
        <div className="tree-parent-detail-data">
          {parents}
        </div>
      </div>
    );
  }
}
