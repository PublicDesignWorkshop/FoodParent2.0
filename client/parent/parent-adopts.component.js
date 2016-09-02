import React from 'react';
import AltContainer from 'alt-container';

require('./parent-adopts.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
// import TreeFood from './tree-food.component';
// import TreeLocation from './tree-location.component';
// import TreeAddress from './tree-address.component';
// import TreeDescription from './tree-description.component';

let PersonActions = require('./../actions/person.actions');
let PersonStore = require('./../stores/person.store');
let AuthStore = require('./../stores/auth.store');
import ParentContact from './parent-contact.component';
import ParentName from './parent-name.component';
import ParentAddress from './parent-address.component';
import ParentAuth from './parent-auth.component';
import ParentPassword from './parent-password.component';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
let FoodStore = require('./../stores/food.store');


export default class ParentAdopts extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({total: 0});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    if (props.trees && props.trees.length > 0) {
      this.setState({total: props.trees.length});
    }
  }
  render () {
    let seasontrees = [];
    let nonseasontrees = [];
    if (this.props.trees) {
      this.props.trees.forEach((tree) => {
        let food = FoodStore.getFood(tree.food);
        if (food) {
          if (tree.season) {
            seasontrees.push(<span key={"adopted-tree-" + tree.id} className="tag tag-green" onClick={() => {
              this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + tree.id});
            }}>{food.name + " #" + tree.id}</span>);
          } else {
            nonseasontrees.push(<span key={"adopted-tree-" + tree.id} className="tag tag-green" onClick={() => {
              this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + tree.id});
            }}>{food.name + " #" + tree.id}</span>);
          }
        }
      });
    }
    return (
      <div className="parent-adopts-wrapper">
        <div className="parent-adopts-title">
          <span className="parent-total-text">
            {localization(1009) /* TOTAL */}
          </span>
          &nbsp;
          <span className="parent-total-number">
            {this.state.total}
          </span>
          &nbsp;
          <span className="parent-total-text">
            {localization(1012) /* CONTRIBUTIONS */}
          </span>
        </div>
        <div className="parent-adopts-content">
          <div className="parent-adopts-label">
            <FontAwesome className='' name='apple' />{localization(1014)}
          </div>
          {seasontrees}
          <div className="parent-adopts-label">
            <FontAwesome className='' name='leaf' />{localization(1015)}
          </div>
          {nonseasontrees}
        </div>
      </div>
    );
  }
}

ParentAdopts.contextTypes = {
    router: React.PropTypes.object.isRequired
}

              // <NoteLine note={this.state.note} link={true} />
