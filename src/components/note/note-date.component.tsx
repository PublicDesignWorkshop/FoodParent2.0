import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as DateTimeField from 'react-bootstrap-datetimepicker';
import * as moment from 'moment';

var Settings = require('./../../constraints/settings.json');
import * as styles from './note-date.component.css';
import { NoteModel, noteStore } from './../../stores/note.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';

export interface INoteDateProps {
  note: NoteModel;
  editable: boolean;
  async: boolean;
}
export interface INoteDateStatus {
  date?: moment.Moment;
}
export default class NoteDateComponent extends React.Component<INoteDateProps, INoteDateStatus> {
  constructor(props : INoteDateProps) {
    super(props);
    let self: NoteDateComponent = this;
    this.state = {
      date: moment(new Date()),
    };
  }
  public componentDidMount() {
    let self: NoteDateComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: NoteDateComponent = this;
  }
  public componentWillReceiveProps (nextProps: INoteDateProps) {
    let self: NoteDateComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: INoteDateProps) {
    let self: NoteDateComponent = this;
    if (props.note) {
      self.setState({date: props.note.getDate()});
    }
  }
  private updateAttribute = () => {
    let self: NoteDateComponent = this;
    self.props.note.setDate(self.state.date);
    if (self.props.async) {
      noteStore.updateNote(self.props.note);
    }
  }

  render() {
    let self: NoteDateComponent = this;
    return (
      <div className={styles.wrapper}>
        <div className={styles.label} onMouseUp={()=> {
          // if (self.props.editable) {
          //   self.setState({editing: true});
          // }
        }}>
          <FontAwesome className='' name='calendar-o' /> Date
        </div>
        <div className={styles.edit}>
          <DateTimeField dateTime={self.state.date.format(Settings.sUIDateFormat)} format={Settings.sUIDateFormat} onChange={(event: any)=> {
            self.setState({date: moment(event, Settings.sUIDateFormat)});
            self.updateAttribute();
          }}/>
        </div>
      </div>
    );
  }
}
