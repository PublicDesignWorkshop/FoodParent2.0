import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as styles from './tree-flag.component.css';
var Settings = require('./../../constraints/settings.json');

import { TreeModel } from './../../stores/tree.store';
import { treeActions } from './../../actions/tree.actions';
import { FlagModel } from './../../stores/flag.store';

import { localization } from './../../constraints/localization';
import { ISelectOption } from './../../utils/enum';

export interface ITreeFlagProps {
  tree: TreeModel;
  flags: Array<FlagModel>;
  editable: boolean;
  async: boolean;
}
export interface ITreeFlagStatus {
  options?: Array<ISelectOption>;
  selected?: Array<ISelectOption>;
}

export default class TreeFlagComponent extends React.Component<ITreeFlagProps, ITreeFlagStatus> {
  constructor(props : ITreeFlagProps) {
    super(props);
    let self: TreeFlagComponent = this;
    this.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: TreeFlagComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreeFlagComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreeFlagProps) {
    let self: TreeFlagComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: ITreeFlagProps) {
    let self: TreeFlagComponent = this;
    if (props.tree && props.flags) {
      var options = new Array<ISelectOption>();
      var selected = new Array<ISelectOption>();
      props.flags.forEach(flag => {
        options.push({value: flag.getId(), label: flag.getName()});
        if ($.inArray(flag.getId(), self.props.tree.getFlags()) != -1) {
          selected.push({value: flag.getId(), label: flag.getName()});
        }
      });
      self.setState({options: options, selected: selected});
    }
  }

  private updateAttribute = (selected) => {
    let self: TreeFlagComponent = this;
    var flags = new Array<number>();
    if (selected) {
      selected.forEach(option => {
        flags.push(parseInt(option.value));
      });
    }
    self.props.tree.setFlags(flags);
    if (self.props.async) {
      treeActions.updateTree(self.props.tree);
    } else {
      self.setState({selected: selected});
    }
  }

  render() {
    let self: TreeFlagComponent = this;
    if (self.props.editable) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='tags' /> {localization(969)}
          </div>
          <div className={styles.name}>
            <Select name="flag-select" multi={true} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder={localization(970)} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='tags' /> {localization(969)}
          </div>
          <div className={styles.name}>
            <Select name="flag-select" multi={true} disabled searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder={localization(970)} />
          </div>
        </div>
      );
    }
  }
}
