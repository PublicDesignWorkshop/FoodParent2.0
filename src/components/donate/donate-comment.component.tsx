import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import TextareaAutosize from 'react-textarea-autosize';

var Settings = require('./../../constraints/settings.json');
import * as styles from './donate-comment.component.css';
import { DonateModel, donateStore } from './../../stores/donate.store';

export interface IDonateCommentProps {
  donate: DonateModel;
  editable: boolean;
  async: boolean;
}
export interface IDonateCommentStatus {
  comment?: string;
}
export default class DonateCommentComponent extends React.Component<IDonateCommentProps, IDonateCommentStatus> {
  constructor(props : IDonateCommentProps) {
    super(props);
    let self: DonateCommentComponent = this;
    this.state = {
      comment: "",
    };
  }
  public componentDidMount() {
    let self: DonateCommentComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: DonateCommentComponent = this;
  }
  public componentWillReceiveProps (nextProps: IDonateCommentProps) {
    let self: DonateCommentComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IDonateCommentProps) {
    let self: DonateCommentComponent = this;
    if (props.donate) {
      self.setState({comment: props.donate.getComment().trim()});
    }
  }
  private updateAttribute = () => {
    let self: DonateCommentComponent = this;
    self.props.donate.setComment(self.state.comment);
    if (self.props.async) {
      // noteStore.updateNote(self.props.note);
    } else {

    }
  }

  render() {
    let self: DonateCommentComponent = this;
    if (self.props.editable || self.props.donate.getId() == 0) {
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
            <TextareaAutosize type="text" className={styles.input} key={self.props.donate.getId() + "comment"} placeholder="enter comment..."
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
