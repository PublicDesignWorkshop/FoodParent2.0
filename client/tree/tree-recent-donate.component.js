import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import $ from 'jquery';

require('./tree-recent-donate.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { reverseGeocoding } from './../utils/geocoding';
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');
import { isLatLng } from './../utils/validation';
import DonateFromTreeLine from './../donate/donatefromtree-line.component';
import { NOTETYPE } from './../utils/enum';


export default class TreeRecentDonate extends React.Component {
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
    if (props.donates != null && TreeStore.getState().temp != null) {
      let bFound = false;
      props.donates.forEach((donate) => {
        if (donate.type == NOTETYPE.DONATE && $.inArray(TreeStore.getState().temp.id, donate.trees) != -1) {
          bFound = true;
          this.setState({donate: donate});
        }
      });
      if (!bFound) {
        this.setState({donate: null});
      }
    } else {
      this.setState({donate: null});
    }
  }
  render () {
    let nodonate;
    if (this.state.donate == null) {
      nodonate = <div className="tree-recent-donate-text-sub">{localization(57)}</div>;
    }
    return (
      <div className="tree-recent-donate-wrapper">
        <div className="tree-recent-donate-label">
          <FontAwesome className='' name='shopping-bag' />{localization(60)}
        </div>
        <div className="tree-recent-donate-data">
          <div className="tree-recent-donate-text">
            <DonateFromTreeLine donate={this.state.donate} link={true} />
            {nodonate}
          </div>
        </div>
      </div>
    );
  }
}
