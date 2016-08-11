import React from 'react';
import ReactTooltip from 'react-tooltip';
import AltContainer from 'alt-container';
import Select from 'react-select';


require('./tree-description.component.scss');

var FontAwesome = require('react-fontawesome');
let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');

import { localization } from './../utils/localization';
import { reverseGeocoding } from './../utils/geocoding';
let TreeStore = require('./../stores/tree.store');
let TreeActions = require('./../actions/tree.actions');
import { isLatLng } from './../utils/validation';


export default class TreeDescription extends React.Component {
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
    if (props.tree != null) {
      if (props.tree.description && props.tree.description.trim() != "") {
        this.setState({description: props.tree.description});
      } else {
        if (props.editing) {
          this.setState({description: ""});
        } else {
          this.setState({description: localization(95)});
        }
      }
    } else {
      this.setState({description: localization(95)});
    }
  }
  updateAttribute() {
    let prevDescription = this.props.tree.description;
    if (this.state.description && this.state.description.trim() != "") {
      this.props.tree.description = this.state.description.trim();
      this.setState({description: this.props.tree.description});
    } else {
      this.setState({description: ""});
    }
    if (prevDescription != this.state.description) {
      TreeActions.setCode(94);  // Unsaved change code (see errorlist.xlsx for more detail).
    }
  }
  render () {
    if (this.props.editing) {
      return (
        <div className="tree-description-wrapper">
          <div className="tree-description-label">
            <FontAwesome className='' name='sticky-note' />{localization(968)}
          </div>
          <div className="tree-description-data">
            <input type="text" className="tree-description-input" placeholder={localization(973)}
              value={this.state.description}
              onChange={(event: any)=> {
                this.setState({description: event.target.value});
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
        <div className="tree-description-wrapper">
          <div className="tree-description-label">
            <FontAwesome className='' name='sticky-note' />{localization(968)}
          </div>
          <div className="tree-description-data">
            <div className="tree-description-text">
              {this.state.description}
            </div>
          </div>
        </div>
      );
    }
  }
}
