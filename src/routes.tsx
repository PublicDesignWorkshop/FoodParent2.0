import * as React from 'react';
import * as Router from 'react-router';
import { Route, IndexRoute } from 'react-router';

var Settings = require('./constraints/settings.json');

import NoMatchComponent from './components/nomatch.component';
import AppComponent from './components/app.component';
import TreesComponent from './components/trees/trees.component';
import DonationsComponent from './components/donations/donations.component';
import LoginComponent from './components/parent/login.component';
import ScreenshotComponent from './components/screenshot/screenshot.component';


var RouteMap = (
    <Route path={Settings.uBaseNameForWebPack} component={AppComponent}>
        <IndexRoute component={TreesComponent} />
        <Route path="tree/:treeId" component={TreesComponent} />
        <Route path="donations" component={DonationsComponent} />
        <Route path="donation/:locationId" component={DonationsComponent} />
        <Route path="screenshot/:treeId" component={ScreenshotComponent} />
        <Route path="*" component={NoMatchComponent}/>
    </Route>
);

export default RouteMap;
