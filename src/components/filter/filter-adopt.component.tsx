import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';

var Settings = require('./../../constraints/settings.json');
import * as styles from './filter-adopt.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { resetFilter, readFilter, applyFilter, FilterMode } from './../../utils/filter';
import { LogInStatus } from './../app.component';

export interface IFilterAdoptOption {
  value: number;
  label: string;
}

export interface IFilterAdoptProps {
  login: LogInStatus;
}
export interface IFilterAdoptStatus {
  options?: Array<IFilterAdoptOption>;
  selected?: IFilterAdoptOption;
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
          var selected: IFilterAdoptOption;
          adopts.forEach(adoptId => {
            if (adoptId == 0) {
              selected = {value: 0, label: "All"};
            } else if (adoptId == 1) {
              selected ={value: 1, label: "My Trees"};
            } else if (adoptId == 2) {
              selected = {value: 2, label: "Adopted"};
            } else if (adoptId == 3) {
              selected = {value: 3, label: "Unadopted"};
            }
          });
          self.setState({selected: selected});
          treeStore.fetchTrees();
        }, function(response) {

        }, function(response) {

        });
      }, 500);
    }

    var options = new Array<IFilterAdoptOption>();
    if (self.props.login == LogInStatus.ADMIN || self.props.login == LogInStatus.MANAGER) {
      options.push({value: 0, label: "All"});
      options.push({value: 1, label: "My Trees"});
      options.push({value: 2, label: "Adopted"});
      options.push({value: 3, label: "Unadopted"});
    } else {
      options.push({value: 0, label: "All"});
      options.push({value: 2, label: "Adopted"});
      options.push({value: 3, label: "Unadopted"});
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
        treeStore.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    } else {
      applyFilter(FilterMode.ADOPT, new Array<number>(), function(response) {
        treeStore.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    }
  }

  render() {
    let self: FilterAdoptComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.label} onMouseUp={()=> {
          // if (self.props.editable) {
          //   self.setState({editing: true});
          // }
        }}>
          <FontAwesome className='' name='chain' /> Adopt Types
        </div>
        <div className={styles.value}>
          <Select name="adopt-select" multi={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select adopt types..." />
        </div>
      </div>
    );
  }
}
