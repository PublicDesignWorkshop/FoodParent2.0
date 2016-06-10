import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import TextareaAutosize from 'react-textarea-autosize';

var Settings = require('./../../constraints/settings.json');
import * as styles from './donate-list.component.css';
import { DonateModel, donateStore } from './../../stores/donate.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import ErrorMessage from './../error-message.component';

export interface IDonateListProps {
  donates?: Array<DonateModel>;
  donateId: number;
}
export interface IDonateListStatus {

}
export default class DonateListComponent extends React.Component<IDonateListProps, IDonateListStatus> {
  static contextTypes: any;
  constructor(props : IDonateListProps) {
    super(props);
    let self: DonateListComponent = this;
    this.state = {
    };
  }
  public componentDidMount() {
    let self: DonateListComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: DonateListComponent = this;
  }
  public componentWillReceiveProps (nextProps: IDonateListProps) {
    let self: DonateListComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IDonateListProps) {
    let self: DonateListComponent = this;
  }

  render() {
    let self: DonateListComponent = this;
    let donates: Array<JSX.Element> = self.props.donates.map(function(donate: DonateModel, i: number) {
      if (donate.getId()) {
        let food: FoodModel = foodStore.getFood(donate.getFoodId());
        let list: Array<JSX.Element> = new Array<JSX.Element>();
        for (let i = 0; i < donate.getTrees().length; i++) {
          if (donate.getTrees().length - 1 == i) {
            list.push(<span className={styles.tree} key={"tree" + donate.getTrees()[i]}onClick={()=> {
              self.context.router.push({pathname: window.location.pathname + "/tree/" + donate.getTrees()[i]});
            }}>{"#" + donate.getTrees()[i]}</span>);
          } else {
            list.push(<span className={styles.tree} key={"tree" + donate.getTrees()[i]}onClick={()=> {
              self.context.router.push({pathname: window.location.pathname + "/tree/" + donate.getTrees()[i]});
            }}>{"#" + donate.getTrees()[i]}</span>);
            // list.push(<span key={"tree" + donate.getTrees()[i] + "comma"}>, </span>);
          }

        }
        if (donate.getId() == self.props.donateId) {
          return (
            <div className={styles.value + " " + styles.selected} key={"note" + i} onClick={()=> {
              self.context.router.push({pathname: window.location.pathname, query: { donate: donate.getId() }});
            }}>
              <FontAwesome className='' name='angle-right' />
              <span className={styles.amount}>
                {" \"" + food.getName() + " " + Math.floor(donate.getAmount()).toLocaleString() + "g\""}
              </span>
              <span className={styles.comment}>
                {" from "}
                {list}
                {". "}
              </span>
              <span className={styles.date}>
                {" (" + donate.getFormattedDate() + ")"}
              </span>
            </div>
          );
        } else {
          return (
            <div className={styles.value} key={"note" + i}  onClick={()=> {
              self.context.router.push({pathname: window.location.pathname, query: { donate: donate.getId() }});
            }}>
              <FontAwesome className='' name='angle-right' />
              <span className={styles.amount}>
                {" \"" + food.getName() + " " + Math.floor(donate.getAmount()).toLocaleString() + "g\""}
              </span>
              <span className={styles.comment}>
              {" from "}
              {list}
              {". "}
              </span>
              <span className={styles.date}>
                {" (" + donate.getFormattedDate() + ")"}
              </span>
            </div>
          );
        }
      } else {
        return null;
      }
    });
    return(
      <div className={styles.wrapper}>
        <div className={styles.label}>
          <FontAwesome className='' name='comments' /> Recent Donates
        </div>
        {donates}
      </div>
    );
  }
}


DonateListComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
