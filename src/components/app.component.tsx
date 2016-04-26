import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as styles from './app.component.css';
import NavComponent from './nav.component';
import LoaderComponent from './loader.component';
import LoginComponent from './login.component';
import UserComponent from './user.component';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { checkLogin, checkAdmin } from './../utils/authentication';

export enum LogInStatus {
  GUEST, PARENT, MANAGER, ADMIN
}

export interface IAppProps {
  location: any;
}

export interface IAppStatus {
  login: LogInStatus;
  userId: number;
  contact: string;
}

export default class AppComponent extends React.Component<IAppProps, IAppStatus> {
  constructor(props : IAppProps) {
    super(props);
    let self: AppComponent = this;
    this.state = {
      login : LogInStatus.GUEST,
      contact: "",
      userId: null,
    };
  }
  public componentDidMount() {
    let self: AppComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: AppComponent = this;
  }
  public componentWillReceiveProps (nextProps: IAppProps) {
    let self: AppComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: IAppProps) => {
    let self: AppComponent = this;
    addLoading();
    checkLogin(function(response1) { // login
      checkAdmin(function(response2) { // Manager
        removeLoading();
        self.setState({login: LogInStatus.MANAGER, userId: parseInt(response1.id), contact: response1.contact});
      }, function(response) { // Parent
        removeLoading();
        self.setState({login: LogInStatus.PARENT, userId: parseInt(response1.id), contact: response1.contact});
      }, function(response) { // Error
        removeLoading();
      });
    }, function(response) { // Not logged in
      removeLoading();
      self.setState({login: LogInStatus.GUEST, userId: parseInt(response.id), contact: response.contact});
    }, function(response) { // Error
      removeLoading();
    });
  }
  render() {
    let self: AppComponent = this;
    switch(self.state.login) {
      case LogInStatus.GUEST:
        return (
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <NavComponent login={self.state.login} contact={self.state.contact} />
            </div>
            <div className={styles.body}>
              {this.props.children}
            </div>
            <LoaderComponent />
            <LoginComponent bOpen={self.props.location.query.login} />
          </div>
        );
      case LogInStatus.PARENT:
      case LogInStatus.MANAGER:
        return (
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <NavComponent login={self.state.login} contact={self.state.contact} />
            </div>
            <div className={styles.body}>
              {this.props.children}
            </div>
            <LoaderComponent />
            <UserComponent login={self.state.login} bOpen={self.props.location.query.login} userId={self.state.userId} />
          </div>
        );
    }
  }
}
