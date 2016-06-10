import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';
import * as moment from 'moment';

var Settings = require('./../../constraints/settings.json');
import * as styles from './donations-panel.component.css';
import LocationComponent from './../location/location.component';
import DonationsControlsComponent from './donations-control.component';
import { DonationsMode } from './donations.component';
import { LocationModel, locationStore } from './../../stores/location.store';
import { locationActions } from './../../actions/location.actions';
import { mapStore } from './../../stores/map.store';
import { TileMode } from './../map.component';
import MessageComponent from './../message/message.component';

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
            <DonationsControlsComponent tile={self.props.tile} />
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
              <DonationsControlsComponent tile={self.props.tile} />
            </div>
            <div className={styles.right}>
              <LocationComponent locations={self.props.locations} locationId={self.props.locationId} donateId={self.props.donateId} />
            </div>
          </div>
        );
        case DonationsMode.DONATIONNOTEEDIT:
        case DonationsMode.DONATIONNOTEDELETE:
          return (
            <div className={styles.wrapper + " " + styles.slidein}>
              <div className={styles.left}>
                <DonationsControlsComponent tile={self.props.tile} />
              </div>
              <div className={styles.right}>
                <LocationComponent locations={self.props.locations} locationId={self.props.locationId} donateId={self.props.donateId} />
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
