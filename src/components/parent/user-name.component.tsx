import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './user-name.component.css';
import { PersonModel, personStore } from './../../stores/person.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import MessageLineComponent from './../message/message-line.component';

export interface IUserNameProps {
  person?: PersonModel;
  editable: boolean;
  async: boolean;
  error: any;
}
export interface IUserNameStatus {
  name?: string;
}
export default class UserNameComponent extends React.Component<IUserNameProps, IUserNameStatus> {
  constructor(props : IUserNameProps) {
    super(props);
    let self: UserNameComponent = this;
    this.state = {
      name: "",
    };
  }
  public componentDidMount() {
    let self: UserNameComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: UserNameComponent = this;
  }
  public componentWillReceiveProps (nextProps: IUserNameProps) {
    let self: UserNameComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IUserNameProps) {
    let self: UserNameComponent = this;
    if (props.person) {
      self.setState({name: props.person.getName()});
    }
  }
  private updateAttribute = (selected?: any) => {
    let self: UserNameComponent = this;
    self.props.person.setName(self.state.name);
    if (self.props.async) {
      // personStore.updatePerson(self.props.person);
    } else {

    }
  }

  render() {
    let self: UserNameComponent = this;
    if (self.props.person && self.props.editable) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onMouseUp={()=> {
            // if (self.props.editable) {
            //   self.setState({editing: true});
            // }
          }}>
            <FontAwesome className='' name='microphone' /> Name
          </div>
          <div className={styles.edit}>
            <input type="text" className={styles.input} key={self.props.person.getId() + "name"} placeholder="optional..."
              value={self.state.name}
              onChange={(event: any)=> {
                self.setState({name: event.target.value});
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
            <FontAwesome className='' name='microphone' /> Name
          </div>
          <div className={styles.value}>
            {self.state.name}
          </div>
        </div>
      );
    }

  }
}
