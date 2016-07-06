import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as moment from 'moment';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './tree-graph.component.css';
var Settings = require('./../../constraints/settings.json');

import { TreeModel } from './../../stores/tree.store';
import { NoteModel, noteStore } from './../../stores/note.store';

import { sortNoteByDateASC } from './../../utils/sort';
import { google10Color } from './../../utils/color';
import { isTouchDevice, isMobile } from './../../utils/device';
import { IGraphOption, NoteType, PickupTime } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface ITreeGraphProps {
  tree?: TreeModel;
  notes?: Array<NoteModel>;
}
export interface ITreeGraphStatus {
  noteId?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  visible?: boolean;
  clicked?: boolean;
  legend?: string;
}

export default class TreeGraphComponent extends React.Component<ITreeGraphProps, ITreeGraphStatus> {
  private timeout: any;
  static contextTypes: any;
  constructor(props : ITreeGraphProps) {
    super(props);
    let self: TreeGraphComponent = this;
    this.state = {
      visible: false,
      clicked: false,
      width: 0,
      height: 0,
    };
  }
  public componentDidMount() {
    let self: TreeGraphComponent = this;
    self.updateProps(self.props);
    let rWrapper = ReactDOM.findDOMNode(self.refs['wrapper']);
    self.setState({width: rWrapper.clientWidth - 16, height: Math.floor((rWrapper.clientWidth - 16) * 9 / 16)});
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreeGraphComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreeGraphProps) {
    let self: TreeGraphComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: ITreeGraphProps) {
    let self: TreeGraphComponent = this;
    if (self.timeout) {
      clearTimeout(self.timeout);
    }
    self.timeout = setTimeout(function() {
      if (self.state.width && self.state.height) {
        let rChart: any = document.getElementById("chart");
        let ctx = rChart.getContext("2d");
        let lists: Array<Array<IGraphOption>> = new Array<Array<IGraphOption>>();
        let notes: Array<NoteModel> = props.notes.sort(sortNoteByDateASC);
        let currentYear: number = moment(new Date()).year();
        let earlestYear: number;
        let latestYear: number;
        let max: number;
        let min: number;
        if (notes.length == 0) {
          earlestYear = currentYear;
          latestYear = currentYear;
        } else {
          earlestYear = moment(notes[0].getDate()).year();
          latestYear = moment(notes[notes.length - 1].getDate()).year();
          max = 0;
          min = Number.MAX_VALUE;
          notes.forEach((note: NoteModel) => {
            if (note.getNoteType() == NoteType.PICKUP && note.getAmount() > max) {
              max = note.getAmount();
            }
            if (note.getNoteType() == NoteType.PICKUP && note.getAmount() < min) {
              min = note.getAmount();
            }
          });
        }

        notes.forEach((note: NoteModel) => {
          for (let i = earlestYear; i <= latestYear; i++) {
            if (note.getDate().year() == i) {
              if (lists[2 * (i - earlestYear)] == null) {
                lists[2 * (i - earlestYear)] = Array<IGraphOption>();
              }
              if (lists[2 * (i - earlestYear) + 1] == null) {
                lists[2 * (i - earlestYear) + 1] = Array<IGraphOption>();
              }
              if (note.getNoteType() == NoteType.POST) {
                lists[2 * (i - earlestYear)].push({x: moment(note.getDate()).year(currentYear).toDate(), y: note.getRate(), r: 1.25, tooltip: note.getId()});
              } else if (note.getNoteType() == NoteType.PICKUP) {
                lists[2 * (i - earlestYear) + 1].push({
                  x: moment(note.getDate()).year(currentYear).toDate(),
                  y: Math.floor(5 * (note.getAmount() - min) / (max - min)) + 0.5,
                  r: 2,
                  tooltip: note.getId()
                });
              }
            }
          }
        });
        let data = [];
        for (let i = 0; i < lists.length; i++) {
          data.push({
            label: Math.floor(i / 2) + earlestYear,
    				strokeColor: google10Color(Math.floor(i / 2) + earlestYear),
    				data: lists[i],
          })
        }

        let chart = new Chart(ctx).Scatter(data, {
  				bezierCurve: true,
  				showTooltips: true,
  				scaleShowHorizontalLines: true,
  				scaleShowLabels: true,
  				scaleType: "date",
  				// scaleLabel: "<% if (value <= 5) { %>★x<%=value%><% } %>",
          scaleLabel: "<%  %>",
          customTooltips: function(tooltip) {
            if (self.state.clicked) {
              if (tooltip.text && self.state.noteId != parseInt(tooltip.text)) {
                let x = tooltip.x;
                if (tooltip.x > self.state.width / 2) {
                  x -= $("#tooltip").outerWidth();
                }
                let y = tooltip.y;
                if (tooltip.y > self.state.height / 2) {
                  y -= $("#tooltip").outerHeight();
                }
                self.setState({x: x, y: ($("#wrapper").offset().top + y), noteId: parseInt(tooltip.text), visible: true, clicked: false});
              } else if (isTouchDevice() && isMobile() && !tooltip.text) {
                setTimeout(function () {
                  self.setState({visible: false, clicked: false});
                }, Settings.iPopupDelay);
              }
            } else {
              if (!tooltip.text) {
                self.setState({visible: false});
              } else {
                let x = tooltip.x;
                if (tooltip.x > self.state.width / 2) {
                  x -= $("#tooltip").outerWidth();
                }
                let y = tooltip.y;
                if (tooltip.y > self.state.height / 2) {
                  y -= $("#tooltip").outerHeight();
                }
                self.setState({x: x, y: ($("#wrapper").offset().top + y), noteId: parseInt(tooltip.text), visible: true});
              }
            }
          },
          // Boolean - If we want to override with a hard coded y scale
          scaleOverride: true,
          // ** Required if scaleOverride is true **
          // Number - The number of steps in a hard coded y scale
          scaleSteps: 6,
          // Number - The value jump in the hard coded y scale
          scaleStepWidth: 1,
          // Number - The y scale starting value
          scaleStartValue: 0,
          tooltipTemplate: "<%=tooltip%>",
          legendTemplate: "<div class=\"<%=name.toLowerCase()%>-legend\"><%for(var i=0;i<datasets.length;i+=2){%><div><span class=\"<%=name.toLowerCase()%>-legend-marker\" style=\"background-color:<%=datasets[i].strokeColor%>\"></span><span><%=datasets[i].label%></span></div><%}%></div>"
  			});
        self.setState({legend: chart.generateLegend()});
      }
    }, Settings.iGraphDelay);
  }

