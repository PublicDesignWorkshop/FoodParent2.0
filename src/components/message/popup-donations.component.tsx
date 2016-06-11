import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../../constraints/settings.json');
import * as styles from './popup-donations.component.css';
import TreeComponent from './../tree/tree.component';
import { TreesMode } from './../trees.component';
import { DonationsMode } from './../donations/donations.component';
import TreesControlsComponent from './../trees-controls.component';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { DonateModel, donateStore } from './../../stores/donate.store';
import { LocationModel, locationStore } from './../../stores/location.store';
import { authStore } from './../../stores/auth.store';
import { checkLogin, checkAdmin } from './../../utils/authentication';
import { LogInStatus } from './../app.component';
import { noteActions } from './../../actions/note.actions';
import { treeActions } from './../../actions/tree.actions';
import { donateActions } from './../../actions/donate.actions';
import { locationActions } from './../../actions/location.actions';
import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';
import { localization } from './../../constraints/localization';


export interface IPopupDonationsProps {
  mode: DonationsMode;
  locationId: number;
  donateId: number;
  donateCode?: any;
}
export interface IPopupDonationsStatus {

}
export default class PopupDonationsComponent extends React.Component<IPopupDonationsProps, IPopupDonationsStatus> {
  static contextTypes: any;
  constructor(props : IPopupDonationsProps) {
    super(props);
    let self: PopupDonationsComponent = this;
    this.state = {

    };
  }
  public componentDidMount() {
    let self: PopupDonationsComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: PopupDonationsComponent = this;
  }
  public componentWillReceiveProps (nextProps: IPopupDonationsProps) {
    let self: PopupDonationsComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: IPopupDonationsProps) => {
    let self: PopupDonationsComponent = this;
  }

  render() {
    let self: PopupDonationsComponent = this;
    switch (self.props.mode) {
      case DonationsMode.LOCATIONADDMARKER:
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.message}>
              <strong>Move</strong> the <strong>New Place</strong> to a designated location.
              <span className={styles.button} onClick={()=> {
                self.context.router.replace({pathname: Settings.uBaseName + '/donation/add', query: { mode: "info" }});
              }} >
                NEXT
              </span>
            </div>
          </div>
        );
      case DonationsMode.LOCATIONADDINFO:
        return (
          <div className={styles.wrapper + " " + styles.slidein}>
            <div className={styles.message}>
              <strong>Fill out</strong> information for the <strong>New Place</strong>.
              <span className={styles.button} onClick={()=> {
                locationActions.createLocation(locationStore.getState().temp);
              }} >
                SAVE
              </span>
            </div>
          </div>
        );
      case DonationsMode.DONATIONNOTEDELETE:
        let donate: DonateModel = donateStore.getDonate(self.props.donateId);
        return (
          <div className={styles.wrapper + " " + styles.slidein + " " + styles.error}>
            <div className={styles.message}>
              <span dangerouslySetInnerHTML={{__html: localization(706)}} />
              <span className={styles.button2} onClick={()=> {
                if (self.props.donateCode == 200) {
                  donateActions.deleteDonate(donate);
                }
              }} >
                DELETE
              </span>
            </div>
          </div>
        );
      case DonationsMode.LOCATIONDELETE:
        let location: LocationModel = locationStore.getLocation(self.props.locationId);
        return (
          <div className={styles.wrapper + " " + styles.slidein + " " + styles.error}>
            <div className={styles.message}>
              <span dangerouslySetInnerHTML={{__html: localization(636)}} />
              <span className={styles.button2} onClick={()=> {
                if (location && self.props.donateCode == 200) {
                  if (authStore.getAuth().getIsAdmin()) {
                    locationActions.deleteLocation(location);
                  }
                }
              }} >
                DELETE
              </span>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.wrapper}>
          </div>
        );
    }
  }
}

PopupDonationsComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
