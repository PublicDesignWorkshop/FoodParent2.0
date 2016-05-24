import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';
import * as moment from 'moment';

var Settings = require('./../../constraints/settings.json');
import * as styles from './trees-filter.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { FlagModel, flagStore } from './../../stores/flag.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { checkLogin, checkAdmin } from './../../utils/authentication';
import { LogInStatus } from './../app.component';
import FilterFoodComponent from './filter-food.component';
import FilterFlagComponent from './filter-flag.component';
import FilterOwnershipComponent from './filter-ownership.component';
import FilterAdoptComponent from './filter-adopt.component';
import FilterRateComponent from './filter-rate.component';

export interface ITreesFilterProps {
  foods: Array<FoodModel>;
  trees: Array<TreeModel>;
  flags: Array<FlagModel>;
  login: LogInStatus;
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
    if (self.props.login == LogInStatus.MANAGER || self.props.login == LogInStatus.ADMIN) {
      filterownership = <FilterOwnershipComponent />;
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
        <FilterAdoptComponent login={self.props.login}/>
        <FilterFlagComponent flags={self.props.flags} />
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
