import * as React from 'react';
import * as Router from 'react-router';
import { Route, IndexRoute } from 'react-router';

import NoMatchComponent from './components/nomatch.component';
import AppComponent from './components/app.component';
import TreesComponent from './components/trees.component';
import LoginComponent from './components/parent/login.component';
var Settings = require('./constraints/settings.json');

var RouteMap = (
    <Route path={Settings.uBaseNameForWebPack} component={AppComponent}>
        <IndexRoute component={TreesComponent} />
        <Route path="tree/:treeId" component={TreesComponent}>
        </Route>
        <Route path="*" component={NoMatchComponent}/>
    </Route>
);

export default RouteMap;
