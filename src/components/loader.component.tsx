import * as React from 'react';

import * as styles from './loader.component.css';

export interface ILoaderProps {

}

export interface ILoaderStatus {
  active: boolean;
}

export default class LoaderComponent extends React.Component<ILoaderProps, ILoaderStatus> {
  constructor(props : ILoaderProps) {
    super(props);
    let self: LoaderComponent = this;
    this.state = {
      active: false,
    };
  }
  public componentDidMount() {
    let self: LoaderComponent = this;
  }
  public componentWillUnmount() {
    let self: LoaderComponent = this;
  }
  public componentWillReceiveProps (nextProps: ILoaderProps) {
    let self: LoaderComponent = this;
  }

  render() {
    let self: LoaderComponent = this;
    if (self.state.active) {
      return <div className={styles.wrapper}>
        <div className={styles.loader}>
        </div>
      </div>;
    } else {
      return <div className={styles.wrapper}>
        <div id="loader" className={styles.loader + " hide"}>
        </div>
      </div>;
    }
  }
}
