import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './donate-amount.component.css';
import { AmountType } from './../../stores/note.store';
import { DonateModel, donateStore } from './../../stores/donate.store';
import MessageLineComponent from './../message/message-line.component';

export interface IAmountTypeOption {
  value: number;
  label: string;
}

export interface IDonateAmountProps {
  donate: DonateModel;
  editable: boolean;
  async: boolean;
  error: any;
}
export interface IDonateAmountStatus {
  amount?: any;
  options?: Array<IAmountTypeOption>;
  selected?: IAmountTypeOption;
}
export default class DonateAmountComponent extends React.Component<IDonateAmountProps, IDonateAmountStatus> {
  constructor(props : IDonateAmountProps) {
    super(props);
    let self: DonateAmountComponent = this;
    this.state = {
      amount: "",
    };
  }
  public componentDidMount() {
    let self: DonateAmountComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: DonateAmountComponent = this;
  }
  public componentWillReceiveProps (nextProps: IDonateAmountProps) {
    let self: DonateAmountComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IDonateAmountProps) {
    let self: DonateAmountComponent = this;
    if (props.donate) {
      let options = new Array<IAmountTypeOption>();
      options.push({value: 1, label: "g"});
      options.push({value: 2, label: "kg"});
      options.push({value: 3, label: "libs."});
      let selected: IAmountTypeOption;
      if (self.props.donate.getAmountType() == AmountType.G) {
        selected = options[0];
      } else if (self.props.donate.getAmountType() == AmountType.KG) {
        selected = options[1];
      } else if (self.props.donate.getAmountType() == AmountType.LBS) {
        selected = options[2];
      }
      self.setState({amount: props.donate.getAmount(), options: options, selected: selected});
    }
  }
  private updateAttribute = (selected?: any) => {
    let self: DonateAmountComponent = this;
    let atype = 0;
    if (selected) {
      atype = parseInt(selected.value);
      if (atype == 1) {
        self.props.donate.setAmountType(AmountType.G);
      } else if (atype == 2) {
        self.props.donate.setAmountType(AmountType.KG);
      } else if (atype == 3) {
        self.props.donate.setAmountType(AmountType.LBS);
      }
      self.setState({selected: selected});
    }
    self.props.donate.setAmount(self.state.amount);
    if (self.props.async) {
      // noteStore.updateNote(self.props.note);
    } else {

    }
  }

  render() {
    let self: DonateAmountComponent = this;
    if (self.props.editable || self.props.donate.getId() == 0) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onMouseUp={()=> {
            // if (self.props.editable) {
            //   self.setState({editing: true});
            // }
          }}>
            <FontAwesome className='' name='shopping-basket' /> Pickup
          </div>
          <div className={styles.edit}>
            <input type="number" className={styles.input} key={self.props.donate.getId() + "amount"} placeholder="enter weight..."
              value={self.state.amount}
              onChange={(event: any)=> {
                self.setState({amount: event.target.value});
              }}
              onKeyPress={(event)=> {
                // if (event.key == 'Enter') {
                //   self.updateAttribute();
                // }
              }}
              onBlur={()=> {
                self.updateAttribute();
              }} />
            <Select className={styles.type} name="amount-select" multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} />
          </div>
          <div className={styles.message}>
            <MessageLineComponent code={self.props.error} match={[602, 603]} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='shopping-basket' /> Amount
          </div>
          <div className={styles.value}>
            {self.state.amount.toLocaleString() + "g"}
          </div>
        </div>
      );
    }

  }
}
