import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './address.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { reverseGeocoding, IReverseGeoLocation } from './../../utils/geolocation';
import { FoodModel, foodStore } from './../../stores/food.store';
import { treeActions } from './../../actions/tree.actions';

export interface IAddressProps {
  tree: TreeModel;
  editable: boolean;
  async: boolean;
}
export interface IAddressStatus {
  prevLat?: number;
  prevLng?: number;
  address?: string;
  editing?: boolean;
}
export default class AddressComponent extends React.Component<IAddressProps, IAddressStatus> {
  constructor(props : IAddressProps) {
    super(props);
    let self: AddressComponent = this;
    this.state = {
      prevLat: 0,
      prevLng: 0,
      address: "",
      editing: false,
    };
  }
  public componentDidMount() {
    let self: AddressComponent = this;
    self.updateProps(self.props);
    if (self.props.tree) {
      self.setState({prevLat: parseFloat(self.props.tree.getLat().toFixed(Settings.iMarkerPrecision)), prevLng: parseFloat(self.props.tree.getLng().toFixed(Settings.iMarkerPrecision))});
    }
  }
  public componentWillUnmount() {
    let self: AddressComponent = this;
  }
  public componentWillReceiveProps (nextProps: IAddressProps) {
    let self: AddressComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: IAddressProps) => {
    let self: AddressComponent = this;
    if (props.tree) {
      if (props.tree.getAddress() && props.tree.getAddress().trim() != "" && props.tree.getLat().toFixed(Settings.iMarkerPrecision) == self.state.prevLat.toFixed(Settings.iMarkerPrecision) && props.tree.getLng().toFixed(Settings.iMarkerPrecision) == self.state.prevLng.toFixed(Settings.iMarkerPrecision)) {
        self.setState({address: props.tree.getAddress().trim(), editing: false, prevLat: props.tree.getLat(), prevLng: props.tree.getLng()});
      } else {
        reverseGeocoding(props.tree.getLocation(), function(response: IReverseGeoLocation) {
          self.setState({address: response.formatted, editing: false});
          props.tree.setAddress(self.state.address);
          if (props.async) {
            let food: FoodModel = foodStore.getFood(props.tree.getFoodId());
            // treeActions.updateTree(props.tree);
            self.setState({prevLat: parseFloat(self.props.tree.getLat().toFixed(Settings.iMarkerPrecision)), prevLng: parseFloat(self.props.tree.getLng().toFixed(Settings.iMarkerPrecision))});
          } else {
            self.setState({editing: false, prevLat: parseFloat(self.props.tree.getLat().toFixed(Settings.iMarkerPrecision)), prevLng: parseFloat(self.props.tree.getLng().toFixed(Settings.iMarkerPrecision))});
          }
        }, function() {
        });
      }
    }
  }

  private updateAttribute = () => {
    let self: AddressComponent = this;
    let food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
    if (self.state.address.trim() != "") {
      self.props.tree.setAddress(self.state.address);
      if (self.props.async) {
        treeActions.updateTree(self.props.tree);
      } else {
        self.setState({editing: false});
      }
    } else {
      reverseGeocoding(self.props.tree.getLocation(), function(response: IReverseGeoLocation) {
        self.setState({address: response.formatted, editing: false});
        self.props.tree.setAddress(self.state.address);
        if (self.props.async) {
          treeActions.updateTree(self.props.tree);
        } else {
          self.setState({editing: false});
        }
      }, function() {
      });
    }
  }

  render() {
    let self: AddressComponent = this;
    if (self.state.editing) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label}>
            <FontAwesome className='' name='map-signs' /> Address
          </div>
          <div className={styles.editname}>
            <input autoFocus type="text" className={styles.edit} key={self.props.tree.getId() + "address"} placeholder="enter address of tree..."
              value={self.state.address}
              onChange={(event: any)=> {
                self.setState({address: event.target.value, editing: self.state.editing});
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
          <div className={styles.label} onClick={()=> {
            if (self.props.editable) {
              self.setState({editing: true});
            }
          }}>
            <FontAwesome className='' name='map-signs' /> Address
          </div>
          <div className={styles.name} onClick={()=> {
            if (self.props.editable) {
              self.setState({editing: true});
            }
          }}>
            {self.state.address}
          </div>
        </div>
      );
    }

  }
}
