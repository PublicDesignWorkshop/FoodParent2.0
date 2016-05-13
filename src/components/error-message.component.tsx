import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../node_modules/font-awesome/css/font-awesome.css';
import TextareaAutosize from 'react-textarea-autosize';

var Settings = require('./../constraints/settings.json');
import * as styles from './error-message.component.css';

export enum ErrorType {
  NONE, ERROR, SUCCESS, WAITING
}
export interface IErrorMessageProps {
  error?: Array<string>;
  match: Array<string>;
}
export interface IErrorMessageStatus {
  comment?: string;
  type?: ErrorType;
}
export default class ErrorMessageComponent extends React.Component<IErrorMessageProps, IErrorMessageStatus> {
  private timer: any;
  constructor(props : IErrorMessageProps) {
    super(props);
    let self: ErrorMessageComponent = this;
    this.state = {
      comment: "",
      type: ErrorType.NONE,
    };
  }
  public componentDidMount() {
    let self: ErrorMessageComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: ErrorMessageComponent = this;
  }
  public componentWillReceiveProps (nextProps: IErrorMessageProps) {
    let self: ErrorMessageComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IErrorMessageProps) {
    let self: ErrorMessageComponent = this;
    let type: ErrorType = ErrorType.NONE;
    if (props.error.indexOf("e300") > -1 && props.match.indexOf("e300") > -1) {
      type = ErrorType.WAITING;
      self.setState({type: ErrorType.WAITING, comment: Settings.e300});
    } else if (props.error.indexOf("e600") > -1 && props.match.indexOf("e600") > -1) {
      type = ErrorType.SUCCESS;
      self.setState({type: ErrorType.SUCCESS, comment: Settings.e600});
    } else if (props.error.indexOf("e601") > -1 && props.match.indexOf("e601") > -1) {
      type = ErrorType.ERROR;
      self.setState({type: ErrorType.ERROR, comment: Settings.e601});
    } else if (props.error.indexOf("e602") > -1 && props.match.indexOf("e602") > -1) {
      type = ErrorType.ERROR;
      self.setState({type: ErrorType.ERROR, comment: Settings.e602});
    } else {
      type = ErrorType.NONE;
      self.setState({type: ErrorType.NONE, comment: ""});
    }

    if (self.timer) {
      clearInterval(self.timer);
    }
    if (type == ErrorType.SUCCESS) {
      self.timer = setTimeout(function() {
        self.setState({type: ErrorType.NONE, comment: ""});
      }, Settings.iErrorMessageDuration);
    }
  }

  render() {
    let self: ErrorMessageComponent = this;
    if (self.state.type == ErrorType.ERROR) {
      return (
        <div className={styles.error}>
          {self.state.comment}
        </div>
      );
    } else if (self.state.type == ErrorType.WAITING) {
      return (
        <div className={styles.waiting}>
          {self.state.comment}
        </div>
      );
    } else if (self.state.type == ErrorType.SUCCESS) {
      return (
        <div className={styles.success}>
          {self.state.comment}
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}
