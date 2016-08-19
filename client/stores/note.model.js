import moment from 'moment';
import * as _ from 'underscore';

import { AMOUNTTYPE, NOTETYPE, PICKUPTIME } from './../utils/enum';

let AuthStore = require('./../stores/auth.store');
let ServerSetting = require('./../../setting/server.json');

export class NoteModel {
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
      case NOTETYPE.CHANGE:
        type = 1;
        break;
      case NOTETYPE.UPDATE:
        type = 2;
        break;
      case NOTETYPE.PICKUP:
        type = 3;
        break;
      default:
        type = 2;
        break;
    }
    let proper;
    switch(this.proper) {
      case PICKUPTIME.EARLY:
        proper = 1;
        break;
      case PICKUPTIME.PROPER:
        proper = 2;
        break;
      case PICKUPTIME.LATE:
        proper = 3;
        break;
      default:
        proper = 0;
        break;
    }
    return {
      id: this.id,
      type: type,
      tree: this.tree,
      person: this.person,
      comment: this.comment,
      picture: this.images.toString(),
      rate: this.rate,
      amount: amount,
      proper: proper,
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
    }
    this.tree = parseInt(props.tree);
    this.person = parseInt(props.person);
    this.comment = props.comment;
    this.rate = parseInt(props.rate);
    this.amountType = AMOUNTTYPE.LBS;
    this.amount = parseFloat(props.amount) * ServerSetting.fGToLBS;
    switch(parseInt(props.proper)) {
      case 1:
        this.proper = PICKUPTIME.EARLY;
        break;
      case 2:
        this.proper = PICKUPTIME.PROPER;
        break;
      case 3:
        this.proper = PICKUPTIME.LATE;
        break;
    }
    this.date = moment(props.date);
    if (props.picture && props.picture != "") {
      this.images = props.picture.split(',').map((image) => {
        return image;
      });
    } else {
      this.images = [];
    }
  }
  addImage(filename) {
    this.images.push(filename);
  }
  removeImage(filename) {
    // this.images = $.grep(this.images, function(value) {
    //   return value != filename;
    // });
    this.images = _.without(this.images, filename);
  }
  getFormattedDate() {
    return this.date.format(ServerSetting.sUIDateFormat);
  }
  setCoverImage(filename) {
    let i = this.images.indexOf(filename);
    if (i > -1) {
      this.images.splice(i, 1);
    }
    this.images.unshift(filename);
  }
  isEditable() {
    if (AuthStore.getState().auth.isManager())
      return true;
    if (AuthStore.getState().auth.id != 0 && this.person != 0 && AuthStore.getState().auth.id == this.person) {
      return true;
    }
    return false;
  }
}
