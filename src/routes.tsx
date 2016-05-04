import * as React from 'react';
import * as Router from 'react-router';
import { Route, IndexRoute } from 'react-router';

import AppComponent from './components/app.component';
import TreesComponent from './components/trees.component';
var Settings = require('./constraints/settings.json');

var RouteMap = (
    <Route path={Settings.uBaseNameForWebPack} component={AppComponent}>
        <IndexRoute component={TreesComponent}/>
        <Route path="trees/:treeId" component={TreesComponent}/>
    </Route>
);

export default RouteMap;
