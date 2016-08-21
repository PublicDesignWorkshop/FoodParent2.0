import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';

require('./tree-recent-post.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { reverseGeocoding } from './../utils/geocoding';
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');
import { isLatLng } from './../utils/validation';


export default class TreeRecentPost extends React.Component {
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
    // if (props.tree != null) {
    //   if (props.tree.description && props.tree.description.trim() != "") {
    //     this.setState({description: props.tree.description});
    //   } else {
    //     if (props.editing) {
    //       this.setState({description: ""});
    //     } else {
    //       this.setState({description: localization(95)});
    //     }
    //   }
    // } else {
    //   this.setState({description: localization(95)});
    // }
  }
  updateAttribute() {
    // let prevDescription = this.props.tree.description;
    // if (this.state.description && this.state.description.trim() != "") {
    //   this.props.tree.description = this.state.description.trim();
    //   this.setState({description: this.props.tree.description});
    // } else {
    //   this.setState({description: ""});
    // }
    // if (prevDescription != this.state.description) {
    //   TreeActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    // }
  }
  render () {
    return (
      <div className="tree-recent-post-wrapper">
        <div className="tree-recent-post-label">
          <FontAwesome className='' name='sticky-note' />{localization(62)}
        </div>
        <div className="tree-recent-post-data">
          <div className="tree-recent-post-text">
            TEXT
          </div>
        </div>
      </div>
    );
  }
}
