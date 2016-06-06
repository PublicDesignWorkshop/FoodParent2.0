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
import UserContactComponent from './user-contact.component';
import UserNameComponent from './user-name.component';
import UserRoleComponent from './user-role.component';
import UserNeighborhood from './user-neighborhood.component';
import { PersonModel, personStore } from './../../stores/person.store';
import { personActions } from './../../actions/person.actions';
import { authActions } from './../../actions/auth.actions';
import { AuthModel, authStore } from './../../stores/auth.store';

export interface IUserProps {
  open: any;
  userId?: number;
}
export interface IUserStatus {
  role?: string;
  error?: Array<string>;
  editable?: boolean;
}
export default class UserComponent extends React.Component<IUserProps, IUserStatus> {
  static contextTypes: any;
  constructor(props : IUserProps) {
    super(props);
    let self: UserComponent = this;
    this.state = {
      error: new Array<string>(),
      editable: false,
    };
  }
  public componentDidMount() {
    let self: UserComponent = this;
    if (self.props.userId) {
      authActions.fetchPerson(self.props.userId);
    }
    // if (self.props.userId) {
    //   let ids: Array<number> = new Array<number>();
    //   ids.push(self.props.userId);
    //   setTimeout(function () {
    //     personStore.fetchPersons(ids);
    //   }, 1);
    // }
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
  }
  private updateAttribute = () => {
    let self: UserComponent = this;
  }

  private submitLogout = () => {
    let self: UserComponent = this;
    authActions.processLogout();
    // processLogout(function(response) { // Lgout success
    //   //self.context.router.push({pathname: window.location.pathname});
    //   self.context.router.replace({pathname: Settings.uBaseName + '/'});
    //   // treeStore.fetchTrees();
    // }, function(response) { // Login fail
    //
    // }, function(response) { // Error
    //
    // });
  }

  render() {
    let self: UserComponent = this;
    if (self.props.open && self.props.userId) {
      let title: string = "";
      return (
        <div className={styles.full}>
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.userinfo}>
              <div className={styles.icon}>
                <FontAwesome className='' name='user' />
              </div>
              <div className={styles.name}>
                PARENT INFO
              </div>
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.context.router.goBack();
              }}/></div>
            </div>
            <div className={styles.basicinfo}>
              <AltContainer stores={
                {
                  person: function (props) {
                    return {
                      store: authStore,
                      value: authStore.getState().person,
                    };
                  },
                  error: function (props) {
                    return {
                      store: authStore,
                      value: new Array<string>(authStore.getState().errorMessage),
                    };
                  }
                }
              }>
                <UserContactComponent editable={self.state.editable} async={self.state.editable} error={self.state.error} />
                <UserNameComponent editable={self.state.editable} async={self.state.editable} error={self.state.error} />
                <UserRoleComponent editable={self.state.editable} async={self.state.editable} error={self.state.error} />
                <UserNeighborhood editable={self.state.editable} async={self.state.editable} error={self.state.error} />
              </AltContainer>
            </div>
            <div className={styles.buttongroup} onClick={()=> {
              self.submitLogout();
            }}>
              <div className={styles.button}>
                SIGN OUT
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

UserComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
