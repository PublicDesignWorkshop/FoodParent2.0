import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as Select from 'react-select';
import './../../../node_modules/react-select/dist/react-select.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './user-role.component.css';
import { PersonModel, personStore } from './../../stores/person.store';
import ErrorMessage from './../error-message.component';

export interface IUserRoleProps {
  person?: PersonModel;
  editable: boolean;
  async: boolean;
  error: Array<string>;
}
export interface IUserRoleStatus {
  role?: string;
}
export default class UserRoleComponent extends React.Component<IUserRoleProps, IUserRoleStatus> {
  constructor(props : IUserRoleProps) {
    super(props);
    let self: UserRoleComponent = this;
    this.state = {
      role: "",
    };
  }
  public componentDidMount() {
    let self: UserRoleComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: UserRoleComponent = this;
  }
  public componentWillReceiveProps (nextProps: IUserRoleProps) {
    let self: UserRoleComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IUserRoleProps) {
    let self: UserRoleComponent = this;
    if (props.person) {
      self.setState({role: props.person.getFormattedAuth()});
    }
  }
  // private updateAttribute = (selected?: any) => {
  //   let self: UserNameComponent = this;
  //   self.props.person.setName(self.state.name);
  //   if (self.props.async) {
  //     // personStore.updatePerson(self.props.person);
  //   } else {
  //
  //   }
  // }

  render() {
    let self: UserRoleComponent = this;
    if (self.props.person && (self.props.editable || self.props.person.getId() == 0)) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onMouseUp={()=> {
            // if (self.props.editable) {
            //   self.setState({editing: true});
            // }
          }}>
            <FontAwesome className='' name='long-arrow-right' /> Role
          </div>
          <div className={styles.edit}>

          </div>
          <div className={styles.message}>
            <ErrorMessage error={self.props.error} match={new Array<string>()} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper2}>
          <div className={styles.label}>
            <FontAwesome className='' name='long-arrow-right' /> Role
          </div>
          <div className={styles.value}>
            {self.state.role}
          </div>
        </div>
      );
    }

  }
}
