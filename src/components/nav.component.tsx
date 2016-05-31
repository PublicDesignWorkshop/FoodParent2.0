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

export interface INavProps {
  login: LogInStatus;
  contact: string;
  onChange: Function;
  location: any;
}
export interface INavStatus {

}
export default class NavComponent extends React.Component<INavProps, INavStatus> {
  private map: any;
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
    if (props.location.query.lat && props.location.query.lng) {
      addLoading();
      reverseGeocoding(new L.LatLng(props.location.query.lat, props.location.query.lng), function(response: IReverseGeoLocation) {
        self.setState({address: response.road + ", " + response.county + ", " + response.state + ", " + response.postcode, editing: false});
        removeLoading();
      }, function() {
        removeLoading();
      });
    }
  }

  render() {
    let self: NavComponent = this;
    switch(self.props.login) {
      case LogInStatus.GUEST:
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
                self.context.router.push({pathname: window.location.pathname, query: { login: true }});
              }}>
                PARENT IN
              </div>
            </div>
          </div>
        );
      case LogInStatus.PARENT:
      case LogInStatus.MANAGER:
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
                self.context.router.push({pathname: window.location.pathname, query: { login: true }});
              }}>
                {self.props.contact}
              </div>
            </div>
          </div>
        );
    }
  }
}

NavComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
