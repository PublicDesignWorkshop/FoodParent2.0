import $ from 'jquery';
import moment from 'moment';
import * as _ from 'underscore';

import { AMOUNTTYPE, NOTETYPE } from './../utils/enum';

let AuthStore = require('./../stores/auth.store');
let ServerSetting = require('./../../setting/server.json');

export class DonateModel {
  constructor(props) {
    this.update(props);
  }
  toJSON() {
    let amount;
    switch(this.amountType) {
      case AMOUNTTYPE.LBS:
        amount = this.amount * ServerSetting.fLBSTOG;
        break;
      case AMOUNTTYPE.KG:
        amount = this.amount * ServerSetting.fKGToG;
        break;
      default:
        amount = this.amount;
        break;
    }
    let type;
    switch(this.type) {
      case NOTETYPE.DONATE:
        type = 4;
        break;
      default:
        type = 4;
        break;
    }
    return {
      id: this.id,
      type: type,
      location: this.location,
      food: this.food,
      tree: this.trees.toString(),
      person: this.person,
      comment: this.comment,
      picture: this.images.toString(),
      amount: amount,
      date: this.date.format(ServerSetting.sServerDateFormat),
    }
  }
  update(props) {
    this.id = parseInt(props.id);
    switch(parseInt(props.type)) {
      case 1:
        this.type = NOTETYPE.CHANGE;
        break;
      case 2:
        this.type = NOTETYPE.UPDATE;
        break;
      case 3:
        this.type = NOTETYPE.PICKUP;
        break;
      case 4:
        this.type = NOTETYPE.DONATE;
        break;
      default:
        this.type = NOTETYPE.DONATE;
        break;
    }
    this.location = props.location;
    this.food = parseInt(props.food);
    if (props.tree && props.tree != "") {
      this.trees = props.tree.split(',').map((treeId) => {
        return parseInt(treeId);
      });
    } else {
      this.trees = [];
    }
    this.person = props.person;
    this.comment = props.comment;
    if (props.picture && props.picture != "") {
      this.images = props.picture.split(',').map((image) => {
        return image;
      });
    } else {
      this.images = [];
    }
    this.amountType = AMOUNTTYPE.LBS;
    this.amount = parseFloat(props.amount) * ServerSetting.fGToLBS;
    this.date = moment(props.date);
    if (!this.date.isValid()) {
      this.date = moment(new Date());
    }
    this.editing = false;
    this.selectmode = false;
  }
  addImage(filename) {
    this.images.push(filename);
  }
  removeImage(filename) {
    this.images = _.without(this.images, filename);
  }
  getFormattedDate() {
    return this.date.format(ServerSetting.sUIDateFormat);
  }
  isEditable() {
    if (AuthStore.getState().auth.isManager())
      return true;
    if (AuthStore.getState().auth.contact != "" && this.person != "" && AuthStore.getState().auth.contact == this.person) {
      return true;
    }
    if ($.inArray(this.id, AuthStore.getState().auth.donates) > -1) {
      return true;
    }
    return false;
  }
  addSource(treeId) {
    if (this.editing && $.inArray(treeId, this.trees) == -1) {
      this.trees.push(treeId);
    }
  }
  removeSource(treeId) {
    this.trees = _.without(this.trees, treeId);
  }
}
