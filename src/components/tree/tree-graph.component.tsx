import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';

var Settings = require('./../../constraints/settings.json');
import * as styles from './tree-graph.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { FlagModel, flagStore } from './../../stores/flag.store';

export interface ITreeGraphOption {
  value: number;
  label: string;
}

export interface ITreeGraphProps {
  tree?: TreeModel;
  flags?: Array<FlagModel>;
}
export interface ITreeGraphStatus {

}

export default class TreeGraphComponent extends React.Component<ITreeGraphProps, ITreeGraphStatus> {
  constructor(props : ITreeGraphProps) {
    super(props);
    let self: TreeGraphComponent = this;
    this.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: TreeGraphComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreeGraphComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreeGraphProps) {
    let self: TreeGraphComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: ITreeGraphProps) {
    let self: TreeGraphComponent = this;
  }

  render() {
    let self: TreeGraphComponent = this;
    return (
      <div className={styles.wrapper}>
        GRAPH
      </div>
    )
  }
}
