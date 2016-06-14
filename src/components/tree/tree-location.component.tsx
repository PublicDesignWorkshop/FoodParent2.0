import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './tree-location.component.css';
var Settings = require('./../../constraints/settings.json');

import { TreeModel } from './../../stores/tree.store';
import { treeActions } from './../../actions/tree.actions';

import { localization } from './../../constraints/localization';

export interface ITreeLocationProps {
  tree: TreeModel;
  editable: boolean;
  async: boolean;
}
export interface ITreeLocationStatus {
  latitude?: any;
  longitude?: any;
  editingLatitude?: boolean;
  editingLongitude?: boolean;
}
export default class TreeLocationComponent extends React.Component<ITreeLocationProps, ITreeLocationStatus> {
  constructor(props : ITreeLocationProps) {
    super(props);
    let self: TreeLocationComponent = this;
    this.state = {
      latitude: 0,
      longitude: 0,
      editingLatitude: false,
      editingLongitude: false,
    };
  }
  public componentDidMount() {
    let self: TreeLocationComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreeLocationComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreeLocationProps) {
    let self: TreeLocationComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ITreeLocationProps) => {
    let self: TreeLocationComponent = this;
    if (props.tree) {
      self.setState({latitude: props.tree.getLat().toFixed(Settings.iMarkerPrecision), longitude: props.tree.getLng().toFixed(Settings.iMarkerPrecision), editingLatitude: false, editingLongitude: false});
    }
  }

  private updateAttribute = () => {
    let self: TreeLocationComponent = this;
    self.props.tree.setLat(parseFloat(self.state.latitude));
    self.props.tree.setLng(parseFloat(self.state.longitude));
    if (self.props.async) {
      treeActions.updateTree(self.props.tree);
    } else {
      treeActions.refresh();
      self.setState({latitude: parseFloat(self.state.latitude).toFixed(Settings.iMarkerPrecision), longitude: parseFloat(self.state.longitude).toFixed(Settings.iMarkerPrecision), editingLatitude: false, editingLongitude: false});
    }
  }

  render() {
    let self: TreeLocationComponent = this;
    if (self.state.editingLatitude) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {
            self.setState({editingLatitude: true, editingLongitude: false});
          }}>
            <FontAwesome className='' name='at' /> {localization(980)}
          </div>
          <div className={styles.location}>
            <input autoFocus type="text" className={styles.edit} key={self.props.tree.getId() + "latitude"} placeholder={localization(978)}
              value={self.state.latitude}
              onChange={(event: any)=> {
                self.setState({latitude: event.target.value});
              }}
              onKeyPress={(event)=> {
                if (event.key == 'Enter') {
                  self.updateAttribute();
                }
              }}
              onBlur={()=> {
                self.updateAttribute();
              }} />
            <div className={styles.comma}>,</div>
            <div className={styles.name} onClick={()=> {
              self.setState({editingLatitude: false, editingLongitude: true});
            }}>
              {self.state.longitude}
            </div>
          </div>
        </div>
      );
    } else if (self.state.editingLongitude) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {
            self.setState({editingLatitude: false, editingLongitude: true});
          }}>
            <FontAwesome className='' name='at' /> {localization(980)}
          </div>
          <div className={styles.location}>
            <div className={styles.name} onClick={()=> {
              self.setState({editingLatitude: true, editingLongitude: false});
            }}>
              {self.state.latitude}
            </div>
            <div className={styles.comma}>,</div>
            <input autoFocus type="text" className={styles.edit} key={self.props.tree.getId() + "longitude"} placeholder={localization(979)}
              value={self.state.longitude}
              onChange={(event: any)=> {
                self.setState({longitude: event.target.value});
              }}
              onKeyPress={(event)=> {
                if (event.key == 'Enter') {
                  self.updateAttribute();
                }
              }}
              onBlur={()=> {
                self.updateAttribute();
              }} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='at' /> {localization(980)}
          </div>
          <div className={styles.location}>
            <div className={styles.name} onClick={()=> {
              if (self.props.editable) {
                self.setState({editingLatitude: true, editingLongitude: false});
              }
            }}>
              {self.state.latitude}
            </div>
            <div className={styles.comma}>,</div>
            <div className={styles.name} onClick={()=> {
              if (self.props.editable) {
                self.setState({editingLatitude: false, editingLongitude: true});
              }
            }}>
              {self.state.longitude}
            </div>
          </div>
        </div>
      );
    }
  }
}
