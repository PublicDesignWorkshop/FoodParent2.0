import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as styles from './tree-ownership.component.css';
var Settings = require('./../../constraints/settings.json');

import { TreeModel } from './../../stores/tree.store';
import { treeActions } from './../../actions/tree.actions';

import { ISelectOption } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface ITreeOwnershipProps {
  tree: TreeModel;
  editable: boolean;
  async: boolean;
}
export interface ITreeOwnershipStatus {
  options?: Array<ISelectOption>;
  selected?: ISelectOption;
}

export default class TreeOwnershipComponent extends React.Component<ITreeOwnershipProps, ITreeOwnershipStatus> {
  constructor(props : ITreeOwnershipProps) {
    super(props);
    let self: TreeOwnershipComponent = this;
    this.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: TreeOwnershipComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreeOwnershipComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreeOwnershipProps) {
    let self: TreeOwnershipComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: ITreeOwnershipProps) {
    let self: TreeOwnershipComponent = this;
    if (props.tree) {
      let options = new Array<ISelectOption>();
      options.push({value: 0, label: localization(974)});
      options.push({value: 1, label: localization(975)});
      let selected: ISelectOption;
      if (self.props.tree.getOwnership() == 0) {
        selected = options[0];
      } else {
        selected = options[1];
      }
      self.setState({options: options, selected: selected});
    }
  }

  private updateAttribute = (selected) => {
    let self: TreeOwnershipComponent = this;
    var ownership = 0;
    if (selected) {
      ownership = parseInt(selected.value);
    }
    self.props.tree.setOwnership(ownership);
    if (self.props.async) {
      treeActions.updateTree(self.props.tree);
    } else {
      self.setState({selected: selected});
    }
  }

  render() {
    let self: TreeOwnershipComponent = this;
    if (self.props.editable) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='home' /> {localization(977)}
          </div>
          <div className={styles.name}>
            <Select name="ownership-select" multi={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder={localization(976)} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='home' /> {localization(977)}
          </div>
          <div className={styles.name}>
            <Select name="ownership-select" multi={false} disabled searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder={localization(976)} />
          </div>
        </div>
      );
    }
  }
}
