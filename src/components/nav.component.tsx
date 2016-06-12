import * as React from 'react';
import { render } from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';
import * as FontAwesome from 'react-fontawesome';
import './../../node_modules/font-awesome/css/font-awesome.css';

var Settings = require('./../constraints/settings.json');
import * as styles from './nav.component.css';
import { LogInStatus } from './app.component';
import NavAddressComponent from './nav-address.component';
import { MapModel, mapStore } from './../stores/map.store';
import { personStore } from './../stores/person.store';
import { AuthModel, AuthStatus } from './../stores/auth.store';
import LoginComponent from './parent/login.component';
import UserComponent from './parent/user.component';
import SignUpComponent from './parent/signup.component';
import { authActions } from './../actions/auth.actions';
import { personActions } from './../actions/person.actions';

export interface INavProps {
  location: any;
  auth?: AuthModel;
  query: any;
}
export interface INavStatus {
  mapId?: string;
}
export default class NavComponent extends React.Component<INavProps, INavStatus> {
  static contextTypes: any;
  constructor(props : INavProps) {
    super(props);
    let self: NavComponent = this;
    this.state = {
      mapId: "map",
    };
  }
  public componentDidMount() {
    let self: NavComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: NavComponent = this;
  }
  public componentWillReceiveProps (nextProps: INavProps) {
    let self: NavComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: INavProps) => {
    let self: NavComponent = this;
    if (props.location.pathname.indexOf(Settings.uBaseName + "/donation") > -1) {
      self.setState({mapId: "map-donation"});
    } else {
      self.setState({mapId: "map"});
    }
  }

  render() {
    let self: NavComponent = this;
    switch(self.props.auth.getAuth()) {
      case AuthStatus.NONE:
      case AuthStatus.GUEST:
        let login: JSX.Element;
        if (self.props.query && self.props.query.user == "login") {
          login = <LoginComponent open={true} />;
        } else if (self.props.query && self.props.query.user == "signup") {
          login = <SignUpComponent open={true} />;
        }
        return (
          <div className={styles.wrapper}>
            <div className={styles.left} onClick={()=> {
              self.context.router.push({pathname: Settings.uBaseName + '/'});
            }}>
              <div className={styles.title}>
                FoodParent
              </div>
              <div className={styles.logo}></div>
            </div>
            <div className={styles.center}>
              <AltContainer stores={
                {
                  maps: mapStore
                }
              }>
                <NavAddressComponent mapId={self.state.mapId} />
              </AltContainer>
            </div>
            <div className={styles.right} onClick={()=> {
              if (self.props.query && self.props.query.user == "login") {
                self.context.router.push({pathname: window.location.pathname});
              } else {
                self.context.router.push({pathname: window.location.pathname, query: { user: "login" }});
              }
            }}>
              <FontAwesome className={styles.icon}  name='user' />
              <div className={styles.login}>
                PARENT IN
              </div>
            </div>
            {login}
          </div>
        );
      case AuthStatus.PARENT:
      case AuthStatus.MANAGER:
      case AuthStatus.ADMIN:
        let user: JSX.Element;
        if (self.props.query && self.props.query.user && parseInt(self.props.query.user) == self.props.auth.getId()) {
          user = <UserComponent open={true} userId={self.props.auth.getId()} />;
        }
        return (
          <div className={styles.wrapper}>
            <div className={styles.left} onClick={()=> {
              self.context.router.push({pathname: Settings.uBaseName + '/'});
            }}>
              <div className={styles.title}>
                FoodParent
              </div>
              <div className={styles.logo}></div>
            </div>
            <div className={styles.center}>
              <AltContainer stores={
                {
                  maps: mapStore
                }
              }>
                <NavAddressComponent mapId={self.state.mapId} />
              </AltContainer>
            </div>
            <div className={styles.right} onClick={()=> {
              if (self.props.query && self.props.query.user && parseInt(self.props.query.user) == self.props.auth.getId()) {
                self.context.router.push({pathname: window.location.pathname});
              } else {
                authActions.fetchPerson(self.props.auth.getId());
                self.context.router.push({pathname: window.location.pathname, query: { user: self.props.auth.getId() }});
              }
            }}>
              <FontAwesome className={styles.icon}  name='user'/>
              <div className={styles.login}>
                {self.props.auth.getContact()}
              </div>
            </div>
            {user}
          </div>
        );
    }
  }



    //
    //
    //
    //
    // switch(self.props.login) {
    //   case LogInStatus.GUEST:
    //     return (
    //       <div className={styles.wrapper}>
    //         <div className={styles.left}>
    //           <div className={styles.title} onClick={()=> {
    //             self.context.router.push({pathname: Settings.uBaseName + '/'});
    //           }}>
    //             FoodParent
    //           </div>
    //           <div className={styles.logo}></div>
    //         </div>
    //         <div className={styles.center}>
    //           <AltContainer stores={
    //             {
    //               maps: mapStore
    //             }
    //           }>
    //             <NavAddressComponent mapId="map" />
    //           </AltContainer>
    //         </div>
    //         <div className={styles.right}>
    //           <div className={styles.login} onClick={()=> {
    //             self.context.router.push({pathname: window.location.pathname, query: { login: true }});
    //           }}>
    //             PARENT IN
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   case LogInStatus.PARENT:
    //   case LogInStatus.MANAGER:
    //     return (
    //       <div className={styles.wrapper}>
    //         <div className={styles.left}>
    //           <div className={styles.title} onClick={()=> {
    //             self.context.router.push({pathname: Settings.uBaseName + '/'});
    //           }}>
    //             FoodParent
    //           </div>
    //           <div className={styles.logo}></div>
    //         </div>
    //         <div className={styles.center}>
    //           <AltContainer stores={
    //             {
    //               maps: mapStore
    //             }
    //           }>
    //             <NavAddressComponent mapId="map" />
    //           </AltContainer>
    //         </div>
    //         <div className={styles.right}>
    //           <div className={styles.login} onClick={()=> {
    //             self.context.router.push({pathname: window.location.pathname, query: { login: true }});
    //           }}>
    //             {self.props.contact}
    //           </div>
    //         </div>
    //       </div>
    //     );
    // }
  // }
}

NavComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
