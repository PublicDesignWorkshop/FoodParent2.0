import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';
import * as moment from 'moment';

var Settings = require('./../../constraints/settings.json');
import * as styles from './donate-edit.component.css';
import { LocationModel, locationStore } from './../../stores/location.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { uploadImage } from './../../utils/upload';
import { AmountType } from './../../stores/note.store';
import { donateStore, DonateModel } from './../../stores/donate.store';
import DonateCommentComponent from './donate-comment.component';
import DonateDateComponent from './donate-date.component';
import DonateAmountComponent from './donate-amount.component';
import DonateFoodComponent from './donate-food.component';
import ImageZoomComponent from './../image/image-zoom.component';
import { donateActions } from './../../actions/donate.actions';
import { authStore } from './../../stores/auth.store';
import { treeStore } from './../../stores/tree.store';
import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';
import { checkValidDonateAmountNumber } from './../../utils/errorhandler';
import { localization } from './../../constraints/localization';
import MessageLineComponent from './../message/message-line.component';
import DonateSourceComponent from './donate-source.component';

export interface IDonateEditProps {
  locationId: number;
  donate?: DonateModel;
  code?: any;
}
export interface IDonateEditStatus {
  editable?: boolean;
  image?: string;
  error?: any;
}
export default class DonateEditComponent extends React.Component<IDonateEditProps, IDonateEditStatus> {
  static contextTypes: any;
  constructor(props : IDonateEditProps) {
    super(props);
    let self: DonateEditComponent = this;
    this.state = {
      editable: false,
      image: null,
      error: null,
    };
  }
  public componentDidMount() {
    let self: DonateEditComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: DonateEditComponent = this;
    setTimeout(function() {
      donateActions.resetTempDonate();
    }, 0);
  }
  public componentWillReceiveProps (nextProps: IDonateEditProps) {
    let self: DonateEditComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: IDonateEditProps) => {
    let self: DonateEditComponent = this;
    if (props.donate != null) {
      let editable: boolean = false;
      if (authStore.getAuth().getIsManager()) {
        editable = true;
      } else {
        if (props.donate.getPersonId() == authStore.getAuth().getId() && authStore.getAuth().getId() != 0) {
          editable = true;
        }
      }
      self.setState({editable: editable});
    }
  }

  private onImageClick = (image: string) => {
    let self: DonateEditComponent = this;
    self.props.donate.setCoverImage(image);
    self.forceUpdate();
  }

  private onImageZoom = (image: string) => {
    let self: DonateEditComponent = this;
    image = image.replace("_thumb", "_dest");
    self.setState({image: image});
  }

  private onImageClose = () => {
    let self: DonateEditComponent = this;
    self.setState({image: null});
  }

  private submitUpdate = () => {
    let self: DonateEditComponent = this;
    let error: any = null;
    try {
      checkValidDonateAmountNumber(self.props.donate.getAmount());
      donateActions.updateDonate(self.props.donate);
    } catch(e) {
      displayErrorMessage(localization(e.message));
      error = e.message;
    }
    self.setState({error: error});
  }

  render() {
    let self: DonateEditComponent = this;
    if (self.props.locationId && self.props.donate != null) {
      var location: LocationModel = locationStore.getLocation(self.props.locationId);
      let food: FoodModel = foodStore.getFood(self.props.donate.getFoodId());
      let image: JSX.Element;
      if (self.state.image) {
        image = <ImageZoomComponent image={self.state.image} onClose={self.onImageClose} title={food.getName() + " at " + location.getName() + " - " + self.props.donate.getFormattedDate()} />;
      }
      let images: Array<JSX.Element> = self.props.donate.getImages().map(function(image: string, i: number) {
        if (i == 0) {
          return (
            <div className={styles.image + " " + styles.selected} key={"donateimage" + i}>
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
            <div className={styles.image} key={"donateimage" + i}>
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
        }
      });
      return (
        <div className={styles.wrapper}>
          {images}
          <div className={styles.image}>
            <input className={styles.upload} type="file" accept="image/*" capture="camera" onChange={(event: any)=> {
              if (event.target.files[0] != null) {
                uploadImage(event.target.files[0], "d" + location.getId().toString(), function(filename: string) {  // success
                  console.log("Image file uploaded: " + filename);
                  self.props.donate.addImage(filename);
                  self.forceUpdate();
                }, function() { // fail

                });
              }
            }} />
          </div>
          <div className={styles.inner}>
            <AltContainer stores={
              {
                foods: function (props) {
                  return {
                    store: foodStore,
                    value: foodStore.getState().foods
                  };
                }
              }
            }>
              <DonateFoodComponent donate={self.props.donate} editable={self.state.editable} async={false} />
            </AltContainer>
            <AltContainer stores={
              {
                trees: function (props) {
                  return {
                    store: treeStore,
                    value: treeStore.getState().trees
                  };
                }
              }
            }>
              <DonateSourceComponent donate={self.props.donate} editable={self.state.editable} async={false} />
            </AltContainer>
            <DonateCommentComponent donate={self.props.donate} editable={self.state.editable} async={false} />
            <DonateDateComponent donate={self.props.donate} editable={self.state.editable} async={false} />
            <DonateAmountComponent donate={self.props.donate} editable={self.state.editable} async={false} error={self.state.error} />
          </div>
          <MessageLineComponent code={self.props.code} match={[90, 91, 92, 93]} />
          <div className={styles.button} onClick={()=> {
            if (self.props.code == 200) {
              self.submitUpdate();
            }
          }}>
            UPDATE
          </div>
          <div className={styles.button2} onClick={()=> {
            self.context.router.push({pathname: Settings.uBaseName + '/donation/' + self.props.locationId});
          }}>
            CLOSE
          </div>
          <div className={styles.or}>
            OR
          </div>
          <div className={styles.button3} onClick={()=> {
            self.context.router.push({pathname: window.location.pathname, query: { donate: self.props.donate.getId(), mode: "delete" }});
          }}>
            DELETE
          </div>
          {image}
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

DonateEditComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
