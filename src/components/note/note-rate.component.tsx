import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './note-rate.component.css';
import { NoteModel, noteStore, AmountType, PickupTime } from './../../stores/note.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import ErrorMessage from './../error-message.component';

export interface INoteRateOption {
  value: number;
  label: string;
}
export interface INoteRateProps {
  note: NoteModel;
  editable: boolean;
  async: boolean;
  error: Array<string>;
}
export interface INoteRateStatus {
  options?: Array<INoteRateOption>;
  selected?: INoteRateOption;
}
export default class NoteRateComponent extends React.Component<INoteRateProps, INoteRateStatus> {
  constructor(props : INoteRateProps) {
    super(props);
    let self: NoteRateComponent = this;
    self.state = {

    };
  }
  public componentDidMount() {
    let self: NoteRateComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: NoteRateComponent = this;
  }
  public componentWillReceiveProps (nextProps: INoteRateProps) {
    let self: NoteRateComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: INoteRateProps) {
    let self: NoteRateComponent = this;
    if (props.note) {
      let options = new Array<INoteRateOption>();
      options.push({value: 0, label: "☆☆☆☆☆ (Initial State)"});
      options.push({value: 1, label: "★☆☆☆☆"});
      options.push({value: 2, label: "★★☆☆☆"});
      options.push({value: 3, label: "★★★☆☆"});
      options.push({value: 4, label: "★★★★☆"});
      options.push({value: 5, label: "★★★★★ (Fully Grown)"});
      let selected: INoteRateOption = options[props.note.getRate()];
      if (props.note.getAmount() != 0) {
        self.setState({options: options, selected: selected});
      } else {
        self.setState({options: options, selected: selected});
      }
    }
  }
  private updateAttribute = (selected) => {
    let self: NoteRateComponent = this;
    self.props.note.setRate(selected.value);
    self.setState({selected: selected});
    if (self.props.async) {
      noteStore.updateNote(self.props.note);
    } else {

    }
  }

  render() {
    let self: NoteRateComponent = this;
    if (self.props.editable || self.props.note.getId() == 0) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onMouseUp={()=> {
            // if (self.props.editable) {
            //   self.setState({editing: true});
            // }
          }}>
            <FontAwesome className='' name='star' /> Rate
          </div>
          <div className={styles.edit}>
            <Select name="amount-select" multi={false} clearable={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} />
            <ErrorMessage error={self.props.error} match={new Array<string>("e602")}/>
          </div>
        </div>
      );
    } else {
      if (self.state.options) {
        return (
          <div className={styles.wrapper}>
            <div className={styles.label} onMouseUp={()=> {
              // if (self.props.editable) {
              //   self.setState({editing: true});
              // }
            }}>
              <FontAwesome className='' name='star' /> Rate
            </div>
            <div className={styles.edit}>
              {self.state.options[self.props.note.getRate()].label}
            </div>
          </div>
        );
      } else {
        return (
          <div className={styles.wrapper}>
            <div className={styles.label} onMouseUp={()=> {
              // if (self.props.editable) {
              //   self.setState({editing: true});
              // }
            }}>
              <FontAwesome className='' name='star' /> Rate
            </div>
            <div className={styles.edit}>

            </div>
          </div>
        );
      }
    }
  }
}
