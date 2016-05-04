import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';

var Settings = require('./../../constraints/settings.json');
import * as styles from './ownership.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';

export interface IOwnsershipOption {
  value: number;
  label: string;
}

export interface IOwnsershipProps {
  tree: TreeModel;
  editable: boolean;
}
export interface IOwnsershipStatus {
  options: Array<IOwnsershipOption>;
  selected: IOwnsershipOption;
}

export default class OwnsershipComponent extends React.Component<IOwnsershipProps, IOwnsershipStatus> {
  constructor(props : IOwnsershipProps) {
    super(props);
    let self: OwnsershipComponent = this;
    this.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: OwnsershipComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: OwnsershipComponent = this;
  }
  public componentWillReceiveProps (nextProps: IOwnsershipProps) {
    let self: OwnsershipComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IOwnsershipProps) {
    let self: OwnsershipComponent = this;
    if (props.tree) {
      let options = new Array<IOwnsershipOption>();
      options.push({value: 0, label: "private"});
      options.push({value: 1, label: "public"});
      let selected: IOwnsershipOption;
      if (self.props.tree.getOwnership() == 0) {
        selected = options[0];
      } else {
        selected = options[1];
      }
      self.setState({options: options, selected: selected});
    }
  }

  private updateAttribute = (selected) => {
    let self: OwnsershipComponent = this;
    var pub = 0;
    if (selected) {
      pub = parseInt(selected.value);
    }
    self.props.tree.setOwnership(pub);
    treeStore.updateTree(self.props.tree);
  }

  render() {
    let self: OwnsershipComponent = this;
    if (self.props.editable) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='home' /> Public
          </div>
          <div className={styles.name}>
            <Select name="public-select" multi={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select ownerships..." />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='home' /> Public
          </div>
          <div className={styles.name}>
            <Select name="public-select" multi={false} disabled searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select ownerships..." />
          </div>
        </div>
      );
    }
  }
}
