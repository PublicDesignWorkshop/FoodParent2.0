import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import AltContainer from 'alt-container';

import "babel-polyfill";

// require('./client.scss');

let ServerSetting = require('./../setting/server.json');
let InitActions = require('./actions/init.actions');
let InitStore = require('./stores/init.store');
let AuthStore = require('./stores/auth.store');


import Header from './header/header.component';
import TreeMap from './trees/tree-map.component';
import TreeNotify from './trees/tree-notify.component';
import TreeDetail from './trees/tree-detail.component';
import TreeAdd from './trees/tree-add.component';
import TreeFilter from './trees/tree-filter.component';
import Login from './account/login.component';
import Account from './account/account.component';
import Register from './account/register.component';
import Splash from './message/splash.component';
import Popup from './message/popup.component';
import Screenshot from './screenshot/screenshot.component';

import RecipientMap from './recipients/recipient-map.component';
import RecipientDetail from './recipients/recipient-detail.component';
import RecipientAdd from './recipients/recipient-add.component';

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
    }.bind(this), 0);
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
      let mapclassname = "map";
      if (this.props.location.pathname.indexOf("/screenshot") > -1) {
        mapclassname = "map-screenshot";
      }
      return (
        <div>
          <AltContainer stores={
            {
              auth: function(props) {
                return {
                  store: AuthStore,
                  value: AuthStore.getState().auth
                };
              },
            }
          }>
            <Header location={this.props.location}/>
          </AltContainer>;
          <div className={mapclassname}><div id={MapSetting.sMapId} ref={MapSetting.sMapId}></div></div>
          {this.props.children}
          <Popup />
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
      <Route path="tree/:treeId" component={TreeDetail} />
      <Route path="addtree" component={TreeAdd} />
      <Route path="login" component={Login} />
      <Route path="account" component={Account} />
      <Route path="register" component={Register} />
      <Route path="filter" component={TreeFilter} />
      <Route path="recipients" component={RecipientMap} />
      <Route path="addrecipient" component={RecipientAdd} />
      <Route path="recipient/:recipientId" component={RecipientDetail} />
      <Route path="notify" component={TreeNotify} />
      <Route path="notify/:treeId" component={TreeNotify} />
      <Route path="screenshot/:treeId" component={Screenshot} />
    </Route>
  </Router>
), document.getElementById('app'));
