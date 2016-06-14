import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './filter-flag.component.css';
var Settings = require('./../../constraints/settings.json');

import { FlagModel, flagStore } from './../../stores/flag.store';
import { treeActions } from './../../actions/tree.actions';

import { resetFilter, readFilter, applyFilter, FilterMode } from './../../utils/filter';
import { ISelectOption } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface IFilterFlagProps {
  flags: Array<FlagModel>;
}
export interface IFilterFlagStatus {
  options?: Array<ISelectOption>;
  selected?: Array<ISelectOption>;
}

export default class FilterFlagComponent extends React.Component<IFilterFlagProps, IFilterFlagStatus> {
  private bFirstLoad: boolean;
  constructor(props : IFilterFlagProps) {
    super(props);
    let self: FilterFlagComponent = this;
    self.bFirstLoad = true;
    self.state = {
      options: null,
      selected: null,
    };
  }

  public componentDidMount() {
    let self: FilterFlagComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: FilterFlagComponent = this;
  }

  public componentWillReceiveProps (nextProps: IFilterFlagProps) {
    let self: FilterFlagComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IFilterFlagProps) {
    let self: FilterFlagComponent = this;
    if (props.flags.length > 0) {
      if (self.bFirstLoad) {
        self.bFirstLoad = false;
        readFilter(function(response) {
          let flags: Array<number> = response.flags.split(",").map(function(item) {
            return parseInt(item);
          });
          var selected = new Array<ISelectOption>();
          flags.forEach(flagId => {
            if (flagId == 0) {
              selected.push({value: 0, label: "*unknown"});
            } else if (flagId != -1) {
              let label: string = "";
              let flag = flagStore.getFlag(flagId);
              if (flag) {
                label = flag.getName();
              }
              selected.push({value: flagId, label: label});
            }
          });
          self.setState({selected: selected});
          treeActions.fetchTrees();
        }, function(response) {

        }, function(response) {

        });
      }

      var options = new Array<ISelectOption>();
      options.push({value: 0, label: "*unknown"})
      props.flags.forEach(flag => {
        options.push({value: flag.getId(), label: flag.getName()});
      });
      self.setState({options: options});
    }
  }

  private updateAttribute = (selected) => {
    let self: FilterFlagComponent = this;
    self.setState({selected: selected});
    var flags = new Array<number>();
    if (selected) {
      selected.forEach(option => {
        flags.push(parseInt(option.value));
      });
      applyFilter(FilterMode.FLAG, flags, function(response) {
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    } else {
      applyFilter(FilterMode.FLAG, new Array<number>(), function(response) {
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    }
  }

  private resetAttribute = () => {
    let self: FilterFlagComponent = this;
    resetFilter(function(response) {
      let flags: Array<number> = response.flags.split(",").map(function(item) {
        return parseInt(item);
      });
      var selected = new Array<ISelectOption>();
      flags.forEach(flagId => {
        if (flagId != 0) {
          let label: string = flagStore.getFlag(flagId).getName();
          selected.push({value: flagId, label: label});
        }
      });
      self.setState({selected: selected});
      treeActions.fetchTrees();
    }, function(response) {

    }, function(response) {

    });
  }

  render() {
    let self: FilterFlagComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.label}>
          <FontAwesome className='' name='tags' /> {localization(969)}
        </div>
        <div className={styles.value}>
          <Select name="flag-select" multi={true} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select flag types..." />
        </div>
      </div>
    );
  }
}
