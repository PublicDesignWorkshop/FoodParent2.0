import * as React from 'react';
import { render } from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

var Settings = require('./../constraints/settings.json');
import * as styles from './nav.component.css';
import { LogInStatus } from './app.component';
import { geocoding, reverseGeocoding, IReverseGeoLocation } from './../utils/geolocation';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import NavAddressComponent from './nav-address.component';
import { MapModel, mapStore } from './../stores/map.store';
import { PersonModel, personStore } from './../stores/person.store';
import { AuthModel, AuthStatus } from './../stores/auth.store';
import LoginComponent from './parent/login.component';
import UserComponent from './parent/user.component';
import SignUpComponent from './parent/signup.component';
import { authActions } from './../actions/auth.actions';
import { personActions } from './../actions/person.actions';

export interface INavProps {
  auth?: AuthModel;
  query: any;
}
export interface INavStatus {

}
export default class NavComponent extends React.Component<INavProps, INavStatus> {
  static contextTypes: any;
  constructor(props : INavProps) {
    super(props);
    let self: NavComponent = this;
    this.state = {
      address: "",
      editing: false,
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
    console.log(props.query);
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
            <div className={styles.left}>
              <div className={styles.title} onClick={()=> {
                self.context.router.push({pathname: Settings.uBaseName + '/'});
              }}>
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
                <NavAddressComponent mapId="map" />
              </AltContainer>
            </div>
            <div className={styles.right}>
              <div className={styles.login} onClick={()=> {
                if (self.props.query && self.props.query.user == "login") {
                  self.context.router.push({pathname: window.location.pathname});
                } else {
                  self.context.router.push({pathname: window.location.pathname, query: { user: "login" }});
                }
              }}>
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
            <div className={styles.left}>
              <div className={styles.title} onClick={()=> {
                self.context.router.push({pathname: Settings.uBaseName + '/'});
              }}>
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
                <NavAddressComponent mapId="map" />
              </AltContainer>
            </div>
            <div className={styles.right}>
              <div className={styles.login} onClick={()=> {
                if (self.props.query && self.props.query.user && parseInt(self.props.query.user) == self.props.auth.getId()) {
                  self.context.router.push({pathname: window.location.pathname});
                } else {
                  authActions.fetchPerson(self.props.auth.getId());
                  self.context.router.push({pathname: window.location.pathname, query: { user: self.props.auth.getId() }});
                }
              }}>
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
