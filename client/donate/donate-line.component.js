import React from 'react';
import AltContainer from 'alt-container';

require('./donate-line.component.scss');
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


export default class DonateLine extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.selectDonate = this.selectDonate.bind(this);
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
  selectDonate() {
    DonateActions.setSelected(this.props.donate.id);
    if (this.props.link) {
      this.context.router.push({pathname: ServerSetting.uBase + '/recipient/' + LocationStore.getState().selected, hash: "#history"});
    }
  }
  render () {
    let style = "";
    let comment;
    let amount;
    let food;
    let source = [];
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
      if (this.props.donate.trees) {
        this.props.donate.trees.forEach((tree) => {
          source.push(<span className="tree-link" key={"treesource" + tree}>{"#" + tree}</span>)
        });
      }
      return (
        <div className={"donate-line-wrapper" + style} onClick={this.selectDonate}>
          {this.props.donate.getFormattedDate()}&nbsp;-&nbsp;
          {amount}&nbsp;
          {localization(49)}&nbsp;
          {food}&nbsp;
          {source}&nbsp;
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
}
DonateLine.contextTypes = {
    router: React.PropTypes.object.isRequired
}
