import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../../constraints/settings.json');
import * as styles from './location.component.css';
import { LocationModel, locationStore } from './../../stores/location.store';
import { authStore } from './../../stores/auth.store';

export interface ILocationProps {
  locations?: Array<LocationModel>;
  locationId: number;
  donateId: number;
}
export interface ILocationStatus {
  editable: boolean;
}
export default class LocationComponent extends React.Component<ILocationProps, ILocationStatus> {
  static contextTypes: any;
  constructor(props : ILocationProps) {
    super(props);
    let self: LocationComponent = this;
    self.state = {
      editable: false,
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
    if (props.locations.length != 0) {
      let location: LocationModel = locationStore.getLocation(props.locationId);
      if (authStore.getAuth().getIsManager() && self.props.locationId != props.locationId) {
        // setTimeout(function() {
        //   personActions.fetchPersons(tree.getParents());
        // }, 0);
      }
      setTimeout(function() {
        // noteActions.fetchNotesFromTreeIds([tree.getId()]);
      }, 0);
      let editable: boolean = false;
      if (location) {
        if (authStore.getAuth().getIsManager()) {
          editable = true;
        }
        self.setState({editable: editable});
      }
    }
  }

  render() {
    let self: LocationComponent = this;
    if (self.props.locationId) {
      let location: LocationModel = locationStore.getLocation(self.props.locationId);
      let deleteLocation: JSX.Element;
      if (authStore.getAuth().getIsAdmin()) {
        deleteLocation = <div className={styles.button} onClick={()=> {
          self.context.router.push({pathname: window.location.pathname, query: { mode: "delete" }});
        }}>
          DELETE PLACE
        </div>;
      }
      if (authStore.getAuth().getIsManager()) {
        return (
          <div className={styles.wrapper}>
            <div className={styles.treeinfo}>

            </div>
            <div className={styles.basicinfo}>

            </div>
            {deleteLocation}
          </div>
        );
      } else {
        return (
          <div className={styles.wrapper}>
          </div>
        );
      }
    } else {
      return (
        <div className={styles.wrapper}>
        </div>
      );
    }
  }
}

LocationComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
