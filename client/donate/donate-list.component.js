import $ from 'jquery';
import React from 'react';
import AltContainer from 'alt-container';

require('./donate-list.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import DonateLine from './../donate/donate-line.component';
import DonateInfo from './../donate/donate-info.component';
import { sortNoteByDateDESC } from './../utils/sort';


export default class DonateList extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {

  }
  componentDidMount () {
    // Scroll to the top postion of selected donate.
    setTimeout(function() {
      if (this.props.donate && this.props.donate.id != 0) {
        $('.donate-history-wrapper').animate({ scrollTop: $('#donate' + this.props.donate.id).offset().top - 96 }, 0);
      }
    }.bind(this), 250);
  }
  componentWillReceiveProps(nextProps) {

  }
  render () {
    let donates = [];
    if (this.props.donates && this.props.donates.length > 0) {
      let list = this.props.donates.sort(sortNoteByDateDESC);
      list.forEach((donate) => {
        if (this.props.donate && donate.id == this.props.donate.id) {
          donates.push(<div id={"donate" + donate.id} key={"donate" + donate.id}><DonateInfo donate={this.props.donate} /></div>);
        } else {
          donates.push(<DonateLine key={"donate" + donate.id} donate={donate} />);
        }
      });
    }
    return (
      <div className="donate-list-wrapper">
        {donates}
      </div>
    );
  }
}
