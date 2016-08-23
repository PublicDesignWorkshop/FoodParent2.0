import React from 'react';
import AltContainer from 'alt-container';

require('./donatefromtree-line.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';

let LocationActions = require('./../actions/location.actions');
let LocationStore = require('./../stores/location.store');
let DonateActions = require('./../actions/donate.actions');
let DonateStore = require('./../stores/donate.store');
let AuthStore = require('./../stores/auth.store');
let FoodStore = require('./../stores/food.store');


export default class DonateFromTreeLine extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {

  }
  componentDidMount () {
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {

  }
  render () {
    let style = "";
    let comment;
    let amount;
    let food;
    let dest = [];
    if (this.props.donate) {
      switch(this.props.donate.type) {
        case NOTETYPE.DONATE:
          style = " donate-line-brown";
          // comment = this.props.donate.comment.trim();
          switch(this.props.donate.amountType) {
            case AMOUNTTYPE.LBS:
              amount = "(" + this.props.donate.amount.toFixed(ServerSetting.iAmountPrecision) + " lbs.)";
              break;
            case AMOUNTTYPE.KG:
              amount = "(" + (this.props.donate.amount * ServerSetting.fKGToG * ServerSetting.fGToLBS).toFixed(ServerSetting.iAmountPrecision) + " lbs.)";
              break;
            case AMOUNTTYPE.G:
              amount = "(" + (this.props.donate.amount * ServerSetting.fGToLBS).toFixed(ServerSetting.iAmountPrecision) + " lbs.)";
              break;
          }
        break;
      }
      let temp = FoodStore.getFood(this.props.donate.food);
      if (temp) {
        food = temp.name;
      }
      let location = LocationStore.getLocation(this.props.donate.location);
      if (location) {
        dest = <span className="location-link">{location.name + " #" + location.id}</span>;
      } else {
        dest = <span className="location-link">{localization(40)}</span>;
      }
      return (
        <div className={"donatefromtree-line-wrapper" + style}>
          {this.props.donate.getFormattedDate()}&nbsp;-&nbsp;
          {amount}&nbsp;
          {localization(41)}&nbsp;
          {dest}
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
}
DonateFromTreeLine.contextTypes = {
    router: React.PropTypes.object.isRequired
}
