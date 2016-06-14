import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './filter-rate.component.css';
var Settings = require('./../../constraints/settings.json');

import { treeActions } from './../../actions/tree.actions';

import { resetFilter, readFilter, applyFilter, FilterMode } from './../../utils/filter';
import { ISelectOption } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface IFilterRateProps {

}
export interface IFilterRateStatus {
  options?: Array<ISelectOption>;
  selected?: Array<ISelectOption>;
}

export default class FilterRateComponent extends React.Component<IFilterRateProps, IFilterRateStatus> {
  private bFirstLoad: boolean;
  constructor(props : IFilterRateProps) {
    super(props);
    let self: FilterRateComponent = this;
    self.bFirstLoad = true;
    self.state = {
      options: null,
      selected: null,
    };
  }

  public componentDidMount() {
    let self: FilterRateComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: FilterRateComponent = this;
  }

  public componentWillReceiveProps (nextProps: IFilterRateProps) {
    let self: FilterRateComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IFilterRateProps) {
    let self: FilterRateComponent = this;
    if (self.bFirstLoad) {
      self.bFirstLoad = false;
      readFilter(function(response) {
        let rates: Array<number> = response.rates.split(",").map(function(item) {
          return parseInt(item);
        });
        var selected = new Array<ISelectOption>();
        rates.forEach(rate => {
          if (rate == 0) {
            selected.push({value: 0, label: localization(936)});
          } else if (rate == 1) {
            selected.push({value: 1, label: localization(937)});
          } else if (rate == 2) {
            selected.push({value: 2, label: localization(938)});
          } else if (rate == 3) {
            selected.push({value: 3, label: localization(939)});
          } else if (rate == 4) {
            selected.push({value: 4, label: localization(940)});
          } else if (rate == 5) {
            selected.push({value: 5, label: localization(941)});
          }
        });
        self.setState({selected: selected});
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    }
    var options = new Array<ISelectOption>();
    options.push({value: 0, label: localization(936)});
    options.push({value: 1, label: localization(937)});
    options.push({value: 2, label: localization(938)});
    options.push({value: 3, label: localization(939)});
    options.push({value: 4, label: localization(940)});
    options.push({value: 5, label: localization(941)});
    self.setState({options: options});
  }

  private updateAttribute = (selected) => {
    let self: FilterRateComponent = this;
    self.setState({selected: selected});
    var rates = new Array<number>();
    if (selected) {
      selected.forEach(option => {
        rates.push(parseInt(option.value));
      });
      applyFilter(FilterMode.RATE, rates, function(response) {
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    } else {
      applyFilter(FilterMode.RATE, new Array<number>(), function(response) {
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    }
  }

  private resetAttribute = () => {
    let self: FilterRateComponent = this;
    resetFilter(function(response) {
      let rates: Array<number> = response.rates.split(",").map(function(item) {
        return parseInt(item);
      });
      var selected = new Array<ISelectOption>();
      rates.forEach(rate => {
        if (rate == 0) {
          selected.push({value: 0, label: localization(936)});
        } else if (rate == 1) {
          selected.push({value: 1, label: localization(937)});
        } else if (rate == 2) {
          selected.push({value: 2, label: localization(938)});
        } else if (rate == 3) {
          selected.push({value: 3, label: localization(939)});
        } else if (rate == 4) {
          selected.push({value: 4, label: localization(940)});
        } else if (rate == 5) {
          selected.push({value: 5, label: localization(941)});
        }
      });
      self.setState({selected: selected});
      treeActions.fetchTrees();
    }, function(response) {

    }, function(response) {

    });
  }

  renderOptionValue(option): JSX.Element {
    let stars: Array<JSX.Element> = new Array<JSX.Element>();
    for (let i=0; i <5; i++) {
      if (i >= option.value) {
        stars.push(<FontAwesome key={"star" + i} className='' name='star-o' />);
      } else {
        stars.push(<FontAwesome key={"star" + i} className='' name='star' />);
      }
    }
    return (<span>{stars}<span>{" (" + option.label + ")"}</span></span>);
  }

  render() {
    let self: FilterRateComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.label}>
          <FontAwesome className='' name='star' /> {localization(670)}
        </div>
        <div className={styles.value}>
          <Select name="rate-select" multi={true} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} valueRenderer={self.renderOptionValue} optionRenderer={self.renderOptionValue} placeholder={localization(671)} />
        </div>
      </div>
    );
  }
}
