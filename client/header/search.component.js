import React from 'react';

require('./search.component.scss');
let ServerSetting = require('./../../setting/server.json');

import { localization } from './../utils/localization';


localization(994, window.navigator.userLanguage || window.navigator.language, function(success) {

}, function(fail) {

});


export default class Search extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
  }
  componentWillMount() {
    this.setState({editing: false, searchPlaceHolder: ""});
    localization(730, window.navigator.userLanguage || window.navigator.language, function(response) {
      this.setState({searchText: response, searchPlaceHolder: response});
    }.bind(this));

  }
  componentDidMount () {

  }
  componentWillReceiveProps() {

  }
  handleChangeSearch (event) {
    this.setState({searchText: event.target.value});
  }
  handleSubmit () {
    this.setState({editing: false});
  }
  render () {
    if (this.state.editing) {
      return (
        <input autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" type="text" className="search-input"
          placeholder={this.state.searchPlaceHolder}
          value={this.state.searchText}
          onChange={this.handleChangeSearch}
          onKeyPress={(event)=> {
            if (event.key == 'Enter') {
              this.handleSubmit();
            }
          }}
          onBlur={()=> {
            this.handleSubmit();
          }} />
      );
    } else {
      return (
        <div className="search-text" onClick={()=> {
          if (this.state.searchText == this.state.searchPlaceHolder) {
            this.setState({searchText: "", editing: true});
          } else {
            this.setState({editing: true});
          }
          // mapActions.setActive(self.props.mapId, false);
        }}>
          {this.state.searchText}
        </div>
      );
    }
  }
}


Search.contextTypes = {
    router: React.PropTypes.object.isRequired
}
