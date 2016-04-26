import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../constraints/settings.json');
import * as styles from './map-menu.component.css';
import { TreeModel, treeStore } from './../stores/tree.store';
import { FoodModel, foodStore } from './../stores/food.store';
import { FlagModel, flagStore } from './../stores/flag.store';
import { OwnershipModel, ownershipStore } from './../stores/ownership.store';
import AddressComponent from './address.component';
import DescriptionComponent from './description.component';
import FlagComponent from './flag.component';
import PublicComponent from './pub.component';
import LocationComponent from './location.component';
import { LogInStatus } from './app.component';

export interface IMapMenuProps {
  login: LogInStatus;
  onZoom: Function;
}
export interface IMapMenuStatus {
  zoom: number;
}
export default class MapMenuComponent extends React.Component<IMapMenuProps, IMapMenuStatus> {
  static contextTypes: any;
  constructor(props : IMapMenuProps) {
    super(props);
    let self: MapMenuComponent = this;
    this.state = {
      zoom: Settings.iDefaultZoom,
    };
  }
  public componentDidMount() {
    let self: MapMenuComponent = this;
    flagStore.fetchFlags();
    //ownershipStore.fetchOwnerships();
  }
  public componentWillUnmount() {
    let self: MapMenuComponent = this;
  }
  public componentWillReceiveProps (nextProps: IMapMenuProps) {
    let self: MapMenuComponent = this;

  }

  render() {
    let self: MapMenuComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.button + " " + styles.buttontop}>
          <FontAwesome className='' name='location-arrow' />
        </div>
        <div className={styles.button} onClick={()=> {
          let zoom: number = Math.min(Settings.iMaxZoom, self.state.zoom + 1);
          self.props.onZoom(zoom);
          self.setState({zoom: zoom});
        }}>
          <FontAwesome className='' name='search-plus' />
        </div>
        <div className={styles.button} onClick={()=> {
          let zoom: number = Math.max(Settings.iMinZoom, self.state.zoom - 1);
          self.props.onZoom(zoom);
          self.setState({zoom: zoom});
        }}>
          <FontAwesome className='' name='search-minus' />
        </div>
        <div className={styles.button}>
          <FontAwesome className='' name='filter' />
        </div>
        <div className={styles.button}>
          <FontAwesome className='' name='plus' />
        </div>
      </div>
    );
  }
}

MapMenuComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
