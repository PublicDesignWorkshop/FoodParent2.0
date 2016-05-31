import * as React from 'react';
import { render } from 'react-dom';
import { Router, Link } from 'react-router';

var Settings = require('./../constraints/settings.json');
import * as styles from './nav.component.css';
import { LogInStatus } from './app.component';
import { geocoding, reverseGeocoding, IReverseGeoLocation } from './../utils/geolocation';
import { addLoading, removeLoading } from './../utils/loadingtracker';

export interface INavProps {
  login: LogInStatus;
  contact: string;
  onChange: Function;
  location: any;
}
export interface INavStatus {
  address?: string;
  editing?: boolean;
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

  private searchAddress = () => {
    let self: NavComponent = this;
    self.setState({editing: false});
    if (self.state.address.trim() != "") {
      self.props.onChange(self.state.address);
      geocoding(self.state.address, new L.LatLng(self.props.location.query.lat, self.props.location.query.lng), function(response) {
        // self.context.router.replace({pathname: window.location.pathname, query: { lat: response.lat.toFixed(Settings.iMarkerPrecision), lng: response.lng.toFixed(Settings.iMarkerPrecision), move: true }});
        self.context.router.replace({pathname: Settings.uBaseName + '/', query: { lat: response.lat.toFixed(Settings.iMarkerPrecision), lng: response.lng.toFixed(Settings.iMarkerPrecision), move: true }});
      }, function() {

      });
    } else {
      if (self.props.location.query.lat && self.props.location.query.lng) {
        addLoading();
        reverseGeocoding(new L.LatLng(self.props.location.query.lat, self.props.location.query.lng), function(response: IReverseGeoLocation) {
          self.setState({address: response.road + ", " + response.county + ", " + response.state + ", " + response.postcode, editing: false});
          removeLoading();
        }, function() {
          removeLoading();
        });
      }
    }
  }

  render() {
    let self: NavComponent = this;
    if (self.state.editing) {
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
                <input autoFocus type="text" className={styles.edit} placeholder="enter a search location address..."
                  value={self.state.address}
                  onChange={(event: any)=> {
                    self.setState({address: event.target.value});
                  }}
                  onKeyPress={(event)=> {
                    if (event.key == 'Enter') {
                      self.searchAddress();
                    }
                  }}
                  onBlur={()=> {
                    self.searchAddress();
                  }} />
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
              <input autoFocus type="text" className={styles.edit} placeholder="enter a search location address..."
                value={self.state.address}
                onChange={(event: any)=> {
                  self.setState({address: event.target.value});
                }}
                onKeyPress={(event)=> {
                  if (event.key == 'Enter') {
                    self.searchAddress();
                  }
                }}
                onBlur={()=> {
                  self.searchAddress();
                }} />
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
    } else {
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
                <div className={styles.location} onClick={()=> {
                  self.setState({address: "", editing: true});
                }}>
                  {self.state.address}
                </div>
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
                <div className={styles.location} onClick={()=> {
                  self.setState({address: "", editing: true});
                }}>
                  {self.state.address}
                </div>
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
}

NavComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
