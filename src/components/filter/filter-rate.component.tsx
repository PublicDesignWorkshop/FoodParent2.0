import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';

var Settings = require('./../../constraints/settings.json');
import * as styles from './filter-rate.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { resetFilter, readFilter, applyFilter, FilterMode } from './../../utils/filter';
import { treeActions } from './../../actions/tree.actions';

export interface IFilterRateOption {
  value: number;
  label: string;
}

export interface IFilterRateProps {

}
export interface IFilterRateStatus {
  options?: Array<IFilterRateOption>;
  selected?: Array<IFilterRateOption>;
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
        var selected = new Array<IFilterRateOption>();
        rates.forEach(rate => {
          if (rate == 0) {
            selected.push({value: 0, label: "☆☆☆☆☆ (Initial State)"});
          } else if (rate == 1) {
            selected.push({value: 1, label: "★☆☆☆☆"});
          } else if (rate == 2) {
            selected.push({value: 2, label: "★★☆☆☆"});
          } else if (rate == 3) {
            selected.push({value: 3, label: "★★★☆☆"});
          } else if (rate == 4) {
            selected.push({value: 4, label: "★★★★☆"});
          } else if (rate == 5) {
            selected.push({value: 5, label: "★★★★★ (Fully Grown)"});
          }
        });
        self.setState({selected: selected});
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    }

    var options = new Array<IFilterRateOption>();
    options.push({value: 0, label: "☆☆☆☆☆ (Initial State)"});
    options.push({value: 1, label: "★☆☆☆☆"});
    options.push({value: 2, label: "★★☆☆☆"});
    options.push({value: 3, label: "★★★☆☆"});
    options.push({value: 4, label: "★★★★☆"});
    options.push({value: 5, label: "★★★★★ (Fully Grown)"});
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
      var selected = new Array<IFilterRateOption>();
      rates.forEach(rate => {
        if (rate == 0) {
          selected.push({value: 0, label: "☆☆☆☆☆ (Initial State)"});
        } else if (rate == 1) {
          selected.push({value: 1, label: "★☆☆☆☆"});
        } else if (rate == 2) {
          selected.push({value: 2, label: "★★☆☆☆"});
        } else if (rate == 3) {
          selected.push({value: 3, label: "★★★☆☆"});
        } else if (rate == 4) {
          selected.push({value: 4, label: "★★★★☆"});
        } else if (rate == 5) {
          selected.push({value: 5, label: "★★★★★ (Fully Grown)"});
        }
      });
      self.setState({selected: selected});
      treeActions.fetchTrees();
    }, function(response) {

    }, function(response) {

    });
  }

  render() {
    let self: FilterRateComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.label} onMouseUp={()=> {
          // if (self.props.editable) {
          //   self.setState({editing: true});
          // }
        }}>
          <FontAwesome className='' name='star' /> Rates
        </div>
        <div className={styles.value}>
          <Select name="rate-select" multi={true} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select rate types..." />
        </div>
      </div>
    );
  }
}
