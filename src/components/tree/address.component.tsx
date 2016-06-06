import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './address.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { reverseGeocoding, IReverseGeoLocation } from './../../utils/geolocation';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { FoodModel, foodStore } from './../../stores/food.store';
import { treeActions } from './../../actions/tree.actions';

export interface IAddressProps {
  tree: TreeModel;
  editable: boolean;
  async: boolean;
}
export interface IAddressStatus {
  address?: string;
  editing?: boolean;
}
export default class AddressComponent extends React.Component<IAddressProps, IAddressStatus> {
  constructor(props : IAddressProps) {
    super(props);
    let self: AddressComponent = this;
    this.state = {
      address: "",
      editing: false,
    };
  }
  public componentDidMount() {
    let self: AddressComponent = this;
    self.updateProps(self.props);
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
      if (props.tree.getAddress() && props.tree.getAddress().trim() != "") {
        self.setState({address: props.tree.getAddress().trim(), editing: false});
      } else {
        addLoading();
        reverseGeocoding(props.tree.getLocation(), function(response: IReverseGeoLocation) {
          self.setState({address: response.formatted, editing: false});
          self.props.tree.setAddress(self.state.address);
          if (self.props.async) {
            let food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
            treeActions.updateTree(self.props.tree, "Successfully updated the address of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.", "Failed to update the address of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.");
          } else {
            self.setState({editing: false});
          }
          removeLoading();
        }, function() {
          removeLoading();
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
        treeActions.updateTree(self.props.tree, "Successfully updated the address of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.", "Failed to update the address of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.");
      } else {
        self.setState({editing: false});
      }
    } else {
      reverseGeocoding(self.props.tree.getLocation(), function(response: IReverseGeoLocation) {
        self.setState({address: response.formatted, editing: false});
        removeLoading();
        self.props.tree.setAddress(self.state.address);
        if (self.props.async) {
          treeActions.updateTree(self.props.tree, "Successfully updated the address of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.", "Failed to update the address of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.");
        } else {
          self.setState({editing: false});
        }
      }, function() {
        removeLoading();
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
