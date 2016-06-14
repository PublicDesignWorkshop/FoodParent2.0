import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './trees-controls.component.css';
var Settings = require('./../../constraints/settings.json');

import TreeComponent from './../tree/tree.component';
import { mapStore } from './../../stores/map.store';
import { mapActions } from './../../actions/map.actions';
import { authStore } from './../../stores/auth.store';

import { TileMode, TreesMode } from './../../utils/enum';

export interface ITreesControlsProps {
  mode: TreesMode;
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
  }

  public componentWillUnmount() {
    let self: TreesControlsComponent = this;
  }

  public componentWillReceiveProps (nextProps: ITreesControlsProps) {
    let self: TreesControlsComponent = this;
  }

  render() {
    let self: TreesControlsComponent = this;
    let tile = 'map-o';
    if (self.props.tile == TileMode.SATELLITE) {
      tile = 'map';
    }
    let add: JSX.Element = <div className={styles.button + " " + styles.buttonbottom} onClick={()=> {
      self.context.router.push({pathname: Settings.uBaseName + '/tree/add', query: { mode: "marker" }});
    }}>
      <FontAwesome className={styles.icon} name='plus' />
    </div>;
    if (self.props.mode == TreesMode.TREEADDMARKER || self.props.mode == TreesMode.TREEADDINFO) {
      add = <div className={styles.button + " " + styles.buttonbottom} onClick={()=> {
        self.context.router.goBack();
      }}>
        <FontAwesome className={styles.cancel} name='plus' />
      </div>;
    }
    let donation: JSX.Element;
    if (authStore.getAuth().getIsManager()) {
      donation = <div className={styles.button + " " + styles.buttonbottom} onClick={()=> {
        self.context.router.push({pathname: Settings.uBaseName + '/donations'});
      }}>
        <FontAwesome className={styles.icon} name='sitemap'/>
      </div>
    }
    return (
      <div className={styles.wrapper}>
        <div className={styles.button + " " + styles.buttontop} onClick={()=> {
          mapActions.moveToUserLocation('map');
        }}>
          <FontAwesome className={styles.icon} name='location-arrow' />
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
          <FontAwesome className={styles.icon} name='search-minus' />
        </div>
        <div className={styles.button} onClick={()=> {
          self.context.router.push({pathname: Settings.uBaseName + '/tree/filter'});
        }}>
          <FontAwesome className={styles.icon} name='filter'/>
        </div>
        {add}
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
