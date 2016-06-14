import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as moment from 'moment';
import * as DateTimeField from 'react-bootstrap-datetimepicker';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './donate-date.component.css';
var Settings = require('./../../constraints/settings.json');

import { DonateModel } from './../../stores/donate.store';

import { localization } from './../../constraints/localization';

export interface IDonateDateProps {
  donate: DonateModel;
  editable: boolean;
  async: boolean;
}
export interface IDonateDateStatus {

}

export default class DonateDateComponent extends React.Component<IDonateDateProps, IDonateDateStatus> {
  constructor(props : IDonateDateProps) {
    super(props);
    let self: DonateDateComponent = this;
    this.state = {
      date: moment(new Date()),
    };
  }

  public componentDidMount() {
    let self: DonateDateComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: DonateDateComponent = this;
  }

  public componentWillReceiveProps (nextProps: IDonateDateProps) {
    let self: DonateDateComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IDonateDateProps) {
    let self: DonateDateComponent = this;
  }

  private updateAttribute = (date: moment.Moment) => {
    let self: DonateDateComponent = this;
    self.props.donate.setDate(date);
    console.log(self.props.donate.getFormattedDate());
    if (self.props.async) {
      // noteStore.updateNote(self.props.note);
    }
  }

  render() {
    let self: DonateDateComponent = this;
    if (self.props.editable || self.props.donate.getId() == 0) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onMouseUp={()=> {
            // if (self.props.editable) {
            //   self.setState({editing: true});
            // }
          }}>
            <FontAwesome className='' name='calendar-o' /> {localization(935)}
          </div>
          <div className={styles.edit}>
            <DateTimeField mode="date" dateTime={self.props.donate.getDate().format(Settings.sUIDateFormat)} format={Settings.sUIDateFormat} onChange={(event: any)=> {
              self.updateAttribute(moment(event, Settings.sUIDateFormat));
            }}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='calendar-o' /> {localization(935)}
          </div>
          <div className={styles.edit2}>
            {self.props.donate.getDate().format(Settings.sUIDateFormat)}
          </div>
        </div>
      );
    }
  }
}
