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
let FoodActions = require('./../actions/food.actions');
let FoodStore = require('./../stores/food.store');
let AuthStore = require('./../stores/auth.store');
let TreeActions = require('./../actions/tree.actions');
let PersonActions = require('./../actions/person.actions');
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
    let food, actions, message, manageractions;
    if (TreeStore.getState().temp) {
      food = FoodStore.getFood(TreeStore.getState().temp.food);
    }
    if (food && food.adopt) {
      if (AuthStore.getState().auth.isManager()) {
        manageractions = <div className="solid-button-group">
          <div className="solid-button solid-button-green" onClick={() => {
            food.adopt = false;
            FoodActions.updateFood(food);
          }}>
            {localization(625) /* Currnetly Adoptable  (Click to change) */}
          </div>
        </div>;
      }
    } else if (food && !food.adopt) {
      if (AuthStore.getState().auth.isManager()) {
        manageractions = <div className="solid-button-group">
          <div className="solid-button solid-button-green" onClick={() => {
            food.adopt = true;
            FoodActions.updateFood(food);
          }}>
            {localization(624) /* Currnetly Unadoptable  (Click to change) */}
          </div>
        </div>;
      } else {
        message = <div className="message">{localization(626)}</div>;
      }
    }
    if (AuthStore.getState().auth.id == 0) {  // Not logged on.
      if (food && food.adopt) {
        actions = <div className="solid-button-group">
          <div className="solid-button solid-button-green" onClick={() => {
            this.context.router.push({pathname: ServerSetting.uBase + '/register'});
          }}>
            {localization(987) /* BECEOME A PARENT */}
          </div>
        </div>;
      }
    } else {
      if (AuthStore.getState().auth.id != 0 && this.props.tree && $.inArray(AuthStore.getState().auth.id, this.props.tree.getParents()) != -1) {
        actions = <div className="solid-button-group">
          <div className="solid-button solid-button-red" onClick={() => {
            this.props.tree.removeParent(AuthStore.getState().auth.id);
            TreeActions.updateTree(this.props.tree);
            let tree = TreeStore.getState().temp;
            if (AuthStore.getState().auth.isManager() && tree) {
              let parents = tree.getParents();
              if (parents) {
                PersonActions.fetchPersons.defer(parents);
              }
            }
          }}>
            {localization(986) /* UN-ADOPT */}
          </div>
        </div>;
      } else {
        if (food && food.adopt) {
          actions = <div className="solid-button-group">
            <div className="solid-button solid-button-green" onClick={() => {
              this.props.tree.addParent(AuthStore.getState().auth.id);
              TreeActions.updateTree(this.props.tree);
              let tree = TreeStore.getState().temp;
              if (AuthStore.getState().auth.isManager() && tree) {
                let parents = tree.getParents();
                if (parents) {
                  PersonActions.fetchPersons.defer(parents);
                }
              }
            }}>
              {localization(985) /* ADOPT */}
            </div>
          </div>;
        }
      }
    }
    return (
      <div className="tree-adopt-wrapper">
        {manageractions}
        {actions}
        {message}
      </div>
    );
  }
}
TreeAdopt.contextTypes = {
    router: React.PropTypes.object.isRequired
}
