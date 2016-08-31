import $ from 'jquery';
import React from 'react';
import AltContainer from 'alt-container';

require('./notify-list.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import { fetchNotify, notifyToManagers, notifyToParents } from './../utils/notify';
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';



let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let AuthStore = require('./../stores/auth.store');
import NotifyLine from './notify-line.component';
import NotifyLink from './notify-link.component';


export default class NotifyList extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({pastpickups: null, upcomings: null});
  }
  componentDidMount () {
    setTimeout(function() {
      fetchNotify(function (response) {
        this.setState({pastpickups: response.pastpickups, upcomings: response.upcomings});
      }.bind(this), function(fail) {

      }.bind(this), function (error) {

      }.bind(this));
    }.bind(this), 250);
  }
  componentWillReceiveProps(nextProps) {

  }
  render () {
    let pastpickups = [];
    if (this.state.pastpickups) {
      this.state.pastpickups.forEach((item) => {
        pastpickups.push(<NotifyLink key={"notify-pickup-" + item.id} item={item} type={NOTETYPE.PICKUP} />);
      });
    }
    let upcomings = [];
    if (this.state.upcomings) {
      this.state.upcomings.forEach((item) => {
        upcomings.push(<NotifyLine key={"notify-upcoming-" + item.id} item={item} type={NOTETYPE.UPDATE} />);
      });
    }

    // let list;
    // if (this.props.notes && this.props.donates) {
    //   list = this.props.notes.slice();
    //   list.push(...this.props.donates);
    //   list = list.sort(sortNoteByDateDESC);
    // }
    // if (list && list.length > 0) {
    //   list.forEach((note) => {
    //     if (note.type == NOTETYPE.DONATE) {
    //       notes.push(<div id={"donate" + note.id} key={"donate" + note.id}><DonateFromTreeLine donate={note} link={true} /></div>);
    //     } else if (this.props.note && note.id == this.props.note.id) {
    //       notes.push(<div id={"note" + note.id} key={"note" + note.id}><NoteInfo note={this.props.note} /></div>);
    //     } else {
    //       notes.push(<NoteLine key={"note" + note.id} note={note} />);
    //     }
    //   });
    // }
    return (
      <div className="notify-list-wrapper">
        <div className="notify-list-label">
          <FontAwesome className='' name='shopping-basket' /> {localization(34) /* PAST PICKUPS */}
        </div>
        <div className="notify-list-data">
          {pastpickups}
        </div>
        <br />
        <div className="notify-list-label label-brown">
          <FontAwesome className='' name='shopping-bag' /> {localization(33) /* UPCOMING TREES */}
        </div>
        <div className="notify-list-data">
          {upcomings}
        </div>
        <div className="notify-list-action">
          <div className="solid-button-group no-left-right-padding">
            <div className="solid-button solid-button-green" onClick={() => {
              let treeIds = [];
              this.state.upcomings.forEach((item) => {
                if (!item.disabled) {
                  treeIds.push(item.id);
                }
              });
              if (treeIds.length == 0) {
                displayFailMessage(localization(39));
              } else {
                notifyToParents(treeIds.toString(), function(resolve) {
                  displaySuccessMessage(localization(30));
                }, function(reject) {
                  displayFailMessage(localization(28));
                });
              }
            }}>
              {localization(31) /* NOTIFY TO PARENTS */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
