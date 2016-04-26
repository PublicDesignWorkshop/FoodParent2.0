import * as React from 'react';
import { render } from 'react-dom';
import { Router, Link } from 'react-router';

var Settings = require('./../constraints/settings.json');
import * as styles from './nav.component.css';
import { LogInStatus } from './app.component';

export interface INavProps {
  login: LogInStatus;
  contact: string;
}
export interface INavStatus {

}
export default class NavComponent extends React.Component<INavProps, INavStatus> {
  private map: any;
  static contextTypes: any;
  constructor(props : INavProps) {
    super(props);
    let self: NavComponent = this;
    this.state = {

    };
  }
  public componentDidMount() {
    let self: NavComponent = this;
  }
  public componentWillUnmount() {
    let self: NavComponent = this;
  }
  public componentWillReceiveProps (nextProps: INavProps) {
    let self: NavComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: INavProps) => {
    let self: NavComponent = this;
  }

  render() {
    let self: NavComponent = this;
    switch(self.props.login) {
      case LogInStatus.GUEST:
        return (
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <div className={styles.title} onClick={()=> {
                self.context.router.push({pathname: Settings.uBaseName + '/'});
              }}>
                FoodParent
              </div>
              <div className={styles.logo}></div>
            </div>
            <div className={styles.center}>TREES</div>
            <div className={styles.right}>
              <div className={styles.login} onClick={()=> {
                self.context.router.push({pathname: window.location.pathname, query: { login: true }});
              }}>
                PARENT IN
              </div>
            </div>
          </div>
        );
      case LogInStatus.PARENT:
      case LogInStatus.MANAGER:
        return (
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <div className={styles.title} onClick={()=> {
                self.context.router.push({pathname: Settings.uBaseName + '/'});
              }}>
                FoodParent
              </div>
              <div className={styles.logo}></div>
            </div>
            <div className={styles.center}>TREES</div>
            <div className={styles.right}>
              <div className={styles.login} onClick={()=> {
                self.context.router.push({pathname: window.location.pathname, query: { login: true }});
              }}>
                {self.props.contact}
              </div>
            </div>
          </div>
        );
    }
  }
}

NavComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
