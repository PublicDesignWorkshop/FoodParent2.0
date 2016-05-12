import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './user.component.css';
import { fetchUser, processLogout } from './../../utils/authentication';
import { LogInStatus } from './../app.component';
import { treeStore } from './../../stores/tree.store';

export interface IUserProps {
  login: LogInStatus;
  userId: number;
  bOpen: any;
}
export interface IUserStatus {
  name: string;
  contact: string;
  address: string;
  bOpen: boolean;
}
export default class UserComponent extends React.Component<IUserProps, IUserStatus> {
  static contextTypes: any;
  private authentication: string;
  constructor(props : IUserProps) {
    super(props);
    let self: UserComponent = this;
    this.state = {
      name: "",
      contact: "",
      address: "",
      bOpen: false,
    };
  }
  public componentDidMount() {
    let self: UserComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: UserComponent = this;
  }
  public componentWillReceiveProps (nextProps: IUserProps) {
    let self: UserComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: IUserProps) => {
    let self: UserComponent = this;
    if (props.login == LogInStatus.GUEST) {
      self.authentication = "Guest";
    } else if (props.login == LogInStatus.PARENT) {
      self.authentication = "Parent";
    } else if (props.login == LogInStatus.MANAGER) {
      self.authentication = "Manager";
    } else if (props.login == LogInStatus.ADMIN) {
      self.authentication = "Admin";
    }
    fetchUser(props.userId, function(response) {
      self.setState({name: response.name, contact: response.contact, address: response.address, bOpen: self.state.bOpen});
    }, function(response) {

    }, function(response) {

    });
    if (props.bOpen == "true") {
      self.setState({name: self.state.name, contact: self.state.contact, address: self.state.address, bOpen: true});
    } else {
      self.setState({name: self.state.name, contact: self.state.contact, address: self.state.address, bOpen: false});
    }
  }
  private updateAttribute = () => {
    let self: UserComponent = this;
  }

  private submitLogout = () => {
    let self: UserComponent = this;
    processLogout(function(response) { // Lgout success
      console.warn("logout success");
      //self.context.router.push({pathname: window.location.pathname});
      self.context.router.replace({pathname: Settings.uBaseName + '/'});
      treeStore.fetchTrees();
    }, function(response) { // Login fail

    }, function(response) { // Error

    });
  }

  render() {
    let self: UserComponent = this;
    if (self.state.bOpen) {
      return (
        <div className={styles.wrapper + " " + styles.slidein}>
          <div className={styles.userinfo}>
            <div className={styles.icon}>
              <FontAwesome className='' name='user' />
            </div>
            <div className={styles.name}>PARENT INFO</div>
            <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
              self.context.router.goBack();
            }}/></div>
          </div>
          <div className={styles.basicinfo}>
            <div className={styles.contactlabel}>
              <FontAwesome className='' name='at' /> E-mail Address
            </div>
            <div className={styles.contactname}>
              {self.state.contact}
            </div>
            <div className={styles.contactlabel}>
              <FontAwesome className='' name='long-arrow-right' /> Name
            </div>
            <div className={styles.contactname}>
              {self.state.name}
            </div>
            <div className={styles.contactlabel}>
              <FontAwesome className='' name='long-arrow-right' /> Role
            </div>
            <div className={styles.contactname}>
              {self.authentication}
            </div>
            <div className={styles.contactlabel}>
              <FontAwesome className='' name='long-arrow-right' /> Neighborhood
            </div>
            <div className={styles.contactname}>
              {self.state.address}
            </div>
          </div>
          <div className={styles.buttongroup} onClick={()=> {
            self.submitLogout();
          }}>
            <div className={styles.button}>
              SIGN OUT
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
        </div>
      );
    }
  }
}

UserComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
