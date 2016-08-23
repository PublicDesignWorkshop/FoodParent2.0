import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';

require('./recipient-recent-donate.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { reverseGeocoding } from './../utils/geocoding';
let LocationStore = require('./../stores/location.store');
let LocationActions = require('./../actions/location.actions');
import { isLatLng } from './../utils/validation';
import DonateLine from './../donate/donate-line.component';
import { NOTETYPE } from './../utils/enum';


export default class RecipientRecentDonate extends React.Component {
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
    if (props.donates != null && LocationStore.getState().temp != null) {
      let bFound = false;
      props.donates.forEach((donate) => {
        if (donate.type == NOTETYPE.DONATE && donate.location == LocationStore.getState().temp.id) {
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
      nodonate = <div className="recipient-recent-donate-text-sub">{localization(57)}</div>;
    }
    return (
      <div className="recipient-recent-donate-wrapper">
        <div className="recipient-recent-donate-label">
          <FontAwesome className='' name='shopping-basket' />{localization(60)}
        </div>
        <div className="recipient-recent-donate-data">
          <div className="recipient-recent-donate-text">
            <DonateLine donate={this.state.donate} link={true} />
            {nodonate}
          </div>
        </div>
      </div>
    );
  }
}
