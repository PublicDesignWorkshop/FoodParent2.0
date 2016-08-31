import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import moment from 'moment';
import ImageGallery from 'react-image-gallery';

require('./note-image.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';
import { uploadImage } from './../utils/upload';
import { localization } from './../utils/localization';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
let NoteStore = require('./../stores/note.store');
let TreeStore = require('./../stores/tree.store');
let NoteActions = require('./../actions/note.actions');
import ImageZoom from './../image/image-zoom.component';


export default class NoteImage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.handleZoomClose = this.handleZoomClose.bind(this);
  }
  componentWillMount() {
    this.setState({uploading: false, width: 0, height: 0, zoomImage: ""});
  }
  componentDidMount () {
    this.updatePros(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.updatePros(nextProps);
  }
  updatePros(props) {
    let rWrapper = ReactDOM.findDOMNode(this.refs['wrapper']);
    if (rWrapper) {
      this.setState({width: rWrapper.clientWidth, height: Math.floor(rWrapper.clientWidth * 9 / 16)});
    }
    if (props.editing) {
      this.handlePause();
    } else {
      this.handlePlay();
    }
  }
  handleImageLoad(event) {
    // console.log('Image loaded ', event.target);
  }

  handlePlay() {
    if (this._imageGallery)
      this._imageGallery.play();
  }
  handlePause() {
    if (this._imageGallery) {
      this._imageGallery.pause();
    }
  }
  handleFullScreen() {
    if (this._imageGallery)
      this._imageGallery.fullScreen();
  }
  handleClick() {
    if (this._imageGallery) {
      this.setState({zoomImage: this.props.note.images[this._imageGallery.getCurrentIndex()]});
      // console.log(this._imageGallery.getCurrentIndex());
    }
  }
  handleZoomClose() {
    this.setState({zoomImage: ""});
  }
  render () {
    let style = "";
    if (this.props.note.type == NOTETYPE.UPDATE) {
      style = " note-image-brown";
    }
    let gallery;
    if (this.props.note.images && this.props.note.images.length > 0) {
      let images = this.props.note.images.map(function(image, index) {
        return {
          // imageId: "gallery-image-" + image.replace(".jpeg", "").split('_').join('-'),
          original: ServerSetting.uBase + ServerSetting.uContentImage + image,
          thumbnail: ServerSetting.uBase + ServerSetting.uContentImage + image,
          originalSize: [this.state.width, this.state.height],
          thumbnailSize: [Math.floor(this.state.width * 0.2), Math.floor(this.state.height * 0.25)],
        };
        // return (
        //   <div className="image" key={"noteimage" + index}>
        //     <img src={ServerSetting.uBase + ServerSetting.uContentImage + image} />
        //   </div>
        // );
      }.bind(this));
      gallery = <div data-for="tooltip-note-image" data-tip={localization(68)}>
        <ImageGallery ref={i => this._imageGallery = i} items={images} slideInterval={ServerSetting.iGallerySlideInterval} onImageLoad={this.handleImageLoad} onClick={this.handleClick} />
      </div>

      // gallery = this.props.note.images.map(function(image, index) {
      //   return (
      //     <div className="image" key={"noteimage" + index}>
      //       <img src={ServerSetting.uBase + ServerSetting.uContentImage + image} />
      //     </div>
      //   );
      // });
    } else if (!this.props.editing) {
      gallery = <div className="no-image">{localization(69) /* No photos. */}</div>
    }
    let imageUpload;
    if (this.state.uploading) {
      imageUpload = <div className="loading-text">{localization(23)}</div>;
    } else if (this.props.editing) {
      imageUpload = <input className="image-upload" type="file" accept="image/*" capture="camera" onChange={(event)=> {
        if (event.target.files[0] != null) {
          this.setState({uploading: true});
          uploadImage(event.target.files[0], ServerSetting.sNoteImagePrefix + TreeStore.getState().selected, function(filename, datetime) {  // Resolve
            if (__DEV__)
              console.log(`Image file uploaded: ${filename}`);
            if (datetime) {
              let date = moment(datetime, ServerSetting.sEXIFDateFormat);
              if (date.isValid()) {
                this.props.note.date = date;
                NoteActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
                displaySuccessMessage(localization(674) + " <strong>" + date.format(ServerSetting.sUIDateFormat) + "</stong>");
              }
            }
            this.props.note.addImage(filename);
            this.setState({uploading: false});
          }.bind(this), function(response) { // Reject.
            displayFailMessage(localization(response));
          }.bind(this));
        }
      }} />
    }
    let imageZoom;
    if (this.state.zoomImage && this.state.zoomImage != "") {
      imageZoom = <ImageZoom image={ServerSetting.uBase + ServerSetting.uContentImage + this.state.zoomImage.replace("_thumb", "_dest")} onZoomClose={this.handleZoomClose} />;
    }
    let imageRemove;
    if (this.props.editing && this.props.note.images && this.props.note.images.length > 0) {
      imageRemove = <div className="solid-button-group no-left-right-padding">
        <div className="solid-button solid-button-red" onClick={() => {
          this.props.note.removeImage(this.props.note.images[this._imageGallery.getCurrentIndex()]);
          if (this._imageGallery) {
            this._imageGallery.slideToIndex(Math.max(0, this._imageGallery.getCurrentIndex()-1));
          }
          NoteActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
        }}>
          {localization(67) /* DELETE SELECTED IMAGE */}
        </div>
      </div>
    }
    return (
      <div ref="wrapper" className={"note-image-wrapper" + style}>
        <div className="note-image-label">
          <FontAwesome className='' name='file-photo-o' />{localization(70)}
        </div>
        <div className="note-image-data">
          {imageUpload}
          {gallery}
          {imageRemove}
        </div>
        {imageZoom}
        <ReactTooltip id="tooltip-note-image" effect="solid" place="top" />
      </div>
    );
  }
}
