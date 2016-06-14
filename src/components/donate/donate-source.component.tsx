import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';


import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as styles from './donate-source.component.css';
var Settings = require('./../../constraints/settings.json');

import MessageLineComponent from './../message/message-line.component';

import { TreeModel } from './../../stores/tree.store';
import { DonateModel } from './../../stores/donate.store';
import { donateActions } from './../../actions/donate.actions';

import { applyFilter, FilterMode, deleteFilter } from './../../utils/filter';
import { ISelectOption } from './../../utils/enum';
import { localization } from './../../constraints/localization';


export interface IDonateSourceProps {
  donate: DonateModel;
  editable: boolean;
  async: boolean;
  trees?: Array<TreeModel>;
}
export interface IDonateSourceStatus {
  options?: Array<ISelectOption>;
  selected?: Array<ISelectOption>;
}
export default class DonateSourceComponent extends React.Component<IDonateSourceProps, IDonateSourceStatus> {
  constructor(props : IDonateSourceProps) {
    super(props);
    let self: DonateSourceComponent = this;
    this.state = {

    };
  }
  public componentDidMount() {
    let self: DonateSourceComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: DonateSourceComponent = this;
  }
  public componentWillReceiveProps (nextProps: IDonateSourceProps) {
    let self: DonateSourceComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps(props: IDonateSourceProps) {
    let self: DonateSourceComponent = this;
    if (props.donate && props.trees) {
      let options = new Array<ISelectOption>();
      let selected = new Array<ISelectOption>();
      props.trees.forEach(tree => {
        options.push({value: tree.getId(), label: tree.getName()});
        if ($.inArray(tree.getId(), props.donate.getTrees()) > -1) {
          selected.push({value: tree.getId(), label: tree.getName()});
        }
      });
      self.setState({options: options, selected: selected});
    }
  }
  private updateAttribute = (selected?: any) => {
    let self: DonateSourceComponent = this;
    self.setState({selected: selected});
    var trees = new Array<number>();
    if (selected) {
      selected.forEach(option => {
        trees.push(parseInt(option.value));
      });
      if (self.props.donate.getId() == 0) {
        donateActions.setTempDonateSource(trees);
      } else {
        donateActions.setDonateSource(self.props.donate.getId(), trees);
      }
    } else {
      if (self.props.donate.getId() == 0) {
        donateActions.setTempDonateSource([]);
      } else {
        donateActions.setDonateSource(self.props.donate.getId(), []);
      }
    }
  }

  render() {
    let self: DonateSourceComponent = this;
    if (self.props.editable || self.props.donate.getId() == 0) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='mail-forward' /> {localization(610)}
          </div>
          <div className={styles.edit}>
            <div className={styles.type}>
              <Select name="tree-select" multi={true} searchable={true} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder={localization(611)} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
        </div>
      );
    }
  }
}
