import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import TextareaAutosize from 'react-textarea-autosize';

var Settings = require('./../../constraints/settings.json');
import * as styles from './note-list.component.css';
import { NoteModel, noteStore } from './../../stores/note.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import ErrorMessage from './../error-message.component';

export interface INoteListProps {
  notes: Array<NoteModel>;
}
export interface INoteListStatus {

}
export default class NoteListComponent extends React.Component<INoteListProps, INoteListStatus> {
  static contextTypes: any;
  constructor(props : INoteListProps) {
    super(props);
    let self: NoteListComponent = this;
    this.state = {
    };
  }
  public componentDidMount() {
    let self: NoteListComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: NoteListComponent = this;
  }
  public componentWillReceiveProps (nextProps: INoteListProps) {
    let self: NoteListComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: INoteListProps) {
    let self: NoteListComponent = this;
  }

  render() {
    let self: NoteListComponent = this;
    let notes: Array<JSX.Element> = self.props.notes.map(function(note: NoteModel, i: number) {
      if (note.getId()) {
        return (
          <div className={styles.value} key={"note" + i}  onClick={()=> {
            console.log(note.getId());
            self.context.router.push({pathname: window.location.pathname, query: { note: note.getId() }});
          }}>
            •
            <span className={styles.comment}>
              {" \"" + note.getComment() + "\" "}
            </span>
            <span className={styles.star}>
              {"★x" + note.getRate()}
            </span>
            <span className={styles.date}>
              {" (" + note.getFormattedDate() + ")"}
            </span>
          </div>
        );
      } else {
        return null;
      }
    });
    return(
      <div className={styles.wrapper}>
        <div className={styles.label}>
          <FontAwesome className='' name='comments' /> Recent Posts
        </div>
        {notes}
      </div>
    );
  }
}


NoteListComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