  render() {
    let self: TreeGraphComponent = this;
    var divStyle = {
      left: self.state.x,
      top: self.state.y,
      width: Math.floor(self.state.width * 0.3),
    };
    var imgStyle = {
      width: Math.floor(self.state.width * 0.3) - 24,
      height: Math.floor((self.state.width * 0.3 - 24) * 9 / 16),
    };
    let note: NoteModel = noteStore.getNote(self.state.noteId);
    let tooltip: JSX.Element = <div id="tooltip" style={divStyle} className={styles.tooltip + " " + styles.hidden}></div>;
    if (note && self.state.visible) {
      let image: JSX.Element;
      if (note.getImage(0)) {
         image = <img style={imgStyle} className={styles.image} src={Settings.uBaseName + Settings.uContentImage + note.getImage(0)} />;
      }
      let comment: JSX.Element;
      if (note.getNoteType() == NoteType.POST) {
        comment = <div className={styles.comment}>{note.getComment()}</div>;
      } else if (note.getNoteType() == NoteType.PICKUP) {
        if (note.getPicupTime() == PickupTime.EARLY) {
          comment = <div className={styles.comment}>{Math.floor(note.getAmount()).toLocaleString() + "lbs. (" + localization(988) + ")"}</div>;
        } else if (note.getPicupTime() == PickupTime.PROPER) {
          comment = <div className={styles.comment}>{Math.floor(note.getAmount()).toLocaleString() + "lbs. (" + localization(989) + ")"}</div>;
        } else if (note.getPicupTime() == PickupTime.LATE) {
          comment = <div className={styles.comment}>{Math.floor(note.getAmount()).toLocaleString() + "lbs. (" + localization(990) + ")"}</div>;
        }
      }
      if (self.state.clicked) {
        tooltip = <div id="tooltip" style={divStyle} className={styles.tooltip}>
          <div className={styles.button} onClick={()=> {
            self.context.router.push({pathname: window.location.pathname, query: { note: self.state.noteId }});
          }}>
            <div><span>Posted on </span><span className={styles.highlight}>{note.getFormattedDate()}</span></div>
            {image}
            {comment}
          </div>
        </div>;
      } else {
        tooltip = <div id="tooltip" style={divStyle} className={styles.tooltip + " " + styles.unclicked}>
          <div className={styles.button}>
            <div><span>Posted on </span><span className={styles.highlight}>{note.getFormattedDate()}</span></div>
            {image}
            {comment}
          </div>
        </div>;
      }
    }
    return (
      <div id="wrapper" ref="wrapper" className={styles.wrapper}>
        <canvas id="chart" ref="chart" className={styles.canvas} width={self.state.width} height={self.state.height} onClick={()=> {
          if (self.state.visible) {
            self.setState({clicked: true});
          } else {
            self.setState({clicked: false});
          }
        }} />
        <div dangerouslySetInnerHTML={{__html: self.state.legend}} />
        {tooltip}
      </div>
    )
  }
}

TreeGraphComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
