import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './location-location.component.css';
import { LocationModel, locationStore } from './../../stores/location.store';
import { reverseGeocoding, IReverseGeoLocation } from './../../utils/geolocation';
import { FoodModel, foodStore } from './../../stores/food.store';
import { locationActions } from './../../actions/location.actions';

export interface ILocationLocationProps {
  location: LocationModel;
  editable: boolean;
  async: boolean;
}
export interface ILocationLocationStatus {
  latitude?: any;
  longitude?: any;
  editingLatitude?: boolean;
  editingLongitude?: boolean;
}
export default class LocationLocationComponent extends React.Component<ILocationLocationProps, ILocationLocationStatus> {
  constructor(props : ILocationLocationProps) {
    super(props);
    let self: LocationLocationComponent = this;
    this.state = {
      latitude: 0,
      longitude: 0,
      editingLatitude: false,
      editingLongitude: false,
    };
  }
  public componentDidMount() {
    let self: LocationLocationComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: LocationLocationComponent = this;
  }
  public componentWillReceiveProps (nextProps: ILocationLocationProps) {
    let self: LocationLocationComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: ILocationLocationProps) => {
    let self: LocationLocationComponent = this;
    if (props.location) {
      self.setState({latitude: props.location.getLat().toFixed(Settings.iMarkerPrecision), longitude: props.location.getLng().toFixed(Settings.iMarkerPrecision), editingLatitude: false, editingLongitude: false});
    }
  }

  private updateAttribute = () => {
    let self: LocationLocationComponent = this;
    self.props.location.setLat(parseFloat(self.state.latitude));
    self.props.location.setLng(parseFloat(self.state.longitude));
    if (self.props.async) {
      locationActions.updateLocation(self.props.location);
    } else {
      locationActions.refresh();
      self.setState({latitude: parseFloat(self.state.latitude).toFixed(Settings.iMarkerPrecision), longitude: parseFloat(self.state.longitude).toFixed(Settings.iMarkerPrecision), editingLatitude: false, editingLongitude: false});
    }
  }

  render() {
    let self: LocationLocationComponent = this;
    if (self.state.editingLatitude) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {
            self.setState({editingLatitude: true, editingLongitude: false});
          }}>
            <FontAwesome className='' name='at' /> Location
          </div>
          <div className={styles.location}>
            <input autoFocus type="text" className={styles.edit} key={self.props.location.getId() + "latitude"} placeholder="enter latitude of place location..."
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
            <input autoFocus type="text" className={styles.edit} key={self.props.location.getId() + "longitude"} placeholder="enter longitude of place location..."
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
