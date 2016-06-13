import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import TextareaAutosize from 'react-textarea-autosize';

var Settings = require('./../../constraints/settings.json');
import * as styles from './note-list.component.css';
import { NoteModel, noteStore, NoteType, PickupTime } from './../../stores/note.store';
import { sortNoteByDateDESC } from './../../utils/sort';

export interface INoteListProps {
  notes?: Array<NoteModel>;
  noteId: number;
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
    let sorted: Array<NoteModel> = self.props.notes.sort(sortNoteByDateDESC);
    let notes: Array<JSX.Element> = sorted.map(function(note: NoteModel, i: number) {
      if (note.getId()) {
        let pickuptime: string = "Early";
        if (note.getPicupTime() == PickupTime.PROPER) {
          pickuptime = "Proper";
        } else if (note.getPicupTime() == PickupTime.LATE) {
          pickuptime = "Late"
        }
        let rate: JSX.Element = <span><span className={styles.blankstar}>
          <FontAwesome className='' name='star-o' />
          <FontAwesome className='' name='star-o' />
          <FontAwesome className='' name='star-o' />
          <FontAwesome className='' name='star-o' />
          <FontAwesome className='' name='star-o' />
        </span></span>;
        if (note.getRate() == 1) {
          rate = <span><span>
            <FontAwesome className='' name='star' />
          </span><span className={styles.blankstar}>
            <FontAwesome className='' name='star-o' />
            <FontAwesome className='' name='star-o' />
            <FontAwesome className='' name='star-o' />
            <FontAwesome className='' name='star-o' />
          </span></span>;
        } else if (note.getRate() == 2) {
          rate = <span><span>
            <FontAwesome className='' name='star' />
            <FontAwesome className='' name='star' />
          </span><span className={styles.blankstar}>
            <FontAwesome className='' name='star-o' />
            <FontAwesome className='' name='star-o' />
            <FontAwesome className='' name='star-o' />
          </span></span>;
        } else if (note.getRate() == 3) {
          rate = <span><span>
            <FontAwesome className='' name='star' />
            <FontAwesome className='' name='star' />
            <FontAwesome className='' name='star' />
          </span><span className={styles.blankstar}>
            <FontAwesome className='' name='star-o' />
            <FontAwesome className='' name='star-o' />
          </span></span>;
        } else if (note.getRate() == 4) {
          rate = <span><span>
            <FontAwesome className='' name='star' />
            <FontAwesome className='' name='star' />
            <FontAwesome className='' name='star' />
            <FontAwesome className='' name='star' />
          </span><span className={styles.blankstar}>
            <FontAwesome className='' name='star-o' />
          </span></span>;
        } else if (note.getRate() == 5) {
          rate = <span><span>
            <FontAwesome className='' name='star' />
            <FontAwesome className='' name='star' />
            <FontAwesome className='' name='star' />
            <FontAwesome className='' name='star' />
            <FontAwesome className='' name='star' />
          </span></span>;
        }
        if (note.getId() == self.props.noteId) {
          if (note.getNoteType() == NoteType.POST) {
            return (
              <div className={styles.value + " " + styles.selected} key={"note" + i}  onClick={()=> {
                self.context.router.push({pathname: window.location.pathname, query: { note: note.getId() }});
              }}>
                •
                <span className={styles.comment}>
                  {" \"" + note.getComment() + "\" "}
                </span>
                <span className={styles.star}>
                  {rate}
                </span>
                <span className={styles.date}>
                  {" (" + note.getFormattedDate() + ")"}
                </span>
              </div>
            );
          } else if (note.getNoteType() == NoteType.PICKUP) {
            return (
              <div className={styles.value + " " + styles.selected} key={"note" + i}  onClick={()=> {
                self.context.router.push({pathname: window.location.pathname, query: { note: note.getId() }});
              }}>
                <FontAwesome className='' name='angle-right' />
                <span className={styles.comment}>
                  {" \"" + Math.floor(note.getAmount()).toLocaleString() + "\" g has been picked up. "}
                </span>
                <span className={styles.star}>
                  {"\"" + pickuptime + "\""}
                </span>
                <span className={styles.date}>
                  {" (" + note.getFormattedDate() + ")"}
                </span>
              </div>
            );
          }

        } else {
          if (note.getNoteType() == NoteType.POST) {
            return (
              <div className={styles.value} key={"note" + i}  onClick={()=> {
                self.context.router.push({pathname: window.location.pathname, query: { note: note.getId() }});
              }}>
                •
                <span className={styles.comment}>
                  {" \"" + note.getComment() + "\" "}
                </span>
                <span className={styles.star}>
                  {rate}
                </span>
                <span className={styles.date}>
                  {" (" + note.getFormattedDate() + ")"}
                </span>
              </div>
            );
          } else if (note.getNoteType() == NoteType.PICKUP) {
            return (
              <div className={styles.value} key={"note" + i}  onClick={()=> {
                self.context.router.push({pathname: window.location.pathname, query: { note: note.getId() }});
              }}>
                <FontAwesome className='' name='angle-right' />
                <span className={styles.comment}>
                  {" \"" + note.getAmount().toLocaleString() + "\" g has been picked up. "}
                </span>
                <span className={styles.star}>
                  {"\"" + pickuptime + "\""}
                </span>
                <span className={styles.date}>
                  {" (" + note.getFormattedDate() + ")"}
                </span>
              </div>
            );
          }
        }
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
