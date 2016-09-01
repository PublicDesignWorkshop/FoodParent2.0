import React from 'react';
import AltContainer from 'alt-container';

require('./parent-info.component.scss');
var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';
// import TreeFood from './tree-food.component';
// import TreeLocation from './tree-location.component';
// import TreeAddress from './tree-address.component';
// import TreeDescription from './tree-description.component';

let PersonActions = require('./../actions/person.actions');
let PersonStore = require('./../stores/person.store');
let AuthStore = require('./../stores/auth.store');
import ParentContact from './parent-contact.component';
import ParentName from './parent-name.component';
import ParentAddress from './parent-address.component';
import ParentAuth from './parent-auth.component';


export default class ParentInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    PersonActions.fetchUser(AuthStore.getState().auth.id);
    this.setState({editing: false});
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {

  }
  render () {
    let actions = <div>
      <div className="solid-button-group">
        <div className="solid-button solid-button-green" onClick={() => {
          this.setState({editing: true});
        }}>
          {localization(928) /* EDITING */}
        </div>
      </div>
    </div>;
    if (this.state.editing) {
      actions = <div>
        <div className="solid-button-group">
          <div className="solid-button solid-button-green" onClick={() => {
            this.setState({editing: false});
            PersonActions.updatePerson(PersonStore.getState().temp);
          }}>
            {localization(930) /* SAVE */}
          </div>
          <div className="solid-button solid-button-green" onClick={() => {
            PersonActions.fetchUser(AuthStore.getState().auth.id);
            this.setState({editing: false});
          }}>
            {localization(933) /* CANCEL */}
          </div>
        </div>
      </div>;
    }
    return (
      <div className="parent-info-wrapper">
        <AltContainer stores={
          {
            parent: function(props) {
              return {
                store: PersonStore,
                value: PersonStore.getState().temp
              }
            }
          }
        }>
          <ParentContact editing={this.state.editing} />
          <ParentName editing={this.state.editing} />
          <ParentAddress editing={this.state.editing} />
          <ParentAuth editing={this.state.editing} />
        </AltContainer>
        {actions}
      </div>
    );
  }
}

ParentInfo.contextTypes = {
    router: React.PropTypes.object.isRequired
}
