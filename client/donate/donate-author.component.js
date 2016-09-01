import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';
import { isValidEmailAddressOrBlank } from './../utils/validation';
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';

require('./donate-author.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');
import { localization } from './../utils/localization';
import { NOTETYPE } from './../utils/enum';
let DonateStore = require('./../stores/donate.store');
let DonateActions = require('./../actions/donate.actions');

export default class DonateAuthor extends React.Component {
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
      this.setState({author: props.donate.person});
    } else {
      this.setState({author: ""});
    }

  }
  updateAttribute() {
    let error = null;
    try {
      isValidEmailAddressOrBlank(this.state.author.trim());
      let prevAuthor = this.props.donate.person;
      if (this.state.author) {
        this.props.donate.person = this.state.author;
        this.setState({author: this.props.donate.person});
      } else {
        this.setState({author: ""});
      }
      if (prevAuthor != this.state.author) {
        DonateActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
      }
    } catch(e) {
      this.setState({author: ""});
      displayFailMessage(localization(e.message));
      if (__DEV__) {
        console.error(localization(e.message));
      }
      error = e.message;
    }
  }
  render () {
    let style = "";
    if (this.props.donate.type == NOTETYPE.DONATE) {
      style = " donate-comment-brown";
    }
    if (this.props.editing) {
      return (
        <div className={"donate-author-wrapper" + style}>
          <div className="donate-author-label">
            <FontAwesome className='' name='user' />{localization(64)}
          </div>
          <div className="donate-author-data">
            <input type="email" name="email" className="donate-author-input" id={"author-contact"} key={"author-contact"} placeholder={localization(682)}
              value={this.state.author}
              autoComplete
              onChange={(event: any)=> {
                this.setState({author: event.target.value.trim()});
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
      let author = this.state.author;
      if (author == null || author.trim() == "") {
        author = localization(63);
      }
      return (
        <div className={"donate-author-wrapper" + style}>
          <div className="donate-author-label">
            <FontAwesome className='' name='user' />{localization(64)}
          </div>
          <div className="donate-author-data">
            <div className="donate-author-text">
              {author}
            </div>
          </div>
        </div>
      );
    }
  }
}
