import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';

var Settings = require('./../../constraints/settings.json');
import * as styles from './filter-flag.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { FlagModel, flagStore } from './../../stores/flag.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { resetFilter, readFilter, applyFilter, FilterMode } from './../../utils/filter';

export interface IFilterFlagOption {
  value: number;
  label: string;
}

export interface IFilterFlagProps {
  flags: Array<FlagModel>;
}
export interface IFilterFlagStatus {
  options?: Array<IFilterFlagOption>;
  selected?: Array<IFilterFlagOption>;
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
          var selected = new Array<IFilterFlagOption>();
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
          console.log(selected);
          self.setState({selected: selected});
          treeStore.fetchTrees();
        }, function(response) {

        }, function(response) {

        });
      }

      var options = new Array<IFilterFlagOption>();
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
        treeStore.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    } else {
      applyFilter(FilterMode.FLAG, new Array<number>(), function(response) {
        treeStore.fetchTrees();
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
      var selected = new Array<IFilterFlagOption>();
      flags.forEach(flagId => {
        if (flagId != 0) {
          let label: string = flagStore.getFlag(flagId).getName();
          selected.push({value: flagId, label: label});
        }
      });
      self.setState({selected: selected});
      treeStore.fetchTrees();
    }, function(response) {

    }, function(response) {

    });
  }

  render() {
    let self: FilterFlagComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.label} onMouseUp={()=> {
          // if (self.props.editable) {
          //   self.setState({editing: true});
          // }
        }}>
          <FontAwesome className='' name='apple ' /> Flag Types
        </div>
        <div className={styles.value}>
          <Select name="flag-select" multi={true} searchable={true} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select flag types..." />
        </div>
      </div>
    );
  }
}
