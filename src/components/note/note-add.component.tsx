import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';
import * as moment from 'moment';

var Settings = require('./../../constraints/settings.json');
import * as styles from './note-add.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { LogInStatus } from './../app.component';
import { uploadImage } from './../../utils/upload';
import { NoteModel, noteStore, NoteType, PickupTime, AmountType } from './../../stores/note.store';
import NoteCommentComponent from './note-comment.component';
import NoteDateComponent from './note-date.component';
import NoteAmountComponent from './note-amount.component';
import NoteRateComponent from './note-rate.component';
import ErrorMessage from './../error-message.component';

export interface INoteAddProps {
  trees: Array<TreeModel>;
  treeId: number;
  login: LogInStatus;
  userId: number;
  note: NoteModel;
  error: Array<string>;
}
export interface INoteAddStatus {
  editable?: boolean;
  error?: Array<string>;
}
export default class NoteAddComponent extends React.Component<INoteAddProps, INoteAddStatus> {
  static contextTypes: any;
  constructor(props : INoteAddProps) {
    super(props);
    let self: NoteAddComponent = this;
    this.state = {
      editable: false,
      error: new Array<string>(),
    };
  }
  public componentDidMount() {
    let self: NoteAddComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: NoteAddComponent = this;
  }
  public componentWillReceiveProps (nextProps: INoteAddProps) {
    let self: NoteAddComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: INoteAddProps) => {
    let self: NoteAddComponent = this;
    if (props.note != null && props.userId != null) {
      props.note.setTreeId(props.treeId);
      props.note.setPersonId(props.userId);
      self.setState({error: props.error});
    }
  }

  private onImageClick = (image: string) => {
    let self: NoteAddComponent = this;
    self.props.note.setCoverImage(image);
    self.forceUpdate();
  }

  render() {
    let self: NoteAddComponent = this;
    if (self.props.treeId && self.props.note != null) {
      var tree: TreeModel = treeStore.getTree(self.props.treeId);
      let images: Array<JSX.Element> = self.props.note.getImages().map(function(image: string, i: number) {
        if (i == 0) {
          return (
            <div className={styles.image + " " + styles.selected} key={"noteimage" + i}>
              <div className={styles.cover}>
                cover
              </div>
              <img src={Settings.uBaseName + Settings.uContentImage + image} onClick={()=> {
                self.onImageClick(image);
              }}/>
            </div>
          );
        } else {
          return (
            <div className={styles.image} key={"noteimage" + i}>
              <img src={Settings.uBaseName + Settings.uContentImage + image} onClick={()=> {
                self.onImageClick(image);
              }}/>
            </div>
          );
        }
      });
      return (
        <div className={styles.wrapper}>
          {images}
          <div className={styles.image}>
            <input className={styles.upload} type="file" accept="image/*" capture="camera" onChange={(event: any)=> {
              if (event.target.files[0] != null) {
                uploadImage(event.target.files[0], tree.getId().toString(), function(filename: string) {  // success
                  console.log(filename);
                  self.props.note.addImage(filename);
                  self.forceUpdate();
                }, function() { // fail

                });
              }
            }} />
          </div>
          <div className={styles.inner}>
            <NoteRateComponent note={self.props.note} editable={true} async={false} error={self.state.error} />
            <NoteCommentComponent note={self.props.note} editable={true} async={false} error={self.state.error} />
            <NoteDateComponent note={self.props.note} editable={true} async={false} />
            <NoteAmountComponent note={self.props.note} editable={true} async={false} error={self.state.error} />
          </div>
          <div className={styles.button} onClick={()=> {
            let error: Array<string> = new Array<string>();
            let bError: boolean = false;
            if (self.props.note.getComment().trim() == "") {
              error.push("e601");
              bError = true;
            }
            if (self.props.note.getAmount() < 0) {
              error.push("e602");
              bError = true;
            }
            if (!bError) {
              if (self.props.note.getAmount() > 0) {
                self.props.note.setNoteType(NoteType.PICKUP);
              } else {
                self.props.note.setNoteType(NoteType.POST);
              }
              noteStore.createNote(self.props.note);
            }
            self.setState({error: error});
          }}>
            POST NEW NOTE
          </div>
          <ErrorMessage error={self.props.error} match={new Array<string>("e300", "e600")}/>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
        </div>
      );
    }
  }
}

NoteAddComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
