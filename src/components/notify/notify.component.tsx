import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as moment from 'moment';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './notify.component.css';
var Settings = require('./../../constraints/settings.json');

import { authStore } from './../../stores/auth.store';
import { fetchNotify, notifyToManagers, notifyToParents } from './../../utils/rating';
import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';

export interface INotifyProps {

}
export interface INotifyStatus {
  fetched?: boolean;
  pastpickups?: Array<any>;
  upcomings?: Array<any>;
}

export default class NotifyComponent extends React.Component<INotifyProps, INotifyStatus> {
  static contextTypes: any;
  constructor(props : INotifyProps) {
    super(props);
    let self: NotifyComponent = this;
    self.state = {
      fetched: false,
      pastpickups: new Array<any>(),
      upcomings: new Array<any>(),
    };
  }

  public componentDidMount() {
    let self: NotifyComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: NotifyComponent = this;
  }

  public componentWillReceiveProps (nextProps: INotifyProps) {
    let self: NotifyComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: INotifyProps) => {
    let self: NotifyComponent = this;
    if (authStore.getAuth().getIsManager() && !self.state.fetched) {
      self.setState({fetched: true});
      fetchNotify(function (response) {
        self.setState({pastpickups: response.pastpickups, upcomings: response.upcomings});
      }, function(fail) {

      }, function (error) {

      });
    }
  }

  render() {
    let self: NotifyComponent = this;
    let pastpickups: Array<JSX.Element> = Array<JSX.Element>();
    self.state.pastpickups.forEach(item => {
      pastpickups.push(<div className={styles.item} key={"pastpickups" + item.id}><FontAwesome className='' name='angle-right' />{" " + (parseFloat(item.amount) * Settings.fGToLBS).toFixed(2) + " lbs. of " + item.name + " was picked from "}<span className={styles.inlinebutton}  onClick={()=> {
        self.context.router.push({pathname: Settings.uBaseName + '/tree/' + item.id});
        //self.setState({editable: self.state.editable});
      }}>{"#" + item.id}</span>{"  on "}<span className={styles.highlight}>{ moment(item.date).format(Settings.sUIDateFormat)}</span></div>);
    });
    let currentYear = moment(new Date()).year();
    let upcomings: Array<JSX.Element> = Array<JSX.Element>();
    self.state.upcomings.forEach(item => {
      upcomings.push(<div className={styles.item} key={"upcomings" + item.id}><FontAwesome className='' name='angle-right' />{" " + item.name + " "}<span className={styles.inlinebutton} onClick={()=> {
        self.context.router.push({pathname: Settings.uBaseName + '/tree/' + item.id});
        //self.setState({editable: self.state.editable});
      }}>{"#" + item.id}</span>{" will ripe and ready around "}<span className={styles.highlight}>{moment(item.date).year(currentYear).format(Settings.sUIDateFormat)}</span></div>);
    });
    return(
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <div className={styles.title}>
            NOTIFICATION
          </div>
          <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
            self.context.router.push({pathname: Settings.uBaseName + '/'});
            //self.setState({editable: self.state.editable});
          }}/></div>
        </div>
        <div className={styles.label}>
          <FontAwesome className='' name='shopping-basket' /> Past Pick-ups
        </div>
        <div className={styles.value}>
          {pastpickups}
          <div className={styles.button} onClick={()=> {
            notifyToManagers(function(success) {
              displaySuccessMessage("Notification has sent.");
            }, function(fail) {
              displayErrorMessage("Failed to send a notification to managers.");
            }, function(error) {
              displayErrorMessage("Network Error. Please try again.");
            })
          }}>
            Notify To Managers
          </div>
        </div>
        <div className={styles.label}>
          <FontAwesome className='' name='shopping-bag' /> Upcoming Trees
        </div>
        <div className={styles.value}>
          {upcomings}
          <div className={styles.button} onClick={()=> {
            notifyToParents(function(success) {
              displaySuccessMessage("Notification has sent.");
            }, function(fail) {
              displayErrorMessage("Failed to send a notification to parents.");
            }, function(error) {
              displayErrorMessage("Network Error. Please try again.");
            })
          }}>
            Notify To Parents
          </div>
        </div>
      </div>
    );
  }
}

NotifyComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
