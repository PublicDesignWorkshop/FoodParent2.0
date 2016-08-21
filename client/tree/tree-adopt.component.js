import $ from 'jquery';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';

require('./tree-adopt.component.scss');

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


export default class TreeAdopt extends React.Component {
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
    let actions;
    if (AuthStore.getState().auth.id == 0) {  // Not logged on.
      actions = <div className="solid-button-group">
        <div className="solid-button solid-button-green" onClick={() => {
          this.context.router.push({pathname: ServerSetting.uBase + '/register'});
        }}>
          {localization(987) /* BECEOME A PARENT */}
        </div>
      </div>;
    } else {
      if (AuthStore.getState().auth.id != 0 && this.props.tree && $.inArray(AuthStore.getState().auth.id, this.props.tree.getParents()) != -1) {
        actions = <div className="solid-button-group">
          <div className="solid-button solid-button-red" onClick={() => {
            this.props.tree.removeParent(AuthStore.getState().auth.id);
            TreeActions.updateTree(this.props.tree);
          }}>
            {localization(986) /* UN-ADOPT */}
          </div>
        </div>;
      } else {
        actions = <div className="solid-button-group">
          <div className="solid-button solid-button-green" onClick={() => {
            this.props.tree.addParent(AuthStore.getState().auth.id);
            TreeActions.updateTree(this.props.tree);
          }}>
            {localization(985) /* ADOPT */}
          </div>
        </div>;
      }
    }
    return (
      <div className="tree-adopt-wrapper">
        {actions}
      </div>
    );
  }
}
TreeAdopt.contextTypes = {
    router: React.PropTypes.object.isRequired
}
