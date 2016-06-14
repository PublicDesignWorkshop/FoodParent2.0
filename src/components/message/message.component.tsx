import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './message.component.css';
var Settings = require('./../../constraints/settings.json');

export interface IMessageProps {

}
export interface IMessageStatus {

}

export default class MessageComponent extends React.Component<IMessageProps, IMessageStatus> {
  constructor(props : IMessageProps) {
    super(props);
    let self: MessageComponent = this;
    this.state = {

    };
  }

  public componentDidMount() {
    let self: MessageComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: MessageComponent = this;
  }

  public componentWillReceiveProps (nextProps: IMessageProps) {
    let self: MessageComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: IMessageProps) => {
    let self: MessageComponent = this;
  }

  render() {
    let self: MessageComponent = this;
    return (
      <div id="message" className={styles.wrapper}>
        <div className={styles.message}>
        </div>
      </div>
    );
  }
}
