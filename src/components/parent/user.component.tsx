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
import UserContact from './user-contact.component';
import UserName from './user-name.component';
import UserNeighborhood from './user-neighborhood.component';
import { PersonModel, personStore } from './../../stores/person.store';

export interface IUserProps {
  login: LogInStatus;
  userId: number;
  open: any;
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
    self.updateProps(self.props);
    if (self.props.userId) {
      let ids: Array<number> = new Array<number>();
      ids.push(self.props.userId);
      setTimeout(function () {
        personStore.fetchPersons(ids);
      }, 1);
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
    if (props.login == LogInStatus.GUEST) {
      self.setState({role: "Guest"});
    } else if (props.login == LogInStatus.PARENT) {
      self.setState({role: "Parent"});
    } else if (props.login == LogInStatus.MANAGER) {
      self.setState({role: "Manager"});
    } else if (props.login == LogInStatus.ADMIN) {
      self.setState({role: "Admin"});
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
    if (self.props.open && self.props.userId) {
      let title: string = "";
      if (self.props.login == LogInStatus.GUEST) {
        title = "GUEST INFO";
      } else if (self.props.login == LogInStatus.PARENT) {
        title = "PARENT INFO";
      } else if (self.props.login == LogInStatus.MANAGER) {
        title = "MANAGER INFO";
      } else if (self.props.login == LogInStatus.ADMIN) {
        title = "ADMIN INFO";
      }
      return (
        <div className={styles.wrapper + " " + styles.slidein}>
          <div className={styles.userinfo}>
            <div className={styles.icon}>
              <FontAwesome className='' name='user' />
            </div>
            <div className={styles.name}>
              {title}
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
                    store: personStore,
                    value: personStore.getPerson(self.props.userId),
                  };
                },
                error: function (props) {
                  return {
                    store: personStore,
                    value: new Array<string>(personStore.getState().errorMessage),
                  };
                }
              }
            }>
              <UserContact person={personStore.getPerson(self.props.userId)} editable={self.state.editable} async={self.state.editable} error={self.state.error} />
              <UserName person={personStore.getPerson(self.props.userId)} editable={self.state.editable} async={self.state.editable} error={self.state.error} />
              <div className={styles.contactlabel}>
                <FontAwesome className='' name='long-arrow-right' /> Role
              </div>
              <div className={styles.contactname}>
                {self.state.role}
              </div>
              <UserNeighborhood person={personStore.getPerson(self.props.userId)} editable={self.state.editable} async={self.state.editable} error={self.state.error} />
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
