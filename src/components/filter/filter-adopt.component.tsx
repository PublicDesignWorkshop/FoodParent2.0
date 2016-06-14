import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './filter-adopt.component.css';
var Settings = require('./../../constraints/settings.json');

import { authStore } from './../../stores/auth.store';
import { treeActions } from './../../actions/tree.actions';

import { resetFilter, readFilter, applyFilter, FilterMode } from './../../utils/filter';
import { ISelectOption } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface IFilterAdoptProps {

}
export interface IFilterAdoptStatus {
  options?: Array<ISelectOption>;
  selected?: ISelectOption;
}

export default class FilterAdoptComponent extends React.Component<IFilterAdoptProps, IFilterAdoptStatus> {
  private bFirstLoad: boolean;
  constructor(props : IFilterAdoptProps) {
    super(props);
    let self: FilterAdoptComponent = this;
    self.bFirstLoad = true;
    self.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: FilterAdoptComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: FilterAdoptComponent = this;
  }
  public componentWillReceiveProps (nextProps: IFilterAdoptProps) {
    let self: FilterAdoptComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IFilterAdoptProps) {
    let self: FilterAdoptComponent = this;
    if (self.bFirstLoad) {
      self.bFirstLoad = false;
      setTimeout(function() {
        readFilter(function(response) {
          let adopts: Array<number> = response.adopt.split(",").map(function(item) {
            return parseInt(item);
          });
          var selected: ISelectOption;
          adopts.forEach(adoptId => {
            if (adoptId == 0) {
              selected = {value: 0, label: localization(631)};
            } else if (adoptId == 1) {
              selected ={value: 1, label: localization(630)};
            } else if (adoptId == 2) {
              selected = {value: 2, label: localization(629)};
            } else if (adoptId == 3) {
              selected = {value: 3, label: localization(628)};
            }
          });
          self.setState({selected: selected});
          treeActions.fetchTrees();
        }, function(response) {

        }, function(response) {

        });
      }, 500);
    }

    var options = new Array<ISelectOption>();
    if (!authStore.getAuth().getIsGuest()) {
      options.push({value: 0, label: localization(631)});
      options.push({value: 1, label: localization(630)});
      options.push({value: 2, label: localization(629)});
      options.push({value: 3, label: localization(628)});
    } else {
      options.push({value: 0, label: localization(631)});
      options.push({value: 2, label: localization(629)});
      options.push({value: 3, label: localization(628)});
    }
    self.setState({options: options});
  }

  private updateAttribute = (selected) => {
    let self: FilterAdoptComponent = this;
    self.setState({selected: selected});
    var adopts = new Array<number>();
    adopts.push(selected.value);
    if (selected) {
      applyFilter(FilterMode.ADOPT, adopts, function(response) {
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    } else {
      applyFilter(FilterMode.ADOPT, new Array<number>(), function(response) {
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    }
  }

  render() {
    let self: FilterAdoptComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.label}>
          <FontAwesome className='' name='chain' /> {localization(632)}
        </div>
        <div className={styles.value}>
          <Select name="adopt-select" multi={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder={localization(627)} />
        </div>
      </div>
    );
  }
}
