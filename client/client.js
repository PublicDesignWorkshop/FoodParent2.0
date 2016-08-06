import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import "babel-polyfill";

require('./client.scss');
let ServerSetting = require('./../setting/server.json');

import Header from './header/header.component';
import TreeMap from './trees/tree-map.component';
import TreeGraph from './trees/tree-graph.component';
import TreeAdd from './trees/tree-add.component';
import Login from './account/login.component';

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
  }
  render () {
    return (
      <div className="fade-in">
        <Header location={this.props.location}/>
        <div id={MapSetting.sTreeMapId} ref={MapSetting.sTreeMapId} className="map"></div>
        {this.props.children}
      </div>
    );
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
