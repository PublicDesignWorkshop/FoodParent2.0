import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../node_modules/font-awesome/css/font-awesome.css';

var Settings = require('./../constraints/settings.json');
import * as styles from './location.component.css';
import { TreeModel, treeStore } from './../stores/tree.store';
import { FoodModel, foodStore } from './../stores/food.store';
import { FlagModel, flagStore } from './../stores/flag.store';
import { reverseGeocoding, IReverseGeoLocation } from './../utils/reversegeolocation';
import { addLoading, removeLoading } from './../utils/loadingtracker';

export interface ILocationProps {
  tree: TreeModel;
  editable: boolean;
}
export interface ILocationStatus {
  latitude: number;
  longitude: number;
  editingLatitude: boolean;
  editingLongitude: boolean;
}
export default class LocationComponent extends React.Component<ILocationProps, ILocationStatus> {
  constructor(props : ILocationProps) {
    super(props);
    let self: LocationComponent = this;
    this.state = {
      latitude: 0,
      longitude: 0,
      editingLatitude: false,
      editingLongitude: false,
    };
  }
  public componentDidMount() {
    let self: LocationComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: LocationComponent = this;
  }
  public componentWillReceiveProps (nextProps: ILocationProps) {
    let self: LocationComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ILocationProps) => {
    let self: LocationComponent = this;
    if (props.tree) {
      self.setState({latitude: props.tree.getLat(), longitude: props.tree.getLng(), editingLatitude: false, editingLongitude: false});
    }
  }

  private updateAttribute = () => {
    let self: LocationComponent = this;
    self.props.tree.setLat(self.state.latitude);
    self.props.tree.setLng(self.state.longitude);
    treeStore.updateTree(self.props.tree);
    self.setState({latitude: self.state.latitude, longitude: self.state.longitude, editingLatitude: false, editingLongitude: false});
  }

  render() {
    let self: LocationComponent = this;
    if (self.state.editingLatitude) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {
            self.setState({latitude: self.state.latitude, longitude: self.state.longitude, editingLatitude: true, editingLongitude: false});
          }}>
            <FontAwesome className='' name='at' /> Location
          </div>
          <div className={styles.location}>
            <input autoFocus type="text" className={styles.edit} key={self.props.tree.getId() + "latitude"} placeholder="enter latitude of tree location..."
              value={self.state.latitude}
              onChange={(event: any)=> {
                self.setState({latitude: event.target.value, longitude: self.state.longitude, editingLatitude: true, editingLongitude: false});
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
              self.setState({latitude: self.state.latitude, longitude: self.state.longitude, editingLatitude: false, editingLongitude: true});
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
            self.setState({latitude: self.state.latitude, longitude: self.state.longitude, editingLatitude: false, editingLongitude: true});
          }}>
            <FontAwesome className='' name='at' /> Location
          </div>
          <div className={styles.location}>
            <div className={styles.name} onClick={()=> {
              self.setState({latitude: self.state.latitude, longitude: self.state.longitude, editingLatitude: true, editingLongitude: false});
            }}>
              {self.state.latitude}
            </div>
            <div className={styles.comma}>,</div>
            <input autoFocus type="text" className={styles.edit} key={self.props.tree.getId() + "longitude"} placeholder="enter longitude of tree location..."
              value={self.state.longitude}
              onChange={(event: any)=> {
                self.setState({latitude: self.state.latitude, longitude: event.target.value, editingLatitude: false, editingLongitude: true});
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
            <FontAwesome className='' name='at' /> Location
          </div>
          <div className={styles.location}>
            <div className={styles.name} onClick={()=> {
              if (self.props.editable) {
                self.setState({latitude: self.state.latitude, longitude: self.state.longitude, editingLatitude: true, editingLongitude: false});
              }
            }}>
              {self.state.latitude}
            </div>
            <div className={styles.comma}>,</div>
            <div className={styles.name} onClick={()=> {
              if (self.props.editable) {
                self.setState({latitude: self.state.latitude, longitude: self.state.longitude, editingLatitude: false, editingLongitude: true});
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
