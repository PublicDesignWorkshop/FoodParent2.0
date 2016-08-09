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
    if (this.state.open) {
      open = " slidein";
    }
    return (
      <div className={"tree-panel-wrapper" + open}>
        <div className="left">
          <TreeControl />
        </div>
        <div className="right">
        </div>
      </div>
    );
  }
}
