import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './login.component.css';
import { processLogin, checkLogin } from './../../utils/authentication';
import LoginParentComponent from './login-parent.component';
import LoginManagerComponent from './login-manager.component';

export interface ILogInOption {
  value: number;
  label: string;
}

export interface ILoginProps {
  bOpen: any;
}
export interface ILoginStatus {
  bOpen: boolean;
  bManagerMode: boolean;
}
export default class LoginComponent extends React.Component<ILoginProps, ILoginStatus> {
  private options: Array<ILogInOption>;
  private selected: ILogInOption;
  static contextTypes: any;
  constructor(props : ILoginProps) {
    super(props);
    let self: LoginComponent = this;
    this.state = {
      bOpen: false,
      bManagerMode: false,
    };
  }
  public componentDidMount() {
    let self: LoginComponent = this;
    self.options = new Array<ILogInOption>();
    self.options.push({value: 1, label: "PARENT SIGN-IN"});
    self.options.push({value: 0, label: "MANAGER SIGN-IN"});
    self.selected = self.options[0];

    self.updateProps(self.props);
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
    if (props.bOpen == "true") {
      self.setState({bOpen: true, bManagerMode: self.state.bManagerMode});
    } else {
      self.setState({bOpen: false, bManagerMode: self.state.bManagerMode});
    }
  }
  private updateAttribute = () => {
    let self: LoginComponent = this;
  }
  private updateLoginMode = (selected) => {
    let self: LoginComponent = this;
    if (selected) {
      self.selected = selected;
      if (parseInt(selected.value) == 0) {
        self.setState({bOpen: self.state.bOpen, bManagerMode: true});
      } else {
        self.setState({bOpen: self.state.bOpen, bManagerMode: false});
      }
    }
  }

  render() {
    let self: LoginComponent = this;
    if (self.state.bOpen) {
      if (self.state.bManagerMode) {
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.siginininfo}>
              <div className={styles.icon}>
                <FontAwesome className='' name='user' />
              </div>
              <Select className={styles.name} name="loginmode-select" multi={false} searchable={false} scrollMenuIntoView={false} options={self.options} value={self.selected} onChange={self.updateLoginMode} placeholder="select login mode..." />
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.context.router.goBack();
              }}/></div>
            </div>
            <div className={styles.basicinfo}>
              <LoginManagerComponent />
            </div>
          </div>
        );
      } else {
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.siginininfo}>
              <div className={styles.icon}>
                <FontAwesome className='' name='user' />
              </div>
              <Select className={styles.name} name="loginmode-select" multi={false} searchable={false} scrollMenuIntoView={false} options={self.options} value={self.selected} onChange={self.updateLoginMode} placeholder="select login mode..." />
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.context.router.goBack();
              }}/></div>
            </div>
            <div className={styles.basicinfo}>
              <LoginParentComponent />
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className={styles.wrapper}>
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
