import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';
import * as moment from 'moment';

var Settings = require('./../../constraints/settings.json');
import * as styles from './note-edit.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { LogInStatus } from './../app.component';
import { uploadImage } from './../../utils/upload';
import { FoodModel, foodStore } from './../../stores/food.store';
import { NoteModel, noteStore, NoteType, PickupTime, AmountType } from './../../stores/note.store';
import NoteCommentComponent from './note-comment.component';
import NoteDateComponent from './note-date.component';
import NoteAmountComponent from './note-amount.component';
import NoteRateComponent from './note-rate.component';
import ImageZoomComponent from './../image/image-zoom.component';
import { noteActions } from './../../actions/note.actions';
import { authStore } from './../../stores/auth.store';
import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';
import { checkValidPickupAmountNumber } from './../../utils/errorhandler';
import { localization } from './../../constraints/localization';
import MessageLineComponent from './../message/message-line.component';

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
      self.setState({editable: editable});
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
      var tree: TreeModel = treeStore.getTree(self.props.treeId);
      let food: FoodModel = foodStore.getFood(tree.getFoodId());
      let image: JSX.Element;
      if (self.state.image) {
        image = <ImageZoomComponent image={self.state.image} onClose={self.onImageClose}  title={food.getName() + tree.getName() + " - " + self.props.note.getFormattedDate()} />;
      }
      let images: Array<JSX.Element> = self.props.note.getImages().map(function(image: string, i: number) {
        if (i == 0) {
          if (self.state.editable) {
            return (
              <div className={styles.image + " " + styles.selected} key={"noteimage" + i}>
                <div className={styles.cover}>
                  cover
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
              <div className={styles.image + " " + styles.selected} key={"noteimage" + i}>
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
              <div className={styles.image} key={"noteimage" + i}>
                <div className={styles.cover2} onClick={()=> {
                  self.onImageClick(image);
                }}>
                  set as a cover
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
              <div className={styles.image} key={"noteimage" + i}>
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
        return (
          <div className={styles.wrapper}>
            {images}
            <div className={styles.image}>
              <input className={styles.upload} type="file" accept="image/*" capture="camera" onChange={(event: any)=> {
                if (event.target.files[0] != null) {
                  uploadImage(event.target.files[0], tree.getId().toString(), function(filename: string) {  // success
                    self.props.note.addImage(filename);
                    self.forceUpdate();
                  }, function() { // fail

                  });
                }
              }} />
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
              UPDATE
            </div>
            <MessageLineComponent code={self.props.code} match={[90, 91, 92, 93]} />
            <div className={styles.button2} onClick={()=> {
              self.context.router.push({pathname: Settings.uBaseName + '/tree/' + self.props.treeId});
            }}>
              CLOSE
            </div>
            <div className={styles.or}>
              OR
            </div>
            <div className={styles.button3} onClick={()=> {
              self.context.router.push({pathname: window.location.pathname, query: { note: self.props.note.getId(), mode: "delete" }});
            }}>
              DELETE
            </div>
            {image}
          </div>
        );
      } else {
        return (
          <div className={styles.wrapper}>
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
        <div className={styles.wrapper}>
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
