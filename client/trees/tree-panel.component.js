import React from 'react';

let ServerSetting = require('./../../setting/server.json');
require('./tree-panel.component.scss');
var FontAwesome = require('react-fontawesome');

import TreeControl from './tree-control.component';

export default class TreePanel extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    this.setState({open: false, wide: false});
  }
  componentDidMount () {
    this.updateProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    this.setState({open: props.open});
  }
  render () {
    let open = "";
    let wide = "";
    if (this.state.open) {
      open = " open";
    }
    let menu = <div className="menu">
      <div className="icon-group wide-landscape" onClick={()=> {
        this.setState({wide: true});
      }}>
        <FontAwesome className="icon" name='arrow-circle-o-left' />
        <span className="icon-text">
          Expand
        </span>
      </div>
      <div className="icon-group">
        <FontAwesome className="icon icon-info-circle" name='info-circle' />
        <span className="icon-text">
          Info
        </span>
      </div>
      <div className="icon-group">
        <FontAwesome className="icon icon-group" name='group' />
        <span className="icon-text">
          Parent
        </span>
      </div>
      <div className="icon-group">
        <FontAwesome className="icon icon-line-chart" name='line-chart' />
        <span className="icon-text">
          Status
        </span>
      </div>
      <div className="icon-group close" onClick={() => {
        this.context.router.push({pathname: ServerSetting.uBase + '/'});
      }}>
        <FontAwesome className="icon" name='close' />
      </div>
    </div>
    if (this.state.wide) {
      wide = " wide";
      menu = <div className="menu">
        <div className="icon-group wide-landscape" onClick={()=> {
          this.setState({wide: false});
        }}>
          <FontAwesome className="icon" name='arrow-circle-o-right' />
          <span className="icon-text visible">
            Collapse
          </span>
        </div>
        <div className="icon-group close" onClick={() => {
          this.context.router.push({pathname: ServerSetting.uBase + '/'});
        }}>
          <FontAwesome className="icon" name='close' />
        </div>
      </div>
    }
    return (
      <div className={"tree-panel-wrapper" + open + wide}>
        <div className="left">
          <TreeControl />
        </div>
        <div className="right">
          {menu}
        </div>
      </div>
    );
  }
}
TreePanel.contextTypes = {
    router: React.PropTypes.object.isRequired
}
