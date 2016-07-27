import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as AltContainer from 'alt-container';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './screenshot-address.component.css';
var Settings = require('./../../constraints/settings.json');

import { TreeModel, treeStore } from './../../stores/tree.store';
import { treeActions } from './../../actions/tree.actions';
import { reverseGeocoding, IReverseGeoLocation } from './../../utils/geolocation';


export interface IScreenshotAddressProps {
  treeId: number;
}
export interface IScreenshotAddressStatus {
  address?: string;
}

export default class ScreenshotAddressComponent extends React.Component<IScreenshotAddressProps, IScreenshotAddressStatus> {
  private loading: boolean;
  constructor(props : IScreenshotAddressProps) {
    super(props);
    let self: ScreenshotAddressComponent = this;
    this.state = {
      address: "",
    };
    self.loading = false;
  }

  public componentDidMount() {
    let self: ScreenshotAddressComponent = this;
    self.updateProps(self.props);
  }

  public componentWillUnmount() {
    let self: ScreenshotAddressComponent = this;
  }

  public componentWillReceiveProps (nextProps: IScreenshotAddressProps) {
    let self: ScreenshotAddressComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: IScreenshotAddressProps) => {
    let self: ScreenshotAddressComponent = this;
    if (props.treeId) {
      let tree: TreeModel = treeStore.getTree(props.treeId);
      console.log(tree);
      if (tree != null) {
        if (tree.getAddress() && tree.getAddress().trim() != "") {
          self.setState({address: tree.getAddress().trim()});
        } else {
          if (!self.loading) {
            self.loading = true;
            reverseGeocoding(tree.getLocation(), function(response: IReverseGeoLocation) {
              self.loading = false;
              console.log(response);
              self.setState({address: response.formatted});
            });
          }
        }
      }
    }
  }

  render() {
    let self: ScreenshotAddressComponent = this;
    return (
      <div className={styles.wrapper}>
        <FontAwesome className='' name='map-signs' />
        {self.state.address}
      </div>
    );
  }
}
