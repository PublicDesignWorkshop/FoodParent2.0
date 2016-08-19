import React from 'react';
import $ from 'jquery';


let ServerSetting = require('./../../setting/server.json');
require('./tree-filter-panel.component.scss');
require('./../message/popup.component.scss');
var FontAwesome = require('react-fontawesome');
import { TREEADDMODE } from './../utils/enum';
let TreeActions = require('./../actions/tree.actions');

import TreeFilter from './../filter/tree-filter.component';
import TreeControl from './tree-control.component';

export default class TreeFilterPanel extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    // this.setState({open: false});
  }
  componentDidMount () {
    // this.updateProps(this.props);
    $(document).on('keyup',function(event) {
      if (event.keyCode == 27) {
        this.context.router.push({pathname: ServerSetting.uBase + '/'});
      }
    }.bind(this));
  }
  componentWillUnmount() {
    $(document).off('keyup');
  }
  componentWillReceiveProps(nextProps) {
    // this.updateProps(nextProps);
  }
  updateProps(props) {
    // this.setState({open: props.open});
  }
  render () {
    let open = "";
    if (this.props.open) {
      open = " open";
    }
    let info, close, body;
    // Close
    close = <div className="icon-group close" onClick={() => {
      TreeActions.setCode(0);
      this.context.router.push({pathname: ServerSetting.uBase + '/'});
    }}>
      <FontAwesome className="icon" name='close' />
    </div>;
    // Info
    info = <div className="icon-group active">
      <FontAwesome className="icon icon-info-circle" name='sliders' />
      <span className="icon-text">
        Tree Filter
      </span>
    </div>;
    // Body
    body = <TreeFilter />;
    return (
      <div className={"tree-filter-panel-wrapper" + open}>
        <div className="left">
          <TreeControl />
        </div>
        <div className="right">
          <div className="menu">
            {info}
            {close}
          </div>
          {body}
        </div>
      </div>
    );
  }
}
TreeFilterPanel.contextTypes = {
    router: React.PropTypes.object.isRequired
}
