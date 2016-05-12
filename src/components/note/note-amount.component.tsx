import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './note-amount.component.css';
import { NoteModel, noteStore, AmountType } from './../../stores/note.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';

export interface IAmountTypeOption {
  value: number;
  label: string;
}
export interface INoteAmountProps {
  note: NoteModel;
  editable: boolean;
  async: boolean;
}
export interface INoteAmountStatus {
  amount?: number;
  editing?: boolean;
  options?: Array<IAmountTypeOption>;
  selected?: IAmountTypeOption;
}
export default class NoteAmountComponent extends React.Component<INoteAmountProps, INoteAmountStatus> {
  constructor(props : INoteAmountProps) {
    super(props);
    let self: NoteAmountComponent = this;
    this.state = {
      amount: 0,
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
      self.setState({amount: props.note.getAmount(), editing: false, options: options, selected: selected});
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
            <FontAwesome className='' name='shopping-basket' /> Amount
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
            <Select className={styles.type} name="amount-select" multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select unit..." />
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
            <FontAwesome className='' name='shopping-basket' /> Amount
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
