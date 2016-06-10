import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../../constraints/settings.json');
import * as styles from './donations-control.component.css';
import { TileMode } from './../map.component';
import { mapActions } from './../../actions/map.actions';
import { mapStore } from './../../stores/map.store';
import { authStore } from './../../stores/auth.store';

export interface IDonationsControlsProps {
  tile: TileMode;
}
export interface IDonationsControlsStatus {

}
export default class DonationsControlsComponent extends React.Component<IDonationsControlsProps, IDonationsControlsStatus> {
  static contextTypes: any;
  constructor(props : IDonationsControlsProps) {
    super(props);
    let self: DonationsControlsComponent = this;
    this.state = {

    };
  }
  public componentDidMount() {
    let self: DonationsControlsComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: DonationsControlsComponent = this;
  }
  public componentWillReceiveProps (nextProps: IDonationsControlsProps) {
    let self: DonationsControlsComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: IDonationsControlsProps) => {
    let self: DonationsControlsComponent = this;
  }

  render() {
    let self: DonationsControlsComponent = this;
    let tile = 'map-o';
    if (self.props.tile == TileMode.SATELLITE) {
      tile = 'map';
    }
    let tree: JSX.Element;
    if (authStore.getAuth().getIsManager()) {
      tree = <div className={styles.button + " " + styles.buttonbottom} onClick={()=> {
        self.context.router.push({pathname: Settings.uBaseName + '/'});
      }}>
        <FontAwesome className='' name='apple'/>
      </div>
    }
    return (
      <div className={styles.wrapper}>
        <div className={styles.button + " " + styles.buttontop} onClick={()=> {
          mapActions.moveToUserLocation('map-donation');
        }}>
          <FontAwesome className='' name='location-arrow' />
        </div>
        <div className={styles.button} onClick={()=> {
          if (self.props.tile == TileMode.GRAY) {
            mapActions.setTile('map-donation', TileMode.SATELLITE);
          } else {
            mapActions.setTile('map-donation', TileMode.GRAY);
          }
        }}>
          <FontAwesome className='' name={tile} />
        </div>
        <div className={styles.button} onClick={()=> {
          let zoom: number = Math.min(Settings.iMaxZoom, mapStore.getZoom('map-donation') + 1);
          mapActions.setZoom('map-donation', zoom);
        }}>
          <FontAwesome className='' name='search-plus' />
        </div>
        <div className={styles.button} onClick={()=> {
          let zoom: number = Math.min(Settings.iMaxZoom, mapStore.getZoom('map-donation') - 1);
          mapActions.setZoom('map-donation', zoom);
        }}>
          <FontAwesome className='' name='search-minus' />
        </div>
        <div className={styles.button + " " + styles.buttonbottom} onClick={()=> {
          self.context.router.push({pathname: Settings.uBaseName + '/donation/add', query: { mode: "marker" }});
        }}>
          <FontAwesome className='' name='plus' />
        </div>
        {tree}
      </div>
    );
  }
}

DonationsControlsComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
