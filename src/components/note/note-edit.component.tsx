import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as moment from 'moment';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './note-edit.component.css';
var Settings = require('./../../constraints/settings.json');

import NoteCommentComponent from './note-comment.component';
import NoteDateComponent from './note-date.component';
import NoteAmountComponent from './note-amount.component';
import NoteRateComponent from './note-rate.component';
import ImageZoomComponent from './../image/image-zoom.component';
import MessageLineComponent from './../message/message-line.component';

import { TreeModel, treeStore } from './../../stores/tree.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { NoteModel } from './../../stores/note.store';
import { authStore } from './../../stores/auth.store';
import { noteActions } from './../../actions/note.actions';

import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';
import { checkValidPickupAmountNumber } from './../../utils/errorhandler';
import { uploadImage } from './../../utils/upload';
import { NoteType, PickupTime, AmountType } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface INoteEditProps {
  trees: Array<TreeModel>;
  foods: Array<FoodModel>;
  treeId: number;
  note: NoteModel;
  code?: any;
}
export interface INoteEditStatus {
  editable?: boolean;
  image?: string;
  error?: any;
  uploading?: boolean;
  width?: number;
}

export default class NoteEditComponent extends React.Component<INoteEditProps, INoteEditStatus> {
  static contextTypes: any;
  constructor(props : INoteEditProps) {
    super(props);
    let self: NoteEditComponent = this;
    this.state = {
      image: null,
      editable: false,
      error: null,
      uploading: false,
      width: 0,
    };
  }

  public componentDidMount() {
    let self: NoteEditComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: NoteEditComponent = this;
  }

  public componentWillReceiveProps (nextProps: INoteEditProps) {
    let self: NoteEditComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: INoteEditProps) => {
    let self: NoteEditComponent = this;
    if (props.note != null) {
      let editable: boolean = false;
      if (authStore.getAuth().getIsManager()) {
        editable = true;
      } else {
        if (props.note.getPersonId() == authStore.getAuth().getId() && authStore.getAuth().getId() != 0) {
          editable = true;
        }
      }
      self.setState({editable: editable, width: (ReactDOM.findDOMNode(self.refs['wrapper']).clientWidth - 16) * 0.5});
    }
  }

  private onImageClick = (image: string) => {
    let self: NoteEditComponent = this;
    if (self.state.editable) {
      self.props.note.setCoverImage(image);
      self.forceUpdate();
    }
  }

  private onImageZoom = (image: string) => {
    let self: NoteEditComponent = this;
    image = image.replace("_thumb", "_dest");
    self.setState({image: image});
  }

  private onImageClose = () => {
    let self: NoteEditComponent = this;
    self.setState({image: null});
  }

  private submitUpdate = () => {
    let self: NoteEditComponent = this;
    let error: any = null;
    try {
      checkValidPickupAmountNumber(self.props.note.getAmount());
      if (self.props.note.getAmount() > 0) {
        self.props.note.setNoteType(NoteType.PICKUP);
      } else {
        self.props.note.setNoteType(NoteType.POST);
      }
      noteActions.updateNote(self.props.note);
    } catch(e) {
      displayErrorMessage(localization(e.message));
      error = e.message;
    }
    self.setState({error: error});
  }

  render() {
    let self: NoteEditComponent = this;
    if (self.props.treeId && self.props.note != null) {
      let imgStyle = {
        width: Math.floor(self.state.width),
        height: Math.floor(self.state.width * 9 / 16),
      };
      let tree: TreeModel = treeStore.getTree(self.props.treeId);
      let food: FoodModel = foodStore.getFood(tree.getFoodId());
      let image: JSX.Element;
      if (self.state.image) {
        image = <ImageZoomComponent image={self.state.image} onClose={self.onImageClose}  title={food.getName() + tree.getName() + " - " + self.props.note.getFormattedDate()} />;
      }
      let images: Array<JSX.Element> = self.props.note.getImages().map(function(image: string, i: number) {
        if (i == 0) {
          if (self.state.editable) {
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
              <div style={imgStyle} className={styles.image + " " + styles.selected} key={"noteimage" + i}>
                <div className={styles.cover}>
                  cover
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
        } else {
          if (self.state.editable) {
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
          } else {
            return (
              <div style={imgStyle} className={styles.image} key={"noteimage" + i}>
                <div className={styles.zoom} onClick={()=> {
                  self.onImageZoom(image);
                }}>
                  <FontAwesome className='' name='search-plus' />
                </div>
                <img src={Settings.uBaseName + Settings.uContentImage + image} />
              </div>
            );
          }
        }
      });
      if (self.state.editable) {
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
              <NoteRateComponent note={self.props.note} editable={self.state.editable} async={false} />
              <NoteCommentComponent note={self.props.note} editable={self.state.editable} async={false} />
              <NoteDateComponent note={self.props.note} editable={self.state.editable} async={false} />
              <NoteAmountComponent note={self.props.note} editable={self.state.editable} async={false} error={self.state.error} />
            </div>
            <div className={styles.button} onClick={()=> {
              if (self.props.code == 200) {
                self.submitUpdate();
              }
            }}>
              {localization(934)}
            </div>
            <MessageLineComponent code={self.props.code} match={[90, 91, 92, 93]} />
            <div className={styles.button2} onClick={()=> {
              self.context.router.push({pathname: Settings.uBaseName + '/tree/' + self.props.treeId});
            }}>
              {localization(933)}
            </div>
            <div className={styles.or}>
              {localization(932)}
            </div>
            <div className={styles.button3} onClick={()=> {
              self.context.router.push({pathname: window.location.pathname, query: { note: self.props.note.getId(), mode: "delete" }});
            }}>
              {localization(931)}
            </div>
            {image}
          </div>
        );
      } else {
        return (
          <div ref="wrapper" className={styles.wrapper}>
            {images}
            <div className={styles.inner}>
              <NoteRateComponent note={self.props.note} editable={self.state.editable} async={false} />
              <NoteCommentComponent note={self.props.note} editable={self.state.editable} async={false} />
              <NoteDateComponent note={self.props.note} editable={self.state.editable} async={false} />
              <NoteAmountComponent note={self.props.note} editable={self.state.editable} async={false} error={self.state.error} />
            </div>
            {image}
          </div>
        );
      }
    } else {
      return (
        <div ref="wrapper" className={styles.wrapper}>
        </div>
      );
    }
  }
}

NoteEditComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
