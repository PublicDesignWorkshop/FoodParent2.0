import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './note-amount.component.css';
import { NoteModel, noteStore, AmountType, PickupTime } from './../../stores/note.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import ErrorMessage from './../error-message.component';

export interface IPickupTimeOption {
  value: number;
  label: string;
}
export interface IAmountTypeOption {
  value: number;
  label: string;
}

export interface INoteAmountProps {
  note: NoteModel;
  editable: boolean;
  async: boolean;
  error: Array<string>;
}
export interface INoteAmountStatus {
  amount?: any;
  editing?: boolean;
  options?: Array<IAmountTypeOption>;
  selected?: IAmountTypeOption;
  options2?: Array<IPickupTimeOption>;
  selected2?: IPickupTimeOption;
}
export default class NoteAmountComponent extends React.Component<INoteAmountProps, INoteAmountStatus> {
  constructor(props : INoteAmountProps) {
    super(props);
    let self: NoteAmountComponent = this;
    this.state = {
      amount: "",
      editing: false,
    };
  }
  public componentDidMount() {
    let self: NoteAmountComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: NoteAmountComponent = this;
  }
  public componentWillReceiveProps (nextProps: INoteAmountProps) {
    let self: NoteAmountComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: INoteAmountProps) {
    let self: NoteAmountComponent = this;
    if (props.note) {
      let options = new Array<IAmountTypeOption>();
      options.push({value: 1, label: "g"});
      options.push({value: 2, label: "kg"});
      options.push({value: 3, label: "libs."});
      let selected: IAmountTypeOption;
      if (self.props.note.getAmountType() == AmountType.G) {
        selected = options[0];
      } else if (self.props.note.getAmountType() == AmountType.KG) {
        selected = options[1];
      } else if (self.props.note.getAmountType() == AmountType.LBS) {
        selected = options[2];
      }
      let options2 = new Array<IPickupTimeOption>();
      options2.push({value: 1, label: "Early"});
      options2.push({value: 2, label: "Proper"});
      options2.push({value: 3, label: "Late"});
      let selected2: IPickupTimeOption;
      if (self.props.note.getPicupTime() == PickupTime.EARLY) {
        selected2 = options2[0];
      } else if (self.props.note.getPicupTime() == PickupTime.PROPER) {
        selected2 = options2[1];
      } else if (self.props.note.getPicupTime() == PickupTime.LATE) {
        selected2 = options2[2];
      }
      if (props.note.getAmount() != 0) {
        self.setState({amount: props.note.getAmount(), editing: false, options: options, selected: selected, options2: options2, selected2: selected2});
      } else {
        self.setState({amount: "", editing: false, options: options, selected: selected, options2: options2, selected2: selected2});
      }

    }
  }
  private updateAttribute = (selected?: any) => {
    let self: NoteAmountComponent = this;
    let atype = 0;
    if (selected) {
      atype = parseInt(selected.value);
      if (atype == 1) {
        self.props.note.setAmountType(AmountType.G);
      } else if (atype == 2) {
        self.props.note.setAmountType(AmountType.KG);
      } else if (atype == 3) {
        self.props.note.setAmountType(AmountType.LBS);
      }
      self.setState({selected: selected});
    }
    self.props.note.setAmount(self.state.amount);
    if (self.props.async) {
      noteStore.updateNote(self.props.note);
    } else {
      self.setState({editing: false});
    }
  }
  private updatePickupTime = (selected2: any) => {
    let self: NoteAmountComponent = this;
    let pType = 0;
    if (selected2) {
      pType = parseInt(selected2.value);
      if (pType == 1) {
        self.props.note.setPicupTime(PickupTime.EARLY);
      } else if (pType == 2) {
        self.props.note.setPicupTime(PickupTime.PROPER);
      } else if (pType == 3) {
        self.props.note.setPicupTime(PickupTime.LATE);
      }
      self.setState({selected2: selected2});
    }
  }

  render() {
    let self: NoteAmountComponent = this;
    if (self.state.editing || self.props.note.getId() == 0) {
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
            <input type="number" className={styles.input} key={self.props.note.getId() + "amount"} placeholder="enter weight (lbs.)..."
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
            <Select className={styles.proper} name="pickuptime-select" multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={self.state.options2} value={self.state.selected2} onChange={self.updatePickupTime} />
          </div>
          <div className={styles.message}>
            <ErrorMessage error={self.props.error} match={new Array<string>("e602")}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {
            if (self.props.editable) {
              self.setState({editing: true});
            }
          }}>
            <FontAwesome className='' name='shopping-basket' /> Pickup
          </div>
          <div className={styles.value} onClick={()=> {
            if (self.props.editable) {
              self.setState({editing: true});
            }
          }}>
            {self.state.amount}
          </div>
        </div>
      );
    }

  }
}
