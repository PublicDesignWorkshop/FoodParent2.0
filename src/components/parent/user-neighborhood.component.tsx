import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './user-neighborhood.component.css';
import { PersonModel, personStore } from './../../stores/person.store';
import MessageLineComponent from './../message/message-line.component';

export interface IUserNeighborhoodProps {
  person?: PersonModel;
  editable: boolean;
  async: boolean;
  error: any;
}
export interface IUserNeighborhoodStatus {
  neighborhood?: string;
}
export default class UserNeighborhoodComponent extends React.Component<IUserNeighborhoodProps, IUserNeighborhoodStatus> {
  constructor(props : IUserNeighborhoodProps) {
    super(props);
    let self: UserNeighborhoodComponent = this;
    this.state = {
      neighborhood: "",
    };
  }
  public componentDidMount() {
    let self: UserNeighborhoodComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: UserNeighborhoodComponent = this;
  }
  public componentWillReceiveProps (nextProps: IUserNeighborhoodProps) {
    let self: UserNeighborhoodComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IUserNeighborhoodProps) {
    let self: UserNeighborhoodComponent = this;
    if (props.person) {
      self.setState({neighborhood: props.person.getNeighborhood()});
    }
  }
  private updateAttribute = (selected?: any) => {
    let self: UserNeighborhoodComponent = this;
    self.props.person.setNeighborhood(self.state.neighborhood);
    if (self.props.async) {
      // personStore.updatePerson(self.props.person);
    } else {

    }
  }

  render() {
    let self: UserNeighborhoodComponent = this;
    if (self.props.person && self.props.editable) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onMouseUp={()=> {
            // if (self.props.editable) {
            //   self.setState({editing: true});
            // }
          }}>
            <FontAwesome className='' name='map-signs' /> Neighborhood
          </div>
          <div className={styles.edit}>
            <input type="text" className={styles.input} key={self.props.person.getId() + "neighborhood"} placeholder="optional..."
              value={self.state.neighborhood}
              onChange={(event: any)=> {
                self.setState({neighborhood: event.target.value});
              }}
              onKeyPress={(event)=> {
                // if (event.key == 'Enter') {
                //   self.updateAttribute();
                // }
              }}
              onBlur={()=> {
                self.updateAttribute();
              }} />
          </div>
          <div className={styles.message}>
            <MessageLineComponent code={self.props.error} match={[]} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper2}>
          <div className={styles.label}>
            <FontAwesome className='' name='map-signs' /> Neighborhood
          </div>
          <div className={styles.value}>
            {self.state.neighborhood}
          </div>
        </div>
      );
    }

  }
}
