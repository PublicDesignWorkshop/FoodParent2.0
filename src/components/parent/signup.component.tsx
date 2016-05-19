import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import TextareaAutosize from 'react-textarea-autosize';

var Settings = require('./../../constraints/settings.json');
import * as styles from './signup.component.css';
import { NoteModel, noteStore } from './../../stores/note.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import ErrorMessage from './../error-message.component';

export interface ISignUpProps {
  note: NoteModel;
  editable: boolean;
  async: boolean;
  error: Array<string>;
}
export interface ISignUpStatus {
  comment?: string;
}
export default class SignUpComponent extends React.Component<ISignUpProps, ISignUpStatus> {
  constructor(props : ISignUpProps) {
    super(props);
    let self: SignUpComponent = this;
    this.state = {
      comment: "",
    };
  }
  public componentDidMount() {
    let self: SignUpComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: SignUpComponent = this;
  }
  public componentWillReceiveProps (nextProps: ISignUpProps) {
    let self: SignUpComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: ISignUpProps) {
    let self: SignUpComponent = this;
    if (props.note) {
      self.setState({comment: props.note.getComment().trim()});
    }
  }
  private updateAttribute = () => {
    let self: SignUpComponent = this;
    self.props.note.setComment(self.state.comment);
    if (self.props.async) {
      noteStore.updateNote(self.props.note);
    } else {

    }
  }

  render() {
    let self: SignUpComponent = this;
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
