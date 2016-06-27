import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as moment from 'moment';

import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './donate-graph.component.css';
var Settings = require('./../../constraints/settings.json');

import { LocationModel } from './../../stores/location.store';
import { DonateModel, donateStore } from './../../stores/donate.store';
import { FoodModel, foodStore } from './../../stores/food.store';

import { sortDonateByDateASC } from './../../utils/sort';
import { google10Color } from './../../utils/color';
import { isTouchDevice, isMobile } from './../../utils/device';
import { IGraphOption } from './../../utils/enum';
import { localization } from './../../constraints/localization';

export interface IDonateGraphProps {
  location?: LocationModel;
  donates?: Array<DonateModel>;
}
export interface IDonateGraphStatus {
  donateId?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  visible?: boolean;
  clicked?: boolean;
}

export default class DonateGraphComponent extends React.Component<IDonateGraphProps, IDonateGraphStatus> {
  private timeout: any;
  static contextTypes: any;
  constructor(props : IDonateGraphProps) {
    super(props);
    let self: DonateGraphComponent = this;
    this.state = {
      visible: false,
      clicked: false,
    };
  }

  public componentDidMount() {
    let self: DonateGraphComponent = this;
    self.updateProps(self.props);
    let rWrapper = ReactDOM.findDOMNode(self.refs['wrapper']);
    self.setState({width: rWrapper.clientWidth - 16, height: Math.floor((rWrapper.clientWidth - 16) * 9 / 16)});
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: DonateGraphComponent = this;
  }

  public componentWillReceiveProps (nextProps: IDonateGraphProps) {
    let self: DonateGraphComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IDonateGraphProps) {
    let self: DonateGraphComponent = this;
    if (self.timeout) {
      clearTimeout(self.timeout);
    }
    self.timeout = setTimeout(function() {
      if (self.state.width && self.state.height) {
        let rChart: any = document.getElementById("chart");
        let ctx = rChart.getContext("2d");
        let lists: Array<Array<IGraphOption>> = new Array<Array<IGraphOption>>();
        let donates: Array<DonateModel> = props.donates.sort(sortDonateByDateASC);
        let currentYear: number = moment(new Date()).year();
        let earlestYear: number;
        let latestYear: number;
        if (donates.length == 0) {
          earlestYear = currentYear;
          latestYear = currentYear;
        } else {
          earlestYear = moment(new Date()).year();
          latestYear = moment(donates[donates.length - 1].getDate()).year();
        }

        let accumulated: Array<number> = new Array<number>();
        donates.forEach((donate: DonateModel) => {
          for (let i = earlestYear; i <= latestYear; i++) {
            if (donate.getDate().year() == i) {
              if (lists[i - earlestYear] == null) {
                lists[i - earlestYear] = Array<IGraphOption>();
              }
              if (accumulated[i - earlestYear] == null) {
                accumulated[i - earlestYear] = 0;
              }
              accumulated[i - earlestYear] += donate.getAmount();
              lists[i - earlestYear].push({x: moment(donate.getDate()).year(currentYear).toDate(), y: accumulated[i - earlestYear], r: 1.25, tooltip: donate.getId()});
            }
          }
        });
        let isKilogram: boolean = false;
        accumulated.forEach((accum: number) => {
          if (accum > 100000) {
            isKilogram = true;
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
        let scaleLabel: string = "<%=parseFloat(value).toLocaleString()%>g";
        if (isKilogram) {
          scaleLabel = "<%=(parseFloat(value) * 0.001).toLocaleString()%>kg";
        }
        let chart = new Chart(ctx).Scatter(data, {
  				bezierCurve: true,
  				showTooltips: true,
  				scaleShowHorizontalLines: true,
  				scaleShowLabels: true,
  				scaleType: "date",
  				scaleLabel: scaleLabel,
          customTooltips: function(tooltip) {
            if (self.state.clicked) {
              if (tooltip.text && self.state.donateId != parseInt(tooltip.text)) {
                let x = tooltip.x;
                if (tooltip.x > self.state.width / 2) {
                  x -= $("#tooltip").outerWidth();
                }
                let y = tooltip.y;
                if (tooltip.y > self.state.height / 2) {
                  y -= $("#tooltip").outerHeight();
                }
                self.setState({x: x, y: ($("#wrapper").offset().top + y), donateId: parseInt(tooltip.text), visible: true, clicked: false});
              } else if (isTouchDevice() && isMobile() && !tooltip.text) {
                setTimeout(function () {
                  self.setState({visible: false, clicked: false});
                }, 100);
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
                self.setState({x: x, y: ($("#wrapper").offset().top + y), donateId: parseInt(tooltip.text), visible: true});
              }
            }
          },
          tooltipTemplate: "<%=tooltip%>"
  			});
      }
    }, Settings.iGraphDelay);
  }

  render() {
    let self: DonateGraphComponent = this;
    var divStyle = {
      left: self.state.x,
      top: self.state.y,
    };
    let donate: DonateModel = donateStore.getDonate(self.state.donateId);
    let tooltip: JSX.Element = <div id="tooltip" style={divStyle} className={styles.tooltip + " " + styles.hidden}></div>;
    if (donate && self.state.visible) {
      let image: JSX.Element;
      if (donate.getImage(0)) {
         image = <img className={styles.image} src={Settings.uBaseName + Settings.uContentImage + donate.getImage(0)} />;
      }
      let food: FoodModel = foodStore.getFood(donate.getFoodId());
      let comment: JSX.Element;
      if (food) {
        comment = <div className={styles.comment}>{food.getName() + ": " + Math.floor(donate.getAmount()).toLocaleString() + "g"}</div>;
      } else {
        comment = <div className={styles.comment}>{localization(613) + ": " + Math.floor(donate.getAmount()).toLocaleString() + "g"}</div>;
      }
      let list: Array<JSX.Element> = new Array<JSX.Element>();
      list.push(<span key={"tree"}>From </span>)
      donate.getTrees().forEach((treeId: number) => {
        list.push(<span className={styles.tree} key={"tree" + treeId}>{"#" + treeId}</span>);
      });
      if (self.state.clicked) {
        tooltip = <div id="tooltip" style={divStyle} className={styles.tooltip}>
          <div className={styles.button} onClick={()=> {
            self.context.router.push({pathname: window.location.pathname, query: { donate: self.state.donateId }});
          }}>
            <div><span>Posted on </span><span className={styles.highlight}>{donate.getFormattedDate()}</span></div>
            {image}
            <div className={styles.comment}>
              {comment}
            </div>
            {list}
          </div>
        </div>;
      } else {
        tooltip = <div id="tooltip" style={divStyle} className={styles.tooltip + " " + styles.unclicked}>
          <div className={styles.button}>
            <div><span>Posted on </span><span className={styles.highlight}>{donate.getFormattedDate()}</span></div>
            {image}
            <div className={styles.comment}>
              {comment}
            </div>
            {list}
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
DonateGraphComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
