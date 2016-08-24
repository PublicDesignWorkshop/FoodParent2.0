import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import AltContainer from 'alt-container';


require('./note-update-graph.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import NoteLine from './../note/note-line.component';

let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let AuthStore = require('./../stores/auth.store');


export default class NoteUpdateGraph extends React.Component {
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
    console.log(Chart);
    let rCanvas = ReactDOM.findDOMNode(this.refs['canvas-update']);
    let ctx = rCanvas.getContext("2d");

    var data = [
      {
        label: 'My First dataset',
        strokeColor: '#F16220',
        pointColor: '#F16220',
        pointStrokeColor: '#fff',
        data: [
          { x: 19, y: 65 },
          { x: 27, y: 59 },
          { x: 28, y: 69 },
          { x: 40, y: 81 },
          { x: 48, y: 56 }
        ]
      },
      {
        label: 'My Second dataset',
        strokeColor: '#007ACC',
        pointColor: '#007ACC',
        pointStrokeColor: '#fff',
        data: [
          { x: 19, y: 75, r: 4 },
          { x: 27, y: 69, r: 7 },
          { x: 28, y: 70, r: 5 },
          { x: 40, y: 31, r: 3 },
          { x: 48, y: 76, r: 6 },
          { x: 52, y: 23, r: 3 },
          { x: 24, y: 32, r: 4 }
        ]
      }
    ];
    new Chart(ctx).Scatter(data, {});
  }
  componentWillUnmount() {
    $(window).off("resize");
  }
  updateCanvasSize() {
    let wrapper = ReactDOM.findDOMNode(this.refs['wrapper']);
    this.setState({width: wrapper.clientWidth, height: 75});
  }
  render () {
    let canvasStyle = {width: this.state.width, height: this.state.height};
    return (
      <div ref="wrapper" className="note-graph-wrapper">
        <canvas ref="canvas-update" className="update-graph-canvas" style={canvasStyle} />
      </div>
    );
  }
}
