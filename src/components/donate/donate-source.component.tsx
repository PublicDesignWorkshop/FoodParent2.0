import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './donate-source.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { DonateModel, donateStore } from './../../stores/donate.store';
import MessageLineComponent from './../message/message-line.component';
import { applyFilter, FilterMode, deleteFilter } from './../../utils/filter';
import { treeActions } from './../../actions/tree.actions';
import { donateActions } from './../../actions/donate.actions';

export interface IDonateSourceTypeOption {
  value: any;
  label: string;
}

export interface IDonateSourceProps {
  donate: DonateModel;
  editable: boolean;
  async: boolean;
  trees?: Array<TreeModel>;
}
export interface IDonateSourceStatus {
  options?: Array<IDonateSourceTypeOption>;
  selected?: Array<IDonateSourceTypeOption>;
}
export default class DonateSourceComponent extends React.Component<IDonateSourceProps, IDonateSourceStatus> {
  constructor(props : IDonateSourceProps) {
    super(props);
    let self: DonateSourceComponent = this;
    this.state = {

    };
  }
  public componentDidMount() {
    let self: DonateSourceComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: DonateSourceComponent = this;
  }
  public componentWillReceiveProps (nextProps: IDonateSourceProps) {
    let self: DonateSourceComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps(props: IDonateSourceProps) {
    let self: DonateSourceComponent = this;
    if (props.donate && props.trees) {
      let options = new Array<IDonateSourceTypeOption>();
      let selected = new Array<IDonateSourceTypeOption>();
      props.trees.forEach(tree => {
        options.push({value: tree.getId(), label: tree.getName()});
        if ($.inArray(tree.getId(), props.donate.getTrees()) > -1) {
          selected.push({value: tree.getId(), label: tree.getName()});
        }
      });
      self.setState({options: options, selected: selected});
    }
  }
  private updateAttribute = (selected?: any) => {
    let self: DonateSourceComponent = this;
    self.setState({selected: selected});
    var trees = new Array<number>();
    if (selected) {
      selected.forEach(option => {
        trees.push(parseInt(option.value));
      });
      donateActions.setTempDonateSource(trees);
    } else {
      donateActions.setTempDonateSource([]);
    }
  }

  render() {
    let self: DonateSourceComponent = this;
    if (self.props.editable || self.props.donate.getId() == 0) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onMouseUp={()=> {
            // if (self.props.editable) {
            //   self.setState({editing: true});
            // }
          }}>
            <FontAwesome className='' name='mail-forward' /> Source Trees
          </div>
          <div className={styles.edit}>
            <div className={styles.type}>
              <Select name="tree-select" multi={true} searchable={true} scrollMenuIntoView={false} options={self.state.options} value={self.state.selected} onChange={self.updateAttribute} placeholder="select source trees..." />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
        </div>
      );
    }
  }
}
