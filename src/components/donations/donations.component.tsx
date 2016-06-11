import * as React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import * as L from 'leaflet';
import * as AltContainer from 'alt-container';

var Settings = require('./../../constraints/settings.json');
import * as styles from './donations.component.css';
import './../../../node_modules/leaflet/dist/leaflet.css';
import { locationStore, LocationModel, LocationState } from './../../stores/location.store';
import { locationActions } from './../../actions/location.actions';
import DonationsMapComponent from './donations-map.component' ;
import DonationsPanelComponent from './donations-panel.component' ;
import { authStore } from './../../stores/auth.store';
import { treeStore } from './../../stores/tree.store';
import { mapStore } from './../../stores/map.store';
import { TileMode } from './../map.component';
import { foodStore, FoodModel, FoodState } from './../../stores/food.store';
import { foodActions } from './../../actions/food.actions';
import { treeActions } from './../../actions/tree.actions';
import MessageComponent from './../message/message.component';

export enum DonationsMode {
  NONE, DONATIONS, LOCATIONDETAIL, LOCATIONADDMARKER, LOCATIONADDINFO, LOCATIONDELETE, DONATIONNOTEEDIT, DONATIONNOTEDELETE
}
export interface IDonationsProps {
  params: any;
  location: any;
}
export interface IDonationsStatus {
  locations?: Array<LocationModel>;
  locationId?: number;
  donateId?: number;
  mode?: DonationsMode;
  tile?: TileMode;
  location?: L.LatLng;
}
export default class DonationsComponent extends React.Component<IDonationsProps, IDonationsStatus> {
  static contextTypes: any;
  constructor(props : IDonationsProps) {
    super(props);
    let self: DonationsComponent = this;
    this.state = {
      locationId: null,
      locations: null,
      donateId: null,
      mode: DonationsMode.DONATIONS,
      tile: TileMode.GRAY
    };
  }
  public componentDidMount() {
    let self: DonationsComponent = this;
    treeActions.resetTrees();
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: DonationsComponent = this;
  }
  public componentWillReceiveProps (nextProps: IDonationsProps) {
    let self: DonationsComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: IDonationsProps) => {
    let self: DonationsComponent = this;
    let locationId = null;
    let donateId = null;
    let mode: DonationsMode = DonationsMode.DONATIONS;
    if (props.params.locationId) {
      mode = DonationsMode.LOCATIONDETAIL;
      locationId = parseInt(props.params.locationId);
      if (props.location.query.mode == "delete") {
        mode = DonationsMode.LOCATIONDELETE;
      } else if (props.location.query.donate) {
        mode = DonationsMode.DONATIONNOTEEDIT;
        donateId = parseInt(props.location.query.donate);
        if (props.location.query.mode == "delete") {
          mode = DonationsMode.DONATIONNOTEDELETE;
        }
      }
    }
    self.setState({mode: mode, locationId: locationId, donateId: donateId});
  }

  public onMapRender = () => {
    let self: DonationsComponent = this;
    setTimeout(function() {
      if (authStore.getAuth().getIsGuest()) {
        self.context.router.replace({pathname: Settings.uBaseName + '/'});
      } else {
        foodActions.fetchFoods();
        locationActions.fetchLocations();
      }
    }, 1000);

  }
  public renderLocation = (locationId: number) => {
    let self: DonationsComponent = this;
  }

  render() {
    let self: DonationsComponent = this;
    return (
      <div className={styles.wrapper}>
        <AltContainer stores={
          {
            trees: function (props) {
              return {
                store: treeStore,
                value: treeStore.getState().trees
              };
            },
            foods: function (props) {
              return {
                store: foodStore,
                value: foodStore.getState().foods
              };
            },
            locations: function (props) {
              return {
                store: locationStore,
                value: locationStore.getState().locations
              };
            },
            tile: function (props) {
              return {
                store: mapStore,
                value: mapStore.getTile('map-donation'),
              };
            },
            tempLocation: function (props) {
              return {
                store: locationStore,
                value: locationStore.getState().temp
              };
            },
            position: function (props) {
              return {
                store: mapStore,
                value: mapStore.getState().position
              };
            },
          }
        }>
          <DonationsMapComponent mode={self.state.mode} donateId={self.state.donateId} locationId={self.state.locationId} onRender={self.onMapRender} />
          <DonationsPanelComponent mode={self.state.mode} locationId={self.state.locationId} donateId={self.state.donateId} />
          <MessageComponent />
        </AltContainer>
      </div>
    );
  }
}

DonationsComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
