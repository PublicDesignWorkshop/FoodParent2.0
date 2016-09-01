import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';

require('./header.component.scss');

let ServerSetting = require('./../../setting/server.json');
import Search from './search.component';
let MapStore = require('./../stores/map.store');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';
import { resetFilter } from './../utils/filter';
import { MAPTYPE, AUTHTYPE } from './../utils/enum';
let TreeActions = require('./../actions/tree.actions');
let TreeStore = require('./../stores/tree.store');
let LocationActions = require('./../actions/location.actions');
let LocationStore = require('./../stores/location.store');
let AuthStore = require('./../stores/auth.store');



export default class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
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
    if (props.auth.contact.trim() == "") {
      if (props.location.pathname == ServerSetting.uBase + "/register") {
        this.setState({loginText: localization(987), loginToolTip: localization(86)});
      } else {
        this.setState({loginText: localization(993), loginToolTip: localization(86)});
      }
    } else {
      this.setState({loginText: props.auth.contact.trim(), loginToolTip: localization(78)});
    }
  }
  render () {
    // Hide header for screenshot.
    if (this.props.location.pathname.indexOf("/screenshot") > -1) {
      return (<div></div>);
    }
    let active = "";
    if (this.props.location.pathname == ServerSetting.uBase + "/login" || this.props.location.pathname == ServerSetting.uBase + "/register" || this.props.location.pathname == ServerSetting.uBase + "/account") {
      active = " active";
    }

    return (
      <div className={"header" + active}>
        <div className="left" onClick={()=> {
          resetFilter().then(() => {
            TreeActions.fetchTrees();
          });
          this.context.router.push({pathname: ServerSetting.uBase + "/"});
        }}>
          <div className="logo"></div>
        </div>
        <div className={"center" + active} data-for="tooltip-header" data-tip={localization(87)}>
          <AltContainer stores={
            {
              maps: MapStore,
            }
          }>
            <Search />
          </AltContainer>
        </div>
        <div className={"right" + active } onClick={() => {
          if (active == "") {
            if (AuthStore.getState().auth.auth == AUTHTYPE.GUEST) {
              this.context.router.push({pathname: ServerSetting.uBase + "/login"});
            } else if (AuthStore.getState().auth.auth == AUTHTYPE.PARENT) {
              this.context.router.push({pathname: ServerSetting.uBase + "/account"});
            } else if (AuthStore.getState().auth.auth == AUTHTYPE.MANAGER) {
              this.context.router.push({pathname: ServerSetting.uBase + "/account"});
            } else if (AuthStore.getState().auth.auth == AUTHTYPE.ADMIN) {
              this.context.router.push({pathname: ServerSetting.uBase + "/account"});
            }
          } else {
            if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
              TreeActions.setCode(0);
              if (TreeStore.getState().selected > 0) {
                this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + TreeStore.getState().selected});
              } else {
                this.context.router.push({pathname: ServerSetting.uBase + '/'});
              }
              // this.context.router.push({pathname: ServerSetting.uBase + '/tree/' + parseInt(searchText)});
            } else if (MapStore.getState().latestMapType == MAPTYPE.DONATION) {
              if (LocationStore.getState().selected > 0) {
                this.context.router.push({pathname: ServerSetting.uBase + '/recipient/' + LocationStore.getState().selected});
              } else {
                this.context.router.push({pathname: ServerSetting.uBase + '/recipients'});
              }
              // this.context.router.push({pathname: ServerSetting.uBase + "/donations"});
            }
          }
        }} data-for="tooltip-header" data-tip={this.state.loginToolTip}>
          <div className="login-portrait">
            <FontAwesome className="icon" name='user' />
          </div>
          <div className="login-landscape">
            {this.state.loginText}
          </div>
          <ReactTooltip id="tooltip-header" effect="solid" place="bottom" />
        </div>
      </div>
    );
  }
}

Header.contextTypes = {
    router: React.PropTypes.object.isRequired
}
