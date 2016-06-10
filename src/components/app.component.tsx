import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as AltContainer from 'alt-container';

import * as styles from './app.component.css';
import NavComponent from './nav.component';
import LoaderComponent from './message/loader.component';
import { checkLogin, checkAdmin } from './../utils/authentication';
import { authActions } from './../actions/auth.actions';
import { authStore, AuthStatus, AuthModel } from './../stores/auth.store';


export enum LogInStatus {
  NONE, ADMIN, MANAGER, PARENT, GUEST
}

export interface IAppProps {
  location: any;
}

export interface IAppStatus {
  auth?: AuthModel;
  query?: any;

  login?: LogInStatus;
  userId?: number;
  contact?: string;
  address?: string;
}

export default class AppComponent extends React.Component<IAppProps, IAppStatus> {
  // static childContextTypes;
  // getChildContext() {
  //   return {query: this.props.location.query};
  // }
  constructor(props : IAppProps) {
    super(props);
    let self: AppComponent = this;
    this.state = {
      address: "",
      auth: authStore.getAuth(),
      login : LogInStatus.GUEST,
      contact: "",
      userId: null,
    };
  }
  public componentDidMount() {
    let self: AppComponent = this;
    authActions.fetchAuth();
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
    self.setState({query: props.location.query});
  }
  render() {
    let self: AppComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <AltContainer stores={
            {
              auth: function (props) {
                return {
                  store: authStore,
                  value: authStore.getState().auth,
                };
              }
            }
          }>
            <NavComponent query={self.state.query} location={self.props.location} />
          </AltContainer>
        </div>
        <div className={styles.body}>
          {this.props.children}
        </div>
        <LoaderComponent />
      </div>
    );
  }
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //   switch(self.state.login) {
  //     case LogInStatus.GUEST:
  //       return (
  //         <div className={styles.wrapper}>
  //           <div className={styles.header}>
  //             <NavComponent login={self.state.login} contact={self.state.contact} location={self.props.location} />
  //           </div>
  //           <div className={styles.body}>
  //             {this.props.children}
  //           </div>
  //           <LoaderComponent />
  //           <LoginComponent bOpen={self.props.location.query.login} />
  //         </div>
  //       );
  //     case LogInStatus.PARENT:
  //     case LogInStatus.MANAGER:
  //       return (
  //         <div className={styles.wrapper}>
  //           <div className={styles.header}>
  //             <NavComponent login={self.state.login} contact={self.state.contact} location={self.props.location} />
  //           </div>
  //           <div className={styles.body}>
  //             {this.props.children}
  //           </div>
  //           <LoaderComponent />
  //           <UserComponent login={self.state.login} open={self.props.location.query.login} userId={self.state.userId} />
  //         </div>
  //       );
  //   }
  // }
}

// AppComponent.childContextTypes = {
//   query: React.PropTypes.object
// }
