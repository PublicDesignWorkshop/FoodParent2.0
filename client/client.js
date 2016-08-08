import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import AltContainer from 'alt-container';

import "babel-polyfill";

require('./client.scss');
let ServerSetting = require('./../setting/server.json');
let InitActions = require('./actions/init.actions');
let InitStore = require('./stores/init.store');


import Header from './header/header.component';
import TreeMap from './trees/tree-map.component';
import TreeGraph from './trees/tree-graph.component';
import TreeAdd from './trees/tree-add.component';
import Login from './account/login.component';
import Splash from './message/splash.component';

let MapSetting = require('./../setting/map.json');
import { localization } from './utils/localization';


// // Inttialize localization
// localization(994, window.navigator.userLanguage || window.navigator.language);

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    if (__DEV__) {
      console.log("DEV mod is active.");
    }
    this.onChange = this.onChange.bind(this);
  }
  componentWillMount() {
    this.setState({loaded: false});
  }
  componentDidMount () {
    InitActions.initialize();
    InitStore.listen(this.onChange);
  }
  componentWillUnmount() {
    InitStore.unlisten(this.onChange);
  }
  onChange() {
    let loaded = InitStore.getState().loaded;
    setTimeout(function() {
      this.setState({loaded: loaded});
    }.bind(this), 1);
  }
  render () {
    let splash = <AltContainer stores={
      {
        message: function(props) {
          return {
            store: InitStore,
            value: InitStore.getState().message
          };
        },
        hide: function(props) {
          return {
            store: InitStore,
            value: InitStore.getState().hide
          };
        }
      }
    }>
      <Splash />
    </AltContainer>;
    if (this.state.loaded) {
      return (
        <div>
          <Header location={this.props.location}/>
          <div id={MapSetting.sTreeMapId} ref={MapSetting.sTreeMapId} className="map"></div>
          {this.props.children}
          {splash}
        </div>
      );
    } else {
      return (
        <div>
          {splash}
        </div>
      );
    }

  }
}

render((
  <Router history={browserHistory}>
    <Route path={ServerSetting.uBaseForRouter} component={App}>
      <IndexRoute component={TreeMap} />
      <Route path="tree/:treeId" component={TreeGraph} />
      <Route path="addtree" component={TreeAdd} />
      <Route path="login" component={Login} />
    </Route>
  </Router>
), document.getElementById('app'));
