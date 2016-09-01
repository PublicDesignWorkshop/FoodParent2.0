import React from 'react';
import ReactDOM from 'react-dom';

let IScroll = require('iscroll');
let loadImage = require('blueimp-load-image');
import $ from 'jquery';

require('./image-zoom.component.scss');

let ServerSetting = require('./../../setting/server.json');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';

export default class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {

  }
  componentDidMount () {
    let file = this.props.image;
    let wrapper = ReactDOM.findDOMNode(this.refs['wrapper']);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", this.props.image);
    xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
    xhr.onload = function()
    {
      loadImage.parseMetaData(
        xhr.response,
        function (data) {
          let orientation = 1;
          // Extract image header data.
          if (data.imageHead && data.exif) {
            orientation = data.exif[0x0112];
          }
          loadImage(
            file,
            function (img) {
              $('#image-zoom').html(img);
              let scroll = new IScroll("#image-zoom", {
                zoom: true,
                scrollX: true,
                scrollY: true,
                mouseWheel: true,
                wheelAction: "zoom"
              });
            },
            {
                canvas: true,
                orientation: orientation,
                // maxWidth: wrapper.clientWidth,
                maxHeight: wrapper.clientHeight,
            }
          );
        },
        {
          maxMetaDataSize: 262144,
          disableImageHead: false
        }
      );
    }
    xhr.send();
  }
  componentWillReceiveProps(nextProps) {

  }
  render () {
    return (
      <div className="image-zoom-wrapper">
        <div className="image-zoom-label" onClick={this.props.onZoomClose}>
          {localization(72)} <FontAwesome className='' name='close' />
        </div>
        <div ref="wrapper" id="image-zoom" className="image-zoom-content">
        </div>
      </div>
    );
  }
}
