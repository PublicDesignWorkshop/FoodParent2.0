import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import TextareaAutosize from 'react-textarea-autosize';

var Settings = require('./../../constraints/settings.json');
import * as styles from './message-line.component.css';
import { localization } from './../../constraints/localization';

export enum MessageLineType {
  NONE, ERROR, SUCCESS, WAITING
}
export interface IMessageLineProps {
  code: any;
  match: Array<any>;
}
export interface IMessageLineStatus {
  comment?: string;
  type?: MessageLineType;
}
export default class MessageLineComponent extends React.Component<IMessageLineProps, IMessageLineStatus> {
  private timer: any;
  constructor(props : IMessageLineProps) {
    super(props);
    let self: MessageLineComponent = this;
    this.state = {
      comment: "",
      type: MessageLineType.NONE,
    };
  }
  public componentDidMount() {
    let self: MessageLineComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: MessageLineComponent = this;
  }
  public componentWillReceiveProps (nextProps: IMessageLineProps) {
    let self: MessageLineComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IMessageLineProps) {
    let self: MessageLineComponent = this;
    let type: MessageLineType = MessageLineType.NONE;
    if ($.inArray(props.code, props.match)) {
      if (props.code == 90) self.setState({type: MessageLineType.WAITING, comment: localization(props.code)});
      else if (props.code == 91) self.setState({type: MessageLineType.WAITING, comment: localization(props.code)});
      else if (props.code == 92) self.setState({type: MessageLineType.WAITING, comment: localization(props.code)});
      else if (props.code == 93) self.setState({type: MessageLineType.WAITING, comment: localization(props.code)});

      else if (props.code == 602) self.setState({type: MessageLineType.ERROR, comment: localization(props.code)});
      else if (props.code == 603) self.setState({type: MessageLineType.ERROR, comment: localization(props.code)});

      else self.setState({type: MessageLineType.NONE, comment: ""});
    } else {
      self.setState({type: MessageLineType.NONE, comment: ""});
    }

    if (self.timer) {
      clearInterval(self.timer);
    }
    if (type == MessageLineType.SUCCESS) {
      self.timer = setTimeout(function() {
        self.setState({type: MessageLineType.NONE, comment: ""});
      }, Settings.iMessageLineDuration);
    }
  }

  render() {
    let self: MessageLineComponent = this;
    if (self.state.type == MessageLineType.ERROR) {
      return (
        <div className={styles.error}>
          {self.state.comment}
        </div>
      );
    } else if (self.state.type == MessageLineType.WAITING) {
      return (
        <div className={styles.waiting}>
          {self.state.comment}
        </div>
      );
    } else if (self.state.type == MessageLineType.SUCCESS) {
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
