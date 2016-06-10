import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './location-description.component.css';
import { LocationModel, locationStore } from './../../stores/location.store';
import { locationActions } from './../../actions/location.actions';

export interface ILocationDescriptionProps {
  location: LocationModel;
  editable: boolean;
  async: boolean;
}
export interface ILocationDescriptionStatus {
  description?: string;
  editing?: boolean;
}
export default class LocationDescriptionComponent extends React.Component<ILocationDescriptionProps, ILocationDescriptionStatus> {
  constructor(props : ILocationDescriptionProps) {
    super(props);
    let self: LocationDescriptionComponent = this;
    this.state = {
      description: "",
      editing: false,
    };
  }
  public componentDidMount() {
    let self: LocationDescriptionComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: LocationDescriptionComponent = this;
  }
  public componentWillReceiveProps (nextProps: ILocationDescriptionProps) {
    let self: LocationDescriptionComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: ILocationDescriptionProps) {
    let self: LocationDescriptionComponent = this;
    if (props.location) {
      if (props.location.getDescription().trim() != "") {
        self.setState({description: props.location.getDescription().trim(), editing: false});
      } else {
        self.setState({description: "", editing: false});
      }
    }
  }
  private updateAttribute = () => {
    let self: LocationDescriptionComponent = this;
    self.props.location.setDescription(self.state.description);
    if (self.props.async) {
      locationActions.updateLocation(self.props.location);
    } else {
      self.setState({editing: false});
    }
  }

  render() {
    let self: LocationDescriptionComponent = this;
    if (self.state.editing) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {
            self.setState({description: self.state.description, editing: true});
          }}>
            <FontAwesome className='' name='sticky-note' /> Description
          </div>
          <div className={styles.editname}>
            <input autoFocus type="text" className={styles.edit} key={self.props.location.getId() + "description"} placeholder="enter description of place..."
              value={self.state.description}
              onChange={(event: any)=> {
                self.setState({description: event.target.value, editing: self.state.editing});
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
              self.setState({description: self.state.description, editing: true});
            }
          }}>
            <FontAwesome className='' name='sticky-note' /> Description
          </div>
          <div className={styles.name} onClick={()=> {
            if (self.props.editable) {
              self.setState({description: self.state.description, editing: true});
            }
          }}>
            {self.state.description + " "}
          </div>
        </div>
      );
    }
  }
}
