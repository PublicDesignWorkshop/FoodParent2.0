import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../node_modules/react-select/dist/react-select.css';
import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import * as styles from './pub.component.css';
import { TreeModel, treeStore } from './../stores/tree.store';
import { reverseGeocoding, IReverseGeoLocation } from './../utils/reversegeolocation';
import { addLoading, removeLoading } from './../utils/loadingtracker';

export interface IPublicOption {
  value: number;
  label: string;
}

export interface IPublicProps {
  tree: TreeModel;
  editable: boolean;
}
export interface IPublicStatus {
  options: Array<IPublicOption>;
  selected: IPublicOption;
}

export default class PublicComponent extends React.Component<IPublicProps, IPublicStatus> {
  constructor(props : IPublicProps) {
    super(props);
    let self: PublicComponent = this;
    this.state = {
      options: null,
      selected: null,
    };
  }
  public componentDidMount() {
    let self: PublicComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: PublicComponent = this;
  }
  public componentWillReceiveProps (nextProps: IPublicProps) {
    let self: PublicComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IPublicProps) {
    let self: PublicComponent = this;
    if (props.tree) {
      let options = new Array<IPublicOption>();
      options.push({value: 0, label: "private"});
      options.push({value: 1, label: "public"});
      let selected: IPublicOption;
      if (self.props.tree.getPublic() == 0) {
        selected = options[0];
      } else {
        selected = options[1];
      }
      self.setState({options: options, selected: selected});
    }
  }

  private updateAttribute = (selected) => {
    let self: PublicComponent = this;
    var pub = 0;
    if (selected) {
      pub = parseInt(selected.value);
    }
    self.props.tree.setPublic(pub);
    treeStore.updateTree(self.props.tree);
  }

  render() {
    let self: PublicComponent = this;
    if (self.props.editable) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='home' /> Public
          </div>
          <div className={styles.name}>
            <Select name="public-select" multi={false} searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select ownerships..." />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='home' /> Public
          </div>
          <div className={styles.name}>
            <Select name="public-select" multi={false} disabled searchable={false} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select ownerships..." />
          </div>
        </div>
      );
    }
  }
}
