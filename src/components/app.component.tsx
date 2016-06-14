import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as AltContainer from 'alt-container';

import * as styles from './app.component.css';
import NavComponent from './nav.component';
import LoaderComponent from './message/loader.component';
import { authStore, AuthStatus, AuthModel } from './../stores/auth.store';
import { authActions } from './../actions/auth.actions';

export interface IAppProps {
  location: any;
}
export interface IAppStatus {
  auth?: AuthModel;
  query?: any;
}

export default class AppComponent extends React.Component<IAppProps, IAppStatus> {
  // Code snipet for passing a context to child components
  // static childContextTypes;
  // getChildContext() {
  //   return {query: this.props.location.query};
  // }
  constructor(props : IAppProps) {
    super(props);
    let self: AppComponent = this;
    this.state = {
      auth: authStore.getAuth(),
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
}

// Code snipet for passing a context to child components
// AppComponent.childContextTypes = {
//   query: React.PropTypes.object
// }
