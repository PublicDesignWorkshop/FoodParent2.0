import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import TextareaAutosize from 'react-textarea-autosize';

var Settings = require('./../../constraints/settings.json');
import * as styles from './signup.component.css';
import { PersonModel, personStore } from './../../stores/person.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import ErrorMessage from './../error-message.component';
import UserContact from './user-contact.component';

export interface ISignUpProps {
  person: PersonModel;
  error: Array<string>;
}
export interface ISignUpStatus {
  error?: Array<string>;
  open?: boolean;
}
export default class SignUpComponent extends React.Component<ISignUpProps, ISignUpStatus> {
  constructor(props : ISignUpProps) {
    super(props);
    let self: SignUpComponent = this;
    self.state = {
      open: false,
    };
  }
  public componentDidMount() {
    let self: SignUpComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: SignUpComponent = this;
  }
  public componentWillReceiveProps (nextProps: ISignUpProps) {
    let self: SignUpComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: ISignUpProps) {
    let self: SignUpComponent = this;
    self.setState({error: props.error});
  }

  private onClick = () => {
    let self: SignUpComponent = this;
    self.setState({open: true});
  }

  render() {
    let self: SignUpComponent = this;
    if (self.state.open) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <FontAwesome className={styles.icon} name='user-plus' />
            <div className={styles.title}>
              REGISTER NEW PARENT
            </div>
          </div>
          <div className={styles.inner}>
            <UserContact person={self.props.person} editable={true} async={false} error={self.state.error} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.button2} onClick={()=> {
            self.onClick();
          }}>
            BECOME A PARENT
          </div>
        </div>
      );
    }

  }
}
