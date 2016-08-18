import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import AltContainer from 'alt-container';

require('./note-graph.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import NoteLine from './../note/note-line.component';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let AuthStore = require('./../stores/auth.store');


export default class NoteGraph extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({width: 0, height: 0});
  }
  componentDidMount () {
    $(window).resize(function() {
        this.updateCanvasSize();
    }.bind(this));
    this.updateCanvasSize();
  }
  componentWillReceiveProps(nextProps) {
    $(window).off("resize");
  }
  updateCanvasSize() {
    let wrapper = ReactDOM.findDOMNode(this.refs['wrapper']);
    this.setState({width: wrapper.clientWidth, height: 100});
  }
  render () {
    let canvasStyle = {width: this.state.width, height: this.state.height};
    return (
      <div ref="wrapper" className="note-graph-wrapper">
        <canvas ref="canvas-update" className="update-graph-canvas" style={canvasStyle} />
        <canvas ref="canvas-pickup" className="pickup-graph-canvas" style={canvasStyle} />
        <canvas ref="canvas-donate" className="donate-graph-canvas" style={canvasStyle} />
      </div>
    );
  }
}
