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

export interface INoteAddProps {
  trees: Array<TreeModel>;
  treeId: number;
  login: LogInStatus;
  userId: number;
}
export interface INoteAddStatus {
  editable?: boolean;
  note?: NoteModel;
  error?: Array<string>;
}
export default class NoteAddComponent extends React.Component<INoteAddProps, INoteAddStatus> {
  static contextTypes: any;
  private errorTimer: any;
  constructor(props : INoteAddProps) {
    super(props);
    let self: NoteAddComponent = this;
    this.state = {
      editable: false,
      note: null,
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
    if (props.treeId && props.trees != null) {
      if (self.state.note == null) {
        let note: NoteModel = new NoteModel({
          id: "0",
          type: NoteType.POST.toString(),
          tree: props.treeId.toString(),
          person: props.userId.toString(),
          comment: "",
          picture: "",
          rate: "0",
          amount: "0",
          proper: PickupTime.PROPER.toString(),
          date: moment(new Date()).format(Settings.sServerDateFormat),
          atype: AmountType.G.toString(),
        });
        self.setState({note: note});
      }
    }
  }

  private onImageClick = (image: string) => {
    let self: NoteAddComponent = this;
    self.state.note.setCoverImage(image);
    self.forceUpdate();
  }

  render() {
    let self: NoteAddComponent = this;
    let error: JSX.Element = null;
    if (self.state.error.indexOf("e300") > -1) {
      error = <div className={styles.success}>{Settings.e300}</div>;
    } else if (self.state.error.indexOf("e600") > -1) {
      error = <div className={styles.success}>{Settings.e600}</div>;
    }
    if (self.props.treeId && self.state.note != null) {
      var tree: TreeModel = treeStore.getTree(self.props.treeId);
      let images: Array<JSX.Element> = this.state.note.getImages().map(function(image: string, i: number) {
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
              uploadImage(event.target.files[0], tree.getId().toString(), function(filename: string) {  // success
                self.state.note.addImage(filename);
                self.forceUpdate();
                console.log(self.state.note.getImages());
              }, function() { // fail

              });
            }} />
          </div>
          <div className={styles.inner}>
            <NoteCommentComponent note={self.state.note} editable={true} async={false} error={self.state.error} />
            <NoteDateComponent note={self.state.note} editable={true} async={false} />
            <NoteAmountComponent note={self.state.note} editable={true} async={false} error={self.state.error} />
          </div>
          <div className={styles.button} onClick={()=> {
            let error: Array<string> = new Array<string>();
            let bError: boolean = false;
            if (self.state.note.getComment().trim() == "") {
              error.push("e601");
              bError = true;
            }
            if (self.state.note.getAmount() < 0) {
              error.push("e602");
              bError = true;
            }
            if (!bError) {
              error.push("e300");
              noteStore.createNote(self.state.note);
            }
            self.setState({error: error});
            if (bError) {
              if (self.errorTimer) {
                clearInterval(self.errorTimer);
              }
              self.errorTimer = setTimeout(function() {
                self.setState({error: new Array<string>()});
              }, Settings.iErrorMessageDuration);
            }
          }}>
            POST NEW NOTE
          </div>
          {error}
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
