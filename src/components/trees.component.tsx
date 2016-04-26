import * as React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import * as L from 'leaflet';
import * as AltContainer from 'alt-container';

var Settings = require('./../constraints/settings.json');
import * as styles from './trees.component.css';
import './../../node_modules/leaflet/dist/leaflet.css';
import { treeStore, TreeModel, TreeState } from './../stores/tree.store';
import { foodStore, FoodModel, FoodState } from './../stores/food.store';
import { treeActions } from './../actions/tree.actions';
import { foodActions } from './../actions/food.actions';
import MapComponent from './map.component' ;
import TreeComponent from './tree.component' ;
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { checkLogin, checkAdmin } from './../utils/authentication';
import { LogInStatus } from './app.component';
import MapMenuComponent from './map-menu.component';

export interface ITreesProps {
  params: any;
}
export interface ITreesStatus {
  trees: Array<TreeModel>;
  treeId: number;
  login: LogInStatus;
  userId: number;
  zoom: number;
}
export default class TreesComponent extends React.Component<ITreesProps, ITreesStatus> {
  constructor(props : ITreesProps) {
    super(props);
    let self: TreesComponent = this;
    this.state = {
      treeId: null,
      trees: null,
      login: LogInStatus.GUEST,
      userId: null,
      zoom: Settings.iDefaultZoom,
    };
  }
  public componentDidMount() {
    let self: TreesComponent = this;
    treeStore.listen(self.onChange);
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreesComponent = this;
    treeStore.unlisten(self.onChange);
  }
  public componentWillReceiveProps (nextProps: ITreesProps) {
    let self: TreesComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: ITreesProps) => {
    console.warn("--updateProps");
    let self: TreesComponent = this;
    let treeId = null;
    if (props.params.treeId) {
      treeId = parseInt(props.params.treeId);
    }
    self.setState({treeId: treeId, trees: self.state.trees, login: self.state.login, userId: self.state.userId, zoom: self.state.zoom});
    addLoading();
    checkLogin(function(response1) { // login
      checkAdmin(function(response2) { // Admin
        console.log("manager");
        removeLoading();
        self.setState({treeId: treeId, trees: self.state.trees, login: LogInStatus.MANAGER, userId: parseInt(response1.id), zoom: self.state.zoom});
      }, function(response) { // Parent
        console.log("parent");
        removeLoading();
        self.setState({treeId: treeId, trees: self.state.trees, login: LogInStatus.PARENT, userId: parseInt(response1.id), zoom: self.state.zoom});
      }, function(response) { // Error
        removeLoading();
      });
    }, function(response) { // Not logged in
      removeLoading();
      console.log("guest");
      self.setState({treeId: treeId, trees: self.state.trees, login: LogInStatus.GUEST, userId: parseInt(response.id), zoom: self.state.zoom});
    }, function(response) { // Error
      removeLoading();
    });
  }
  onChange = (store: TreeState) => {
    let self: TreesComponent = this;
    //self.setState({trees: store.trees, treeId: self.state.treeId});
  }
  public onMapRender = () => {
    let self: TreesComponent = this;
    setTimeout(function () {
      foodStore.fetchFoods();
      treeStore.fetchTrees();
    }, 1500);
  }
  public renderTree = (treeId: number) => {
    let self: TreesComponent = this;
    //self.setState({trees: self.state.trees, treeId: treeId, bClose: self.state.bClose});
  }
  public changeLocation = () => {
    let self: TreesComponent = this;
  }
  onZoom = (zoom: number) => {
    let self: TreesComponent = this;
    self.setState({treeId: self.state.treeId, trees: self.state.trees, login: self.state.login, userId: self.state.userId, zoom: zoom});
  }
  render() {
    let self: TreesComponent = this;
    return (
      <div className={styles.wrapper}>
        <AltContainer stores={
          {
            foods: function (props) {
              return {
                store: foodStore,
                value: foodStore.getState().foods
              };
            },
            trees: function (props) {
              return {
                store: treeStore,
                value: treeStore.getState().trees
              };
            }
          }
        }>
          <MapComponent treeId={self.state.treeId} foods={foodStore.getState().foods} trees={treeStore.getState().trees} onRender={self.onMapRender} zoom={self.state.zoom} />
          <MapMenuComponent login={self.state.login} onZoom={self.onZoom} />
          <TreeComponent login={self.state.login} userId={self.state.userId} treeId={self.state.treeId} foods={foodStore.getState().foods} trees={treeStore.getState().trees} />
        </AltContainer>

      </div>
    );
  }
}
