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

export interface ITreesControlsProps {
  login: LogInStatus;
  zoom: number;
  onZoom: Function;
  onGeo: PositionCallback;
  tile: TileMode;
  onTile: Function;
}
export interface ITreesControlsStatus {

}
export default class TreesControlsComponent extends React.Component<ITreesControlsProps, ITreesControlsStatus> {
  static contextTypes: any;
  constructor(props : ITreesControlsProps) {
    super(props);
    let self: TreesControlsComponent = this;
    this.state = {
      login: LogInStatus.GUEST,
      userId: null,
      open: false,
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
    let tileIcon = 'map-o';
    if (self.props.tile == TileMode.SATELLITE) {
      tileIcon = 'map';
    }

    if (self.props.login == LogInStatus.MANAGER || self.props.login == LogInStatus.ADMIN) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.button + " " + styles.buttontop} onClick={()=> {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(self.props.onGeo, null);
            }
          }}>
            <FontAwesome className='' name='location-arrow' />
          </div>
          <div className={styles.button} onClick={()=> {
            if (self.props.tile == TileMode.GRAY) {
              self.props.onTile(TileMode.SATELLITE);
            } else {
              self.props.onTile(TileMode.GRAY);
            }
          }}>
            <FontAwesome className='' name={tileIcon} />
          </div>
          <div className={styles.button} onClick={()=> {
            let zoom: number = Math.min(Settings.iMaxZoom, self.props.zoom + 1);
            self.props.onZoom(zoom);
          }}>
            <FontAwesome className='' name='search-plus' />
          </div>
          <div className={styles.button} onClick={()=> {
            let zoom: number = Math.max(Settings.iMinZoom, self.props.zoom - 1);
            self.props.onZoom(zoom);
          }}>
            <FontAwesome className='' name='search-minus' />
          </div>
          <div className={styles.button}>
            <FontAwesome className='' name='filter' />
          </div>
          <div className={styles.button + " " + styles.buttonbottom}>
            <FontAwesome className='' name='plus' onClick={()=> {
              self.context.router.push({pathname: Settings.uBaseName + '/trees/add', query: { mode: "marker" }});
            }}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.button + " " + styles.buttontop} onClick={()=> {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(self.props.onGeo, null);
            }
          }}>
            <FontAwesome className='' name='location-arrow' />
          </div>
          <div className={styles.button} onClick={()=> {
            if (self.props.tile == TileMode.GRAY) {
              self.props.onTile(TileMode.SATELLITE);
            } else {
              self.props.onTile(TileMode.GRAY);
            }
          }}>
            <FontAwesome className='' name={tileIcon} />
          </div>
          <div className={styles.button} onClick={()=> {
            let zoom: number = Math.min(Settings.iMaxZoom, self.props.zoom + 1);
            self.props.onZoom(zoom);
          }}>
            <FontAwesome className='' name='search-plus' />
          </div>
          <div className={styles.button} onClick={()=> {
            let zoom: number = Math.max(Settings.iMinZoom, self.props.zoom - 1);
            self.props.onZoom(zoom);
          }}>
            <FontAwesome className='' name='search-minus' />
          </div>
          <div className={styles.button + " " + styles.buttonbottom}>
            <FontAwesome className='' name='plus' onClick={()=> {
              self.context.router.push({pathname: Settings.uBaseName + '/trees/add', query: { mode: "marker" }});
            }} />
          </div>
        </div>
      );
    }

  }
}

TreesControlsComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
