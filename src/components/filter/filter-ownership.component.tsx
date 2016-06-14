import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './filter-ownership.component.css';
var Settings = require('./../../constraints/settings.json');

import { treeActions } from './../../actions/tree.actions';

import { resetFilter, readFilter, applyFilter, FilterMode } from './../../utils/filter';
import { ISelectOption } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface IFilterOwnershipProps {

}
export interface IFilterOwnershipStatus {
  options?: Array<ISelectOption>;
  selected?: Array<ISelectOption>;
}

export default class FilterOwnershipComponent extends React.Component<IFilterOwnershipProps, IFilterOwnershipStatus> {
  private bFirstLoad: boolean;
  constructor(props : IFilterOwnershipProps) {
    super(props);
    let self: FilterOwnershipComponent = this;
    self.bFirstLoad = true;
    self.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: FilterOwnershipComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: FilterOwnershipComponent = this;
  }
  public componentWillReceiveProps (nextProps: IFilterOwnershipProps) {
    let self: FilterOwnershipComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IFilterOwnershipProps) {
    let self: FilterOwnershipComponent = this;
    if (self.bFirstLoad) {
      self.bFirstLoad = false;
      readFilter(function(response) {
        let ownerships: Array<number> = response.ownerships.split(",").map(function(item) {
          return parseInt(item);
        });
        var selected = new Array<ISelectOption>();
        ownerships.forEach(ownershipId => {
          if (ownershipId == 0) {
            selected.push({value: 0, label: localization(974)});
          } else if (ownershipId == 1) {
            selected.push({value: 1, label: localization(975)});
          }
        });
        self.setState({selected: selected});
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    }

    var options = new Array<ISelectOption>();
    options.push({value: 0, label: localization(974)});
    options.push({value: 1, label: localization(975)});
    self.setState({options: options});
  }

  private updateAttribute = (selected) => {
    let self: FilterOwnershipComponent = this;
    self.setState({selected: selected});
    var ownerships = new Array<number>();
    if (selected) {
      selected.forEach(option => {
        ownerships.push(parseInt(option.value));
      });
      applyFilter(FilterMode.OWNERSHIP, ownerships, function(response) {
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    } else {
      applyFilter(FilterMode.OWNERSHIP, new Array<number>(), function(response) {
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    }
  }

  private resetAttribute = () => {
    let self: FilterOwnershipComponent = this;
    resetFilter(function(response) {
      let ownerships: Array<number> = response.ownerships.split(",").map(function(item) {
        return parseInt(item);
      });
      var selected = new Array<ISelectOption>();
      ownerships.forEach(ownershipId => {
        if (ownershipId == 0) {
          selected.push({value: 0, label: localization(974)});
        } else if (ownershipId == 1) {
          selected.push({value: 1, label: localization(975)});
        }
      });
      self.setState({selected: selected});
      treeActions.fetchTrees();
    }, function(response) {

    }, function(response) {

    });
  }

  render() {
    let self: FilterOwnershipComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.label}>
          <FontAwesome className='' name='home' /> {localization(977)}
        </div>
        <div className={styles.value}>
          <Select name="ownership-select" multi={true} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder={localization(976)} />
        </div>
      </div>
    );
  }
}
