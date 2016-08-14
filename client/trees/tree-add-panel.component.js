import React from 'react';
import $ from 'jquery';


let ServerSetting = require('./../../setting/server.json');
require('./tree-add-panel.component.scss');
require('./../message/popup.component.scss');
var FontAwesome = require('react-fontawesome');
import { TREEADDMODE } from './../utils/enum';
let TreeActions = require('./../actions/tree.actions');

import TreeAddInfo from './../tree/tree-add-info.component';
import TreeControl from './tree-control.component';

export default class TreeAddPanel extends React.Component {
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
    info = <div className="icon-group" onClick={() => {
      this.context.router.push({pathname: ServerSetting.uBase + '/addtree', hash: "#info"});
    }}>
      <FontAwesome className="icon icon-info-circle" name='info-circle' />
      <span className="icon-text">
        Info
      </span>
    </div>;
    if (this.props.mode == TREEADDMODE.INFO) {
      // Info
      info = <div className="icon-group active">
        <FontAwesome className="icon icon-info-circle" name='info-circle' />
        <span className="icon-text">
          New Tree Info
        </span>
      </div>;
      body = <TreeAddInfo />;
    }
    return (
      <div className={"tree-add-panel-wrapper" + open}>
        <div className="left">
          <TreeControl adding={true} />
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
TreeAddPanel.contextTypes = {
    router: React.PropTypes.object.isRequired
}
