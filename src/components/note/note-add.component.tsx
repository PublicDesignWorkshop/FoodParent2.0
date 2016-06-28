import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as moment from 'moment';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './note-add.component.css';
var Settings = require('./../../constraints/settings.json');

import NoteCommentComponent from './note-comment.component';
import NoteDateComponent from './note-date.component';
import NoteAmountComponent from './note-amount.component';
import NoteRateComponent from './note-rate.component';
import ImageZoomComponent from './../image/image-zoom.component';
import MessageLineComponent from './../message/message-line.component';

import { TreeModel, treeStore } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { NoteModel, noteStore } from './../../stores/note.store';
import { noteActions } from './../../actions/note.actions';
import { authStore } from './../../stores/auth.store';

import { uploadImage } from './../../utils/upload';
import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';
import { NoteType, PickupTime, AmountType } from './../../utils/enum';
import { checkValidPickupAmountNumber } from './../../utils/errorhandler';
import { localization } from './../../constraints/localization';

export interface INoteAddProps {
  treeId: number;
  note?: NoteModel;
  code?: any;
}
export interface INoteAddStatus {
  editable?: boolean;
  image?: string;
  error?: any;
  uploading?: boolean;
  width?: number;
}
export default class NoteAddComponent extends React.Component<INoteAddProps, INoteAddStatus> {
  static contextTypes: any;
  constructor(props : INoteAddProps) {
    super(props);
    let self: NoteAddComponent = this;
    this.state = {
      editable: false,
      image: null,
      error: null,
      uploading: false,
      width: 0,
    };
  }

  public componentDidMount() {
    let self: NoteAddComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: NoteAddComponent = this;
    setTimeout(function() {
      noteActions.resetTempNote();
    }, 0);
  }

  public componentWillReceiveProps (nextProps: INoteAddProps) {
    let self: NoteAddComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: INoteAddProps) => {
    let self: NoteAddComponent = this;
    if (props.note != null) {
      props.note.setTreeId(props.treeId);
      props.note.setPersonId(authStore.getAuth().getId());
    }
    self.setState({width: (ReactDOM.findDOMNode(self.refs['wrapper']).clientWidth - 16) * 0.5});
  }

  private onImageClick = (image: string) => {
    let self: NoteAddComponent = this;
    self.props.note.setCoverImage(image);
    self.forceUpdate();
  }

  private onImageZoom = (image: string) => {
    let self: NoteAddComponent = this;
    image = image.replace("_thumb", "_dest");
    self.setState({image: image});
  }

  private onImageClose = () => {
    let self: NoteAddComponent = this;
    self.setState({image: null});
  }

  private submitCreate = () => {
    let self: NoteAddComponent = this;
    let error: any = null;
    try {
      checkValidPickupAmountNumber(self.props.note.getAmount());
      if (self.props.note.getAmount() > 0) {
        self.props.note.setNoteType(NoteType.PICKUP);
      } else {
        self.props.note.setNoteType(NoteType.POST);
      }
      noteActions.createNote(noteStore.getTempNote());
    } catch(e) {
      displayErrorMessage(localization(e.message));
      error = e.message;
    }
    self.setState({error: error});
  }

  render() {
    let self: NoteAddComponent = this;
    if (self.props.treeId && self.props.note != null) {
      let imgStyle = {
        width: Math.floor(self.state.width),
        height: Math.floor(self.state.width * 9 / 16),
      };
      let tree: TreeModel = treeStore.getTree(self.props.treeId);
      let food: FoodModel = foodStore.getFood(tree.getFoodId());
      let image: JSX.Element;
      if (self.state.image) {
        image = <ImageZoomComponent image={self.state.image} onClose={self.onImageClose} title={food.getName() + tree.getName() + " - " + self.props.note.getFormattedDate()} />;
      }
      let images: Array<JSX.Element> = self.props.note.getImages().map(function(image: string, i: number) {
        if (i == 0) {
          return (
            <div style={imgStyle} className={styles.image + " " + styles.selected} key={"noteimage" + i}>
              <div className={styles.cover}>
                {localization(995)}
              </div>
              <div className={styles.remove} onClick={()=> {

              }}>
                <FontAwesome className='' name='remove' />
              </div>
              <div className={styles.zoom} onClick={()=> {
                self.onImageZoom(image);
              }}>
                <FontAwesome className='' name='search-plus' />
              </div>
              <img src={Settings.uBaseName + Settings.uContentImage + image} />
            </div>
          );
        } else {
          return (
            <div style={imgStyle} className={styles.image} key={"noteimage" + i}>
              <div className={styles.cover2} onClick={()=> {
                self.onImageClick(image);
              }}>
                {localization(996)}
              </div>
              <div className={styles.remove} onClick={()=> {

              }}>
                <FontAwesome className='' name='remove' />
              </div>
              <div className={styles.zoom} onClick={()=> {
                self.onImageZoom(image);
              }}>
                <FontAwesome className='' name='search-plus' />
              </div>
              <img src={Settings.uBaseName + Settings.uContentImage + image} />
            </div>
          );
        }
      });
      let imageUpload: JSX.Element = <input className={styles.upload} type="file" accept="image/*" capture="camera" onChange={(event: any)=> {
        if (event.target.files[0] != null) {
          self.setState({uploading: true});
          uploadImage(event.target.files[0], tree.getId().toString(), function(filename: string) {  // success
            self.setState({uploading: false});
            console.log("Image file uploaded: " + filename);
            self.props.note.addImage(filename);
            self.forceUpdate();
          }, function() { // fail

          });
        }
      }} />
      if (self.state.uploading) {
        imageUpload = <div className={styles.uploading} type="file" accept="image/*" capture="camera" />
      }
      return (
        <div ref="wrapper" className={styles.wrapper}>
          {images}
          <div style={imgStyle} className={styles.image}>
            {imageUpload}
          </div>
          <div className={styles.inner}>
            <NoteRateComponent note={self.props.note} editable={true} async={false} />
            <NoteCommentComponent note={self.props.note} editable={true} async={false} />
            <NoteDateComponent note={self.props.note} editable={true} async={false} />
            <NoteAmountComponent note={self.props.note} editable={true} async={false} error={self.state.error} />
          </div>
          <MessageLineComponent code={self.props.code} match={[90, 91, 92, 93]} />
          <div className={styles.button} onClick={()=> {
            if (self.props.code == 200) {
              self.submitCreate();
            }
          }}>
            {localization(997)}
          </div>
          {image}
        </div>
      );
    } else {
      return (
        <div ref="wrapper" className={styles.wrapper}>
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
