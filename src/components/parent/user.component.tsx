import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as styles from './user.component.css';
var Settings = require('./../../constraints/settings.json');

import UserContactComponent from './user-contact.component';
import UserNameComponent from './user-name.component';
import UserRoleComponent from './user-role.component';
import UserNeighborhood from './user-neighborhood.component';

import { processLogout } from './../../utils/authentication';
import { treeStore } from './../../stores/tree.store';
import { personStore } from './../../stores/person.store';
import { AuthModel, authStore } from './../../stores/auth.store';
import { authActions } from './../../actions/auth.actions';

import { localization } from './../../constraints/localization';

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
                {localization(676)}
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
                {localization(677)}
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
