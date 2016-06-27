import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import TextareaAutosize from 'react-textarea-autosize';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './signup.component.css';
var Settings = require('./../../constraints/settings.json');

import UserContact from './user-contact.component';
import UserName from './user-name.component';
import UserNeighborhood from './user-neighborhood.component';
import MessageLineComponent from './../message/message-line.component';

import { PersonModel, personStore } from './../../stores/person.store';
import { personActions } from './../../actions/person.actions';

import { checkValidEmailAddress } from './../../utils/errorhandler';
import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';
import { localization } from './../../constraints/localization';

export interface ISignUpProps {
  open: boolean;
  person?: PersonModel;
}
export interface ISignUpStatus {
  error?: any;
}

export default class SignUpComponent extends React.Component<ISignUpProps, ISignUpStatus> {
  static contextTypes: any;
  constructor(props : ISignUpProps) {
    super(props);
    let self: SignUpComponent = this;
    self.state = {
      error: null,
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
  }

  private submitSignUp = () => {
    let self: SignUpComponent = this;
    let error: any = null;
    try {
      checkValidEmailAddress(personStore.getTempPerson().getContact().trim());
      personActions.createPerson(personStore.getTempPerson());
    } catch(e) {
      displayErrorMessage(localization(e.message));
      error = e.message;
    }
    self.setState({error: error});
  }

  render() {
    let self: SignUpComponent = this;
    if (self.props.open) {
      let person: PersonModel = personStore.getTempPerson();
      return (
        <div className={styles.full}>
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.siginininfo}>
            <div className={styles.icon}>
              <FontAwesome className='' name='user-plus' />
              </div>
              <div className={styles.name}>
                {localization(987)}
              </div>
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.context.router.goBack();
              }}/></div>
            </div>
            <div className={styles.basicinfo}>
              <UserContact person={person} editable={true} async={false} error={self.state.error} />
              <UserName person={person} editable={true} async={false} error={self.state.error} />
              <UserNeighborhood person={person} editable={true} async={false} error={self.state.error} />
              <div className={styles.buttongroup2} onClick={()=> {
                self.submitSignUp();
              }}>
                <div className={styles.button}>
                  {localization(684)}
                </div>
              </div>

            </div>
            <div className={styles.or}>
              OR
            </div>
            <div className={styles.buttongroup} onClick={()=> {
              self.context.router.push({pathname: window.location.pathname, query: { user: 'login' }});
            }}>
              <div className={styles.button2}>
                {localization(993)}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.full}>
          <div className={styles.wrapper}>
          </div>
        </div>
      );
    }
  }
}

SignUpComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
