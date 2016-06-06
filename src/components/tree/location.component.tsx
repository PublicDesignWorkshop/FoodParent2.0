import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './location.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { reverseGeocoding, IReverseGeoLocation } from './../../utils/geolocation';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { FoodModel, foodStore } from './../../stores/food.store';
import { treeActions } from './../../actions/tree.actions';

export interface ILocationProps {
  tree: TreeModel;
  editable: boolean;
  async: boolean;
}
export interface ILocationStatus {
  latitude?: any;
  longitude?: any;
  editingLatitude?: boolean;
  editingLongitude?: boolean;
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
      self.setState({latitude: props.tree.getLat().toFixed(Settings.iMarkerPrecision), longitude: props.tree.getLng().toFixed(Settings.iMarkerPrecision), editingLatitude: false, editingLongitude: false});
    }
  }

  private updateAttribute = () => {
    let self: LocationComponent = this;
    self.props.tree.setLat(parseFloat(self.state.latitude));
    self.props.tree.setLng(parseFloat(self.state.longitude));
    if (self.props.async) {
      let food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
      treeActions.updateTree(self.props.tree, "Successfully updated the location of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.", "Failed to update the location of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.");
    } else {
      self.setState({latitude: parseFloat(self.state.latitude).toFixed(Settings.iMarkerPrecision), longitude: parseFloat(self.state.longitude).toFixed(Settings.iMarkerPrecision), editingLatitude: false, editingLongitude: false});
    }
  }

  render() {
    let self: LocationComponent = this;
    if (self.state.editingLatitude) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {
            self.setState({editingLatitude: true, editingLongitude: false});
          }}>
            <FontAwesome className='' name='at' /> Location
          </div>
          <div className={styles.location}>
            <input autoFocus type="text" className={styles.edit} key={self.props.tree.getId() + "latitude"} placeholder="enter latitude of tree location..."
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
            <FontAwesome className='' name='at' /> Location
          </div>
          <div className={styles.location}>
            <div className={styles.name} onClick={()=> {
              self.setState({editingLatitude: true, editingLongitude: false});
            }}>
              {self.state.latitude}
            </div>
            <div className={styles.comma}>,</div>
            <input autoFocus type="text" className={styles.edit} key={self.props.tree.getId() + "longitude"} placeholder="enter longitude of tree location..."
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
            <FontAwesome className='' name='at' /> Location
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
