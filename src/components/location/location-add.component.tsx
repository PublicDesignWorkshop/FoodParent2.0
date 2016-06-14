import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './location-add.component.css';
var Settings = require('./../../constraints/settings.json');

import LocationNameComponent from './location-name.component';
import LocationLocationComponent from './location-location.component';
import LocationAddressComponent from './location-address.component';
import LocationDescriptionComponent from './location-description.component';
import DonateListComponent from './../donate/donate-list.component';

import { LocationModel } from './../../stores/location.store';

export interface ILocationAddProps {
  location?: LocationModel;
}
export interface ILocationAddStatus {

}

export default class LocationAddComponent extends React.Component<ILocationAddProps, ILocationAddStatus> {
  static contextTypes: any;
  constructor(props : ILocationAddProps) {
    super(props);
    let self: LocationAddComponent = this;
    self.state = {

    };
  }

  public componentDidMount() {
    let self: LocationAddComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: LocationAddComponent = this;
  }

  public componentWillReceiveProps (nextProps: ILocationAddProps) {
    let self: LocationAddComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ILocationAddProps) => {
    let self: LocationAddComponent = this;
  }

  render() {
    let self: LocationAddComponent = this;
    if (self.props.location) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.treeinfo}>
            <LocationNameComponent location={self.props.location} editable={true} async={false} />
            <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
              self.context.router.push({pathname: Settings.uBaseName + '/donations'});
            }} /></div>
          </div>
          <div className={styles.basicinfo}>
            <LocationLocationComponent location={self.props.location} editable={true} async={false} />
            <LocationAddressComponent location={self.props.location} editable={true} async={false} />
            <LocationDescriptionComponent location={self.props.location} editable={true} async={false} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
        </div>
      );
    }
  }
}

LocationAddComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
