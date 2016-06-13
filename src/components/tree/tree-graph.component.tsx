import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';
import * as moment from 'moment';

var Settings = require('./../../constraints/settings.json');
import * as styles from './tree-graph.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { NoteModel, noteStore, NoteType, PickupTime } from './../../stores/note.store';
import { sortNoteByDateASC } from './../../utils/sort';
import { google10Color } from './../../utils/color';
import { isTouchDevice, isMobile } from './../../utils/device';


export interface ITreeGraphOption {
  x: Date;
  y: number;
  r: number;
  tooltip: any;
}

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
        let lists: Array<Array<ITreeGraphOption>> = new Array<Array<ITreeGraphOption>>();
        let notes: Array<NoteModel> = props.notes.sort(sortNoteByDateASC);
        let currentYear: number = moment(new Date()).year();
        let earlestYear: number = moment(notes[0].getDate()).year();
        let latestYear: number = moment(notes[notes.length - 1].getDate()).year();
        notes.forEach((note: NoteModel) => {
          for (let i = earlestYear; i <= latestYear; i++) {
            if (note.getDate().year() == i) {
              if (lists[i - earlestYear] == null) {
                lists[i - earlestYear] = Array<ITreeGraphOption>();
              }
              let tooltip: Array<string> = new Array<string>();
              if (note.getNoteType() == NoteType.POST) {
                lists[i - earlestYear].push({x: moment(note.getDate()).year(currentYear).toDate(), y: note.getRate(), r: 1, tooltip: note.getId()});
              } else if (note.getNoteType() == NoteType.PICKUP) {
                lists[i - earlestYear].push({x: moment(note.getDate()).year(currentYear).toDate(), y: note.getRate(), r: 1.5, tooltip: note.getId()});
              }
            }
          }
        });
        let data = [];
        for (let i = 0; i < lists.length; i++) {
          data.push({
            label: i + earlestYear,
    				strokeColor: google10Color(i + earlestYear),
    				data: lists[i],
          })
        }

        let chart = new Chart(ctx).Scatter(data, {
  				bezierCurve: true,
  				showTooltips: true,
  				scaleShowHorizontalLines: true,
  				scaleShowLabels: true,
  				scaleType: "date",
  				scaleLabel: "★x<%=value%>",
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
                }, 1000);
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
          tooltipTemplate: "<%=tooltip%>"
  			});
      }
    }, 500);
  }

  render() {
    let self: TreeGraphComponent = this;
    var divStyle = {
      left: self.state.x,
      top: self.state.y,
    };
    let note: NoteModel = noteStore.getNote(self.state.noteId);
    let tooltip: JSX.Element = <div id="tooltip" style={divStyle} className={styles.tooltip + " " + styles.hidden}></div>;
    if (note && self.state.visible) {
      let image: JSX.Element;
      if (note.getImage(0)) {
         image = <img className={styles.image} src={Settings.uBaseName + Settings.uContentImage + note.getImage(0)} />;
      }
      let comment: JSX.Element;
      if (note.getNoteType() == NoteType.POST) {
        comment = <div className={styles.comment}>{note.getComment()}</div>;
      } else if (note.getNoteType() == NoteType.PICKUP) {
        if (note.getPicupTime() == PickupTime.EARLY) {
          comment = <div className={styles.comment}>{Math.floor(note.getAmount()).toLocaleString() + "g (early)"}</div>;
        } else if (note.getPicupTime() == PickupTime.PROPER) {
          comment = <div className={styles.comment}>{Math.floor(note.getAmount()).toLocaleString() + "g (proper)"}</div>;
        } else if (note.getPicupTime() == PickupTime.LATE) {
          comment = <div className={styles.comment}>{Math.floor(note.getAmount()).toLocaleString() + "g (late)"}</div>;
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
