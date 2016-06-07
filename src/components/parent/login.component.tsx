import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as moment from 'moment';

var Settings = require('./../../constraints/settings.json');
import * as styles from './login.component.css';
import { processLogin, checkLogin } from './../../utils/authentication';
import LoginParentComponent from './login-parent.component';
import LoginManagerComponent from './login-manager.component';
import SignUpComponent from './signup.component';
import { PersonModel, personStore } from './../../stores/person.store';
import { AuthModel, authStore } from './../../stores/auth.store';
import { LogInStatus } from './../app.component';

export interface ILogInOption {
  value: number;
  label: string;
}

export interface ILoginProps {
  open: boolean;
}
export interface ILoginStatus {
  options?: Array<ILogInOption>;
  selected?: ILogInOption;
}
export default class LoginComponent extends React.Component<ILoginProps, ILoginStatus> {
  static contextTypes: any;
  constructor(props : ILoginProps) {
    super(props);
    let self: LoginComponent = this;
    let options = new Array<ILogInOption>();
    options.push({value: 0, label: "PARENT SIGN-IN"});
    options.push({value: 1, label: "MANAGER SIGN-IN"});
    this.state = {
      options: options,
      selected: options[0],
    };

  }
  public componentDidMount() {
    let self: LoginComponent = this;
  }
  public componentWillUnmount() {
    let self: LoginComponent = this;
  }
  public componentWillReceiveProps (nextProps: ILoginProps) {
    let self: LoginComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: ILoginProps) => {
    let self: LoginComponent = this;
  }
  private updateAttribute = () => {
    let self: LoginComponent = this;
  }
  private updateChange = (selected) => {
    let self: LoginComponent = this;
    self.setState({selected: selected});
  }

  render() {
    let self: LoginComponent = this;
    if (self.props.open) {
      let login: JSX.Element = <LoginParentComponent />;
      if (self.state.selected.value == 1) {
         login = <LoginManagerComponent />;
      }
      return (
        <div className={styles.full}>
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.siginininfo}>
              <div className={styles.icon}>
                <FontAwesome className='' name='user' />
              </div>
              <Select className={styles.name} name="loginmode-select" multi={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateChange} placeholder="select login mode..." />
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.context.router.goBack();
              }}/></div>
            </div>
            <div className={styles.basicinfo}>
              {login}
            </div>
            <div className={styles.or}>
              OR
            </div>
            <div className={styles.buttongroup} onClick={()=> {
              self.context.router.push({pathname: window.location.pathname, query: { user: 'signup' }});
            }}>
              <div className={styles.button}>
                BECOME A PARENT
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

LoginComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};

// <AltContainer stores={
//   {
//     person: function (props) {
//       return {
//         store: personStore,
//         value: personStore.getPerson(0),
//       };
//     },
//     error: function (props) {
//       return {
//         store: personStore,
//         value: new Array<string>(personStore.getState().errorMessage),
//       };
//     }
//   }
// }>
//   <SignUpComponent person={personStore.getPerson(0)} error={new Array<string>(personStore.getState().errorMessage)} />
// </AltContainer>
