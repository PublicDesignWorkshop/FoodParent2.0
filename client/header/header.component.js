import React from 'react';
import AltContainer from 'alt-container';

require('./header.component.scss');

let ServerSetting = require('./../../setting/server.json');
import Search from './search.component';
let MapStore = require('./../stores/map.store');

var FontAwesome = require('react-fontawesome');
import { localization } from './../utils/localization';


export default class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    this.setState({loginText: ""});
    localization(993, window.navigator.userLanguage || window.navigator.language, function(response) {
      this.setState({loginText: response});
    }.bind(this));
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
        <div className={"center" + active}>
          <AltContainer stores={
            {
              maps: MapStore
            }
          }>
            <Search />
          </AltContainer>
        </div>
        <div className={"right" + active } onClick={() => {
          if (active != "") {
            this.context.router.push({pathname: ServerSetting.uBase + "/login"});
          } else {
            this.context.router.push({pathname: ServerSetting.uBase + "/login"});
          }
        }}>
          <div className="login-portrait">
            <FontAwesome className="icon" name='user' />
          </div>
          <div className="login-landscape">
            {this.state.loginText}
          </div>
        </div>
      </div>
    );
  }
}


Header.contextTypes = {
    router: React.PropTypes.object.isRequired
}
