import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import Textarea from 'react-textarea-autosize';


require('./donate-comment.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { NOTETYPE, AMOUNTTYPE, PICKUPTIME } from './../utils/enum';
let DonateStore = require('./../stores/donate.store');
let DonateActions = require('./../actions/donate.actions');


export default class DonateComment extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.updateAttribute = this.updateAttribute.bind(this);
  }
  componentWillMount() {
    this.updateProps(this.props);
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    if (props.donate != null) {
      if (props.donate.comment && props.donate.comment.trim() != "") {
        this.setState({comment: props.donate.comment});
      } else {
        if (props.editing) {
          this.setState({comment: ""});
        } else {
          this.setState({comment: localization(95)});
        }
      }
    } else {
      this.setState({comment: localization(95)});
    }
  }
  updateAttribute() {
    let prevComment = this.props.donate.comment;
    if (this.state.comment && this.state.comment.trim() != "") {
      this.props.donate.comment = this.state.comment.trim();
      this.setState({comment: this.props.donate.comment});
    } else {
      this.setState({comment: ""});
    }
    if (prevComment != this.state.comment) {
      DonateActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    let style = "";
    if (this.props.donate.type == NOTETYPE.DONATE) {
      style = " donate-comment-brown";
    }
    if (this.props.editing) {
      return (
        <div className={"donate-comment-wrapper" + style}>
          <div className="donate-comment-label">
            <FontAwesome className='' name='comment-o' />{localization(999)}
          </div>
          <div className="donate-comment-data">
            <Textarea type="text" className="donate-comment-input" placeholder={localization(601)}
              value={this.state.comment}
              onChange={(event: any)=> {
                this.setState({comment: event.target.value});
              }}
              onKeyPress={(event)=> {
                if (event.key == 'Enter') {
                  this.updateAttribute();
                }
              }}
              onBlur={()=> {
                this.updateAttribute();
              }} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={"donate-comment-wrapper" + style}>
          <div className="donate-comment-label">
            <FontAwesome className='' name='comment-o' />{localization(999)}
          </div>
          <div className="donate-comment-data">
            <div className="donate-comment-text">
              {this.state.comment}
            </div>
          </div>
        </div>
      );
    }
  }
}
