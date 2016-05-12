import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
var Settings = require('./../../constraints/settings.json');
import * as styles from './note-amount.component.css';
import { NoteModel, noteStore } from './../../stores/note.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';

export interface INoteAmountProps {
  note: NoteModel;
  editable: boolean;
  async: boolean;
}
export interface INoteAmountStatus {
  amount?: number;
  editing?: boolean;
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
      self.setState({amount: props.note.getAmount(), editing: false});
    }
  }
  private updateAttribute = () => {
    let self: NoteAmountComponent = this;
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
