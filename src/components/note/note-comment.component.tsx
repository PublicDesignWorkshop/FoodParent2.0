import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import TextareaAutosize from 'react-textarea-autosize';

var Settings = require('./../../constraints/settings.json');
import * as styles from './note-comment.component.css';
import { NoteModel, noteStore } from './../../stores/note.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import ErrorMessage from './../error-message.component';

export interface INoteCommentProps {
  note: NoteModel;
  editable: boolean;
  async: boolean;
  error: Array<string>;
}
export interface INoteCommentStatus {
  comment?: string;
}
export default class NoteCommentComponent extends React.Component<INoteCommentProps, INoteCommentStatus> {
  constructor(props : INoteCommentProps) {
    super(props);
    let self: NoteCommentComponent = this;
    this.state = {
      comment: "",
    };
  }
  public componentDidMount() {
    let self: NoteCommentComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: NoteCommentComponent = this;
  }
  public componentWillReceiveProps (nextProps: INoteCommentProps) {
    let self: NoteCommentComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: INoteCommentProps) {
    let self: NoteCommentComponent = this;
    if (props.note) {
      self.setState({comment: props.note.getComment().trim()});
    }
  }
  private updateAttribute = () => {
    let self: NoteCommentComponent = this;
    self.props.note.setComment(self.state.comment);
    if (self.props.async) {
      noteStore.updateNote(self.props.note);
    } else {

    }
  }

  render() {
    let self: NoteCommentComponent = this;
    if (self.props.editable || self.props.note.getId() == 0) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onMouseUp={()=> {
            // if (self.props.editable) {
            //   self.setState({editing: true});
            // }
          }}>
            <FontAwesome className='' name='comment-o' /> Comment
          </div>
          <div className={styles.edit}>
            <TextareaAutosize type="text" className={styles.input} key={self.props.note.getId() + "comment"} placeholder="enter comment..."
              value={self.state.comment}
              onChange={(event: any)=> {
                self.setState({comment: event.target.value});
              }}
              onKeyPress={(event)=> {
                // if (event.key == 'Enter') {
                //   self.updateAttribute();
                // }
              }}
              onBlur={()=> {
                self.updateAttribute();
              }} />
            <ErrorMessage error={self.props.error} match={new Array<string>("e601")}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='comment-o' /> Comment
          </div>
          <div className={styles.value}>
            {
              self.state.comment.split("\n").map(function(line: string, index: number) {
                return (
                  <span key={"line" + index}>
                    {line}
                    <br/>
                  </span>
                );
              })
            }
          </div>
        </div>
      );
    }

  }
}
