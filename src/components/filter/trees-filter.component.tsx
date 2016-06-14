import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as moment from 'moment';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './trees-filter.component.css';
var Settings = require('./../../constraints/settings.json');

import FilterFoodComponent from './filter-food.component';
import FilterFlagComponent from './filter-flag.component';
import FilterOwnershipComponent from './filter-ownership.component';
import FilterAdoptComponent from './filter-adopt.component';
import FilterRateComponent from './filter-rate.component';

import { TreeModel } from './../../stores/tree.store';
import { FoodModel } from './../../stores/food.store';
import { FlagModel } from './../../stores/flag.store';
import { authStore } from './../../stores/auth.store';

export interface ITreesFilterProps {
  foods: Array<FoodModel>;
  trees: Array<TreeModel>;
  flags?: Array<FlagModel>;
}
export interface ITreesFilterStatus {
  userId?: number;
  open?: boolean;
}

export default class TreesFilterComponent extends React.Component<ITreesFilterProps, ITreesFilterStatus> {
  static contextTypes: any;
  constructor(props : ITreesFilterProps) {
    super(props);
    let self: TreesFilterComponent = this;
    self.state = {
      userId: null,
      open: false,
    };
  }

  public componentDidMount() {
    let self: TreesFilterComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: TreesFilterComponent = this;
  }

  public componentWillReceiveProps (nextProps: ITreesFilterProps) {
    let self: TreesFilterComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ITreesFilterProps) => {
    let self: TreesFilterComponent = this;
  }

  render() {
    let self: TreesFilterComponent = this;
    let filterownership: JSX.Element;
    let filterflag: JSX.Element;
    if (authStore.getAuth().getIsManager()) {
      filterownership = <FilterOwnershipComponent />;
      filterflag = <FilterFlagComponent flags={self.props.flags} />;
    }
    return(
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <div className={styles.title}>
            TREE FILTERS
          </div>
          <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
            self.context.router.push({pathname: Settings.uBaseName + '/'});
            //self.setState({editable: self.state.editable});
          }}/></div>
        </div>
        <FilterFoodComponent foods={self.props.foods} />
        <FilterRateComponent />
        <FilterAdoptComponent />
        {filterflag}
        {filterownership}
      </div>
    );
  }
}

TreesFilterComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
