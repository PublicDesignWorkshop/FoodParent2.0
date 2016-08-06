import React from 'react';

require('./tree-panel.component.scss');

import TreeControl from './tree-control.component';

export default class TreePanel extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    this.setState({open: false});
  }
  componentDidMount () {

  }
  componentWillReceiveProps() {

  }
  render () {
    return (
      <div className="tree-panel-wrapper">
        <div className="left">
          <TreeControl />
        </div>
        <div className="right">
        </div>
      </div>
    );
  }
}
