import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as moment from 'moment';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './donate-edit.component.css';
var Settings = require('./../../constraints/settings.json');

import DonateCommentComponent from './donate-comment.component';
import DonateDateComponent from './donate-date.component';
import DonateAmountComponent from './donate-amount.component';
import DonateFoodComponent from './donate-food.component';
import ImageZoomComponent from './../image/image-zoom.component';
import MessageLineComponent from './../message/message-line.component';
import DonateSourceComponent from './donate-source.component';

import { LocationModel, locationStore } from './../../stores/location.store';
import { FoodModel, foodStore } from './../../stores/food.store';
import { DonateModel } from './../../stores/donate.store';
import { donateActions } from './../../actions/donate.actions';
import { authStore } from './../../stores/auth.store';
import { treeStore } from './../../stores/tree.store';

import { displaySuccessMessage, displayErrorMessage } from './../../utils/message';
import { checkValidDonateAmountNumber } from './../../utils/errorhandler';
import { uploadImage } from './../../utils/upload';
import { AmountType } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface IDonateEditProps {
  locationId: number;
  donate?: DonateModel;
  code?: any;
}
export interface IDonateEditStatus {
  editable?: boolean;
  image?: string;
  error?: any;
  uploading?: boolean;
  width?: number;
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
      uploading:  false,
      width: 0,
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
      self.setState({editable: editable, width: (ReactDOM.findDOMNode(self.refs['wrapper']).clientWidth - 16) * 0.5});
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
      let imgStyle = {
        width: Math.floor(self.state.width),
        height: Math.floor(self.state.width * 9 / 16),
      };
      let location: LocationModel = locationStore.getLocation(self.props.locationId);
      let food: FoodModel = foodStore.getFood(self.props.donate.getFoodId());
      let image: JSX.Element;
      if (self.state.image) {
        image = <ImageZoomComponent image={self.state.image} onClose={self.onImageClose} title={food.getName() + " at " + location.getName() + " - " + self.props.donate.getFormattedDate()} />;
      }
      let images: Array<JSX.Element> = self.props.donate.getImages().map(function(image: string, i: number) {
        if (i == 0) {
          return (
            <div style={imgStyle} className={styles.image + " " + styles.selected} key={"donateimage" + i}>
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
            <div style={imgStyle} className={styles.image} key={"donateimage" + i}>
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
      let imageUpload: JSX.Element = <input className={styles.upload} type="file" accept="image/*" capture="camera" onChange={(event: any)=> {
        if (event.target.files[0] != null) {
          self.setState({uploading: true});
          uploadImage(event.target.files[0], "d" + location.getId().toString(), function(filename: string, datetime: string) {  // success
            self.setState({uploading: false});
            if (datetime != null && datetime != "") {
              let date: moment.Moment = moment(datetime, Settings.sEXIFDateFormat);
              console.log("Image file uploaded: " + filename + " - " + date.format(Settings.sUIDateFormat));
              displaySuccessMessage(localization(674) + " <strong>" + date.format(Settings.sUIDateFormat) + "</stong>");
              self.props.donate.setDate(date);
            } else {
              console.log("Image file uploaded: " + filename);
            }
            self.props.donate.addImage(filename);
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
            {localization(934)}
          </div>
          <div className={styles.button2} onClick={()=> {
            self.context.router.push({pathname: Settings.uBaseName + '/donation/' + self.props.locationId});
          }}>
            {localization(933)}
          </div>
          <div className={styles.or}>
            {localization(932)}
          </div>
          <div className={styles.button3} onClick={()=> {
            self.context.router.push({pathname: window.location.pathname, query: { donate: self.props.donate.getId(), mode: "delete" }});
          }}>
            {localization(931)}
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

DonateEditComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
