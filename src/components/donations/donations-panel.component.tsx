import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as moment from 'moment';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './donations-panel.component.css';
var Settings = require('./../../constraints/settings.json');

import LocationComponent from './../location/location.component';
import DonationsControlsComponent from './donations-control.component';
import DonateAddComponent from './../donate/donate-add.component';
import DonateEditComponent from './../donate/donate-edit.component';
import LocationAddComponent from './../location/location-add.component';
import DonateGraphComponent from  './../donate/donate-graph.component';

import { LocationModel, locationStore } from './../../stores/location.store';
import { donateStore } from './../../stores/donate.store';
import { mapActions } from './../../actions/map.actions';

import { TileMode, DonationsMode } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface IDonationsPanelProps {
  locationId: number;
  donateId: number;
  locations?: Array<LocationModel>;
  tile?: TileMode;
  mode: DonationsMode;
}
export interface IDonationsPanelStatus {
  open?: boolean;
}

export default class DonationsPanelComponent extends React.Component<IDonationsPanelProps, IDonationsPanelStatus> {
  static contextTypes: any;
  constructor(props : IDonationsPanelProps) {
    super(props);
    let self: DonationsPanelComponent = this;
    self.state = {
      open: false,
    };
  }

  public componentDidMount() {
    let self: DonationsPanelComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: DonationsPanelComponent = this;
  }

  public componentWillReceiveProps (nextProps: IDonationsPanelProps) {
    let self: DonationsPanelComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: IDonationsPanelProps) => {
    let self: DonationsPanelComponent = this;
    let location: LocationModel = locationStore.getLocation(props.locationId);
    let open: boolean = false;
    if (location || props.mode == DonationsMode.LOCATIONADDINFO) {
      open = true;
    }
    self.setState({open: open});
  }

  render() {
    let self: DonationsPanelComponent = this;
    if (!self.state.open) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <DonationsControlsComponent tile={self.props.tile} mode={self.props.mode} />
          </div>
          <div className={styles.right}>
          </div>
        </div>
      );
    } else {
      switch(self.props.mode) {
        case DonationsMode.LOCATIONDETAIL:
        case DonationsMode.LOCATIONDELETE:
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.left}>
              <DonationsControlsComponent tile={self.props.tile} mode={self.props.mode} />
            </div>
            <div className={styles.right}>
              <LocationComponent locations={self.props.locations} locationId={self.props.locationId} donateId={self.props.donateId} />
              <div className={styles.buttongroup}>
                <div className={styles.button2 + " " + styles.locate} onClick={()=> {
                  let location: LocationModel = locationStore.getLocation(self.props.locationId);
                  if (location) {
                    mapActions.moveToWithMarker('map-donation', location.getLocation(), Settings.iFocusZoom);
                  }
                }}>{localization(960)}</div>
                <div className={styles.button2 + " " + styles.selected}>{localization(964)}</div>
                <div className={styles.button2} onClick={()=> {
                  self.context.router.push({pathname: window.location.pathname, query: { mode: "graph" }});
                }}>{localization(963)}</div>
              </div>
              <AltContainer stores={
                {
                  donate: function (props) {
                    return {
                      store: donateStore,
                      value: donateStore.getState().temp,
                    };
                  },
                  code: function (props) {
                    return {
                      store: donateStore,
                      value: donateStore.getState().code,
                    };
                  }
                }
              }>
                <DonateAddComponent locationId={self.props.locationId} />
              </AltContainer>
            </div>
          </div>
        );
        case DonationsMode.DONATIONNOTEEDIT:
        case DonationsMode.DONATIONNOTEDELETE:
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <DonationsControlsComponent tile={self.props.tile} mode={self.props.mode} />
              </div>
              <div className={styles.right}>
                <LocationComponent locations={self.props.locations} locationId={self.props.locationId} donateId={self.props.donateId} />
                <div className={styles.buttongroup}>
                  <div className={styles.button2 + " " + styles.locate} onClick={()=> {
                    let location: LocationModel = locationStore.getLocation(self.props.locationId);
                    if (location) {
                      mapActions.moveToWithMarker('map-donation', location.getLocation(), Settings.iFocusZoom);
                    }
                  }}>{localization(960)}</div>
                  <div className={styles.button2} onClick={()=> {
                    self.context.router.push({pathname: window.location.pathname});
                  }}>{localization(964)}</div>
                  <div className={styles.button2} onClick={()=> {
                    self.context.router.push({pathname: window.location.pathname, query: { mode: "graph" }});
                  }}>{localization(963)}</div>
                </div>
                <AltContainer stores={
                  {
                    donate: function (props) {
                      return {
                        store: donateStore,
                        value: donateStore.getDonate(self.props.donateId),
                      };
                    },
                    code: function (props) {
                      return {
                        store: donateStore,
                        value: donateStore.getState().code,
                      };
                    }
                  }
                }>
                  <DonateEditComponent locationId={self.props.locationId} />
                </AltContainer>
              </div>
            </div>
          );
        case DonationsMode.DONATIONGRAPH:
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <DonationsControlsComponent tile={self.props.tile} mode={self.props.mode} />
              </div>
              <div className={styles.right}>
                <LocationComponent locations={self.props.locations} locationId={self.props.locationId} donateId={self.props.donateId} />
                <div className={styles.buttongroup}>
                  <div className={styles.button2 + " " + styles.locate} onClick={()=> {
                    let location: LocationModel = locationStore.getLocation(self.props.locationId);
                    if (location) {
                      mapActions.moveToWithMarker('map-donation', location.getLocation(), Settings.iFocusZoom);
                    }
                  }}>{localization(960)}</div>
                  <div className={styles.button2} onClick={()=> {
                    self.context.router.push({pathname: window.location.pathname});
                  }}>{localization(964)}</div>
                  <div className={styles.button2 + " " + styles.selected}>{localization(963)}</div>
                </div>
                <AltContainer stores={
                  {
                    location: function (props) {
                      return {
                        store: locationStore,
                        value: locationStore.getLocation(self.props.locationId),
                      };
                    },
                    donates: function (props) {
                      return {
                        store: donateStore,
                        value: donateStore.getState().donates,
                      };
                    }
                  }
                }>
                  <DonateGraphComponent />
                </AltContainer>
              </div>
            </div>
          );
        case DonationsMode.LOCATIONADDINFO:
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <DonationsControlsComponent tile={self.props.tile} mode={self.props.mode} />
              </div>
              <div className={styles.right}>
                <AltContainer stores={
                  {
                    location: function (props) {
                      return {
                        store: locationStore,
                        value: locationStore.getState().temp,
                      };
                    },
                    code: function (props) {
                      return {
                        store: locationStore,
                        value: locationStore.getState().code,
                      };
                    }
                  }
                }>
                  <LocationAddComponent />
                </AltContainer>
              </div>
            </div>
          );
      }
    }
  }
}

DonationsPanelComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
