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
import UserName from './user-name.component';
import UserNeighborhood from './user-neighborhood.component';
import { personActions } from './../../actions/person.actions';

export interface ISignUpProps {
  open: boolean;
  person?: PersonModel;
  // error: Array<string>;
}
export interface ISignUpStatus {
  error?: Array<string>;
}
export default class SignUpComponent extends React.Component<ISignUpProps, ISignUpStatus> {
  static contextTypes: any;
  constructor(props : ISignUpProps) {
    super(props);
    let self: SignUpComponent = this;
    self.state = {
      error: new Array<string>(),
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
    // self.setState({error: props.error});
  }

  private onClick = () => {
    let self: SignUpComponent = this;
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
                BECOME A PARENT
              </div>
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.context.router.goBack();
              }}/></div>
            </div>
            <div className={styles.basicinfo}>
              <UserContact person={person} editable={true} async={false} error={self.state.error} />
              <UserName person={person} editable={true} async={false} error={self.state.error} />
              <UserNeighborhood person={person} editable={true} async={false} error={self.state.error} />
              <div className={styles.buttongroup} onClick={()=> {
                personActions.createPerson(personStore.getTempPerson(), "<strong>" + personStore.getTempPerson().getContact() + "</strong> successfully become a parent.", "<strong>" + personStore.getTempPerson().getContact() + "</strong> failed to become a parent.");
              }}>
                <div className={styles.button}>
                  SIGN UP
                </div>
              </div>

            </div>
            <div className={styles.buttongroup} onClick={()=> {
              self.context.router.push({pathname: window.location.pathname, query: { user: 'login' }});
            }}>
              <div className={styles.button2}>
                PARENT IN
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


// <div className={styles.button} onClick={()=> {
//   let error: Array<string> = new Array<string>();
//   let bError: boolean = false;
//   if (self.props.person.getContact().trim() == "") {
//     error.push("e502");
//     bError = true;
//   }
//   if (!bError) {
//     personStore.createPerson(self.props.person);
//   }
//   self.setState({error: error});
// }}>
//   SIGN UP
// </div>
