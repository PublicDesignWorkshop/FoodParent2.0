import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../constraints/settings.json');
import * as styles from './trees-controls.component.css';
import TreeComponent from './tree/tree.component';
import { TreeModel, treeStore } from './../stores/tree.store';
import { FoodModel, foodStore } from './../stores/food.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { checkLogin, checkAdmin } from './../utils/authentication';
import { LogInStatus } from './app.component';
import { TileMode } from './map.component';
import { mapActions } from './../actions/map.actions';
import { mapStore } from './../stores/map.store';
import { authStore } from './../stores/auth.store';

export interface ITreesControlsProps {
  tile: TileMode;
}
export interface ITreesControlsStatus {

}
export default class TreesControlsComponent extends React.Component<ITreesControlsProps, ITreesControlsStatus> {
  static contextTypes: any;
  constructor(props : ITreesControlsProps) {
    super(props);
    let self: TreesControlsComponent = this;
    this.state = {

    };
  }
  public componentDidMount() {
    let self: TreesControlsComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreesControlsComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreesControlsProps) {
    let self: TreesControlsComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ITreesControlsProps) => {
    let self: TreesControlsComponent = this;
  }

  render() {
    let self: TreesControlsComponent = this;
    let tile = 'map-o';
    if (self.props.tile == TileMode.SATELLITE) {
      tile = 'map';
    }
    let donation: JSX.Element;
    if (authStore.getAuth().getIsManager()) {
      donation = <div className={styles.button + " " + styles.buttonbottom} onClick={()=> {

      }}>
        <FontAwesome className='' name='sitemap'/>
      </div>
    }
    return (
      <div className={styles.wrapper}>
        <div className={styles.button + " " + styles.buttontop} onClick={()=> {
          if (navigator.geolocation) {
            // navigator.geolocation.getCurrentPosition(self.props.onGeo, null);
          }
        }}>
          <FontAwesome className='' name='location-arrow' />
        </div>
        <div className={styles.button} onClick={()=> {
          if (self.props.tile == TileMode.GRAY) {
            mapActions.setTile('map', TileMode.SATELLITE);
          } else {
            mapActions.setTile('map', TileMode.GRAY);
          }
        }}>
          <FontAwesome className='' name={tile} />
        </div>
        <div className={styles.button} onClick={()=> {
          let zoom: number = Math.min(Settings.iMaxZoom, mapStore.getZoom('map') + 1);
          mapActions.setZoom('map', zoom);
        }}>
          <FontAwesome className='' name='search-plus' />
        </div>
        <div className={styles.button} onClick={()=> {
          let zoom: number = Math.min(Settings.iMaxZoom, mapStore.getZoom('map') - 1);
          mapActions.setZoom('map', zoom);
        }}>
          <FontAwesome className='' name='search-minus' />
        </div>
        <div className={styles.button} onClick={()=> {
          self.context.router.push({pathname: Settings.uBaseName + '/tree/filter'});
        }}>
          <FontAwesome className='' name='filter'/>
        </div>
        <div className={styles.button + " " + styles.buttonbottom} onClick={()=> {
          self.context.router.push({pathname: Settings.uBaseName + '/tree/add', query: { mode: "marker" }});
        }}>
          <FontAwesome className='' name='plus' />
        </div>
        {donation}
      </div>
    );
  }
}

TreesControlsComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
