import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import AltContainer from 'alt-container';
import moment from 'moment';

require('./note-graph.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
import NoteLine from './../note/note-line.component';
import { sortNoteByDateASC } from './../utils/sort';
import { NOTETYPE } from './../utils/enum';
let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let AuthStore = require('./../stores/auth.store');
import { google10Color } from './../utils/color';


export default class NoteDonateGraph extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.donates = [];
    this.drawTimer;
  }
  componentWillMount() {
    this.setState({width: 0, height: 0, legend: null});
  }
  componentDidMount () {
    $(window).resize(function() {
      this.updateCanvasSize(true);
    }.bind(this));
    this.updateCanvasSize(false);
  }
  componentWillReceiveProps(nextProps) {
    this.renderGraph(nextProps, false);
  }
  componentWillUnmount() {
    $(window).off("resize");
    if (this.drawTimer) {
      clearTimeout(this.drawTimer);
    }
  }
  updateCanvasSize(first) {
    let wrapper = ReactDOM.findDOMNode(this.refs['wrapper']);
    this.setState({width: wrapper.clientWidth, height: ServerSetting.iTreeDonationGraphHeight});
    setTimeout(function() {
      this.renderGraph(this.props, first);
    }.bind(this));
  }
  renderGraph(props, first) {
    if (this.drawTimer) {
      clearTimeout(this.drawTimer);
    }
    this.drawTimer = setTimeout(function() {
      let rendering = false;
      if (this.donates && this.donates.length == 0) {
        rendering = true;
      } else if (this.donates.length != props.donates.length) {
        rendering = true;
      } else {
        let bFound = false;
        for (let i = 0; i < props.donates.length && !bFound; i++) {
          if (this.donates[i].id != props.donates[i].id || this.donates[i].amount != props.donates[i].amount) {
            bFound = true;
          }
        }
        if (bFound) {
          rendering = true;
        }
      }
      this.donates = props.donates.slice();
      if ((first || rendering) && props.donates) {
        console.log("Drawing an donate chart.");
        this.ready = false;
        let rCanvas = ReactDOM.findDOMNode(this.refs['canvas-donate']);
        let ctx = rCanvas.getContext("2d");

        let lists = [[]];
        let donates = props.donates.sort(sortNoteByDateASC);
        let currentYear = moment(new Date()).year();
        let earlestYear;
        let latestYear;
        let max;
        let min;
        if (donates.length == 0) {
          earlestYear = currentYear;
          latestYear = currentYear;
        } else {
          earlestYear = moment(donates[0].date).year();
          latestYear = moment(donates[donates.length - 1].date).year();
          for (let j = 0; j < donates.length; j++) {
            for (let i = earlestYear; i <= latestYear; i++) {
              if (donates[j].date.year() == i) {
                if (donates[j].type == NOTETYPE.DONATE) {
                  if (lists[i - earlestYear] == null) {
                    lists[i - earlestYear] = [];
                  }
                  let accum = 0;
                  if (lists[i - earlestYear].length > 0) {
                    accum = parseFloat(lists[i - earlestYear][lists[i - earlestYear].length - 1].y);
                  }
                  lists[i - earlestYear].push({x: moment(donates[j].date).year(currentYear).toDate(), y: (donates[j].amount + accum).toFixed(ServerSetting.iAmountPrecision), r: 1});
                }
              }
            }
          }
        }
        let data = [];
        for (let i = 0; i < lists.length; i++) {
          data.push({
            label: i + earlestYear,
    				strokeColor: google10Color(i + earlestYear),
    				data: lists[i] != null ? lists[i] : [],
          });
        }
        console.log(data);
        let chart = new Chart(ctx).Scatter(data, {
          bezierCurve: false,
          bezierCurveTension: 0.3,
  				showTooltips: true,
  				scaleShowHorizontalLines: true,
  				scaleShowLabels: true,
  				scaleType: "date",
          scaleLabel: "<%=value%> lbs.",

          // Interpolated JS string - can access point fields:
          // argLabel, valueLabel, arg, value, datasetLabel, size
          scaleDateTimeFormat: "mmm dd, ",
          tooltipTemplate: "<%=argLabel%><%if (datasetLabel){%><%=datasetLabel%><%}%>: <%=valueLabel%>",

          // Interpolated JS string - can access point fields:
          // argLabel, valueLabel, arg, value, datasetLabel, size
          multiTooltipTemplate: "<%=argLabel%><%if (datasetLabel){%><%=datasetLabel%><%}%>: <%=valueLabel%>",

          // Interpolated JS string - can access all chart fields
          legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><%for(var i=0;i<datasets.length;i++){%><li><span class=\"<%=name.toLowerCase()%>-legend-marker\" style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%=datasets[i].label%></li><%}%></ul>"
        });
        this.setState({legend: chart.generateLegend()});
      }
    }.bind(this), 1000);
  }
  render () {
    let canvasStyle = {width: this.state.width, height: this.state.height};
    return (
      <div ref="wrapper" className="note-graph-wrapper">
        <div className="note-graph-label">{localization(38)}</div>
        <canvas ref="canvas-donate" className="donate-graph-canvas" style={canvasStyle} />
      </div>
    );
  }
}
//<div dangerouslySetInnerHTML={{__html: this.state.legend}} />
