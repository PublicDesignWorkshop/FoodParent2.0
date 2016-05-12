import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, browserHistory  } from 'react-router';
import Routes from './routes';

import './client.css';
import './bootstrap-datetimepicker.css';
ReactDOM.render(<Router history={browserHistory}>{Routes}</Router>, document.getElementById('app'));
