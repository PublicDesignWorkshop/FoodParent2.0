import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';

var Settings = require('./../../constraints/settings.json');
import * as styles from './filter-ownership.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { resetFilter, readFilter, applyFilter, FilterMode } from './../../utils/filter';
import { treeActions } from './../../actions/tree.actions';

export interface IFilterOwnershipOption {
  value: number;
  label: string;
}

export interface IFilterOwnershipProps {

}
export interface IFilterOwnershipStatus {
  options?: Array<IFilterOwnershipOption>;
  selected?: Array<IFilterOwnershipOption>;
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
        var selected = new Array<IFilterOwnershipOption>();
        ownerships.forEach(ownershipId => {
          if (ownershipId == 0) {
            selected.push({value: 0, label: "private"});
          } else if (ownershipId == 1) {
            selected.push({value: 1, label: "public"});
          }
        });
        self.setState({selected: selected});
        treeActions.fetchTrees();
      }, function(response) {

      }, function(response) {

      });
    }

    var options = new Array<IFilterOwnershipOption>();
    options.push({value: 0, label: "private"});
    options.push({value: 1, label: "public"});
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
      var selected = new Array<IFilterOwnershipOption>();
      ownerships.forEach(ownershipId => {
        if (ownershipId == 0) {
          selected.push({value: 0, label: "private"});
        } else if (ownershipId == 1) {
          selected.push({value: 1, label: "public"});
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
        <div className={styles.label} onMouseUp={()=> {
          // if (self.props.editable) {
          //   self.setState({editing: true});
          // }
        }}>
          <FontAwesome className='' name='home' /> Ownership Types
        </div>
        <div className={styles.value}>
          <Select name="ownership-select" multi={true} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select ownership types..." />
        </div>
      </div>
    );
  }
}
