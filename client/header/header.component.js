import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';

require('./header.component.scss');

let ServerSetting = require('./../../setting/server.json');
import Search from './search.component';
let MapStore = require('./../stores/map.store');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';
import { MAPTYPE } from './../utils/enum';
let TreeActions = require('./../actions/tree.actions');


export default class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({loginText: localization(993)});
  }
  componentDidMount () {

  }
  componentWillReceiveProps() {

  }
  render () {
    let active = "";
    if (this.props.location.pathname == ServerSetting.uBase + "/login" || this.props.location.pathname == ServerSetting.uBase + "/register") {
      active = " active";
    }

    return (
      <div className={"header" + active}>
        <div className="left" onClick={()=> {
          this.context.router.push({pathname: ServerSetting.uBase + "/"});
        }}>
          <div className="logo"></div>
        </div>
        <div className={"center" + active} data-for="tooltip-header" data-tip={localization(87)}>
          <AltContainer stores={
            {
              maps: MapStore
            }
          }>
            <Search />
          </AltContainer>
        </div>
        <div className={"right" + active } onClick={() => {
          if (active == "") {
            this.context.router.push({pathname: ServerSetting.uBase + "/login"});
          } else {
            if (MapStore.getState().latestMapType == MAPTYPE.TREE) {
              TreeActions.setCode(0);
              this.context.router.push({pathname: ServerSetting.uBase + "/"});
            } else if (MapStore.getState().latestMapType == MAPTYPE.DONATION) {
              this.context.router.push({pathname: ServerSetting.uBase + "/donations"});
            }
          }
        }} data-for="tooltip-header" data-tip={localization(86)}>
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
