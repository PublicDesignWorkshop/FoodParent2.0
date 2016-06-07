import * as React from 'react';

import * as styles from './loader.component.css';

export interface ILoaderProps {

}

export interface ILoaderStatus {

}

export default class LoaderComponent extends React.Component<ILoaderProps, ILoaderStatus> {
  constructor(props : ILoaderProps) {
    super(props);
    let self: LoaderComponent = this;
    this.state = {

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
    return (
      <div className={styles.wrapper}>
        <div id="loader" className={styles.loader + " hide"}>
        </div>
      </div>
    );
  }
}
