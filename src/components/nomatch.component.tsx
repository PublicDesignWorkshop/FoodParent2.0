import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as AltContainer from 'alt-container';

import * as styles from './nomatch.component.css';

export interface INoMatchProps {
  location: any;
}

export interface INoMatchStatus {

}

export default class NoMatchComponent extends React.Component<INoMatchProps, INoMatchStatus> {
  constructor(props : INoMatchProps) {
    super(props);
    let self: NoMatchComponent = this;
    this.state = {
    };
  }
  public componentDidMount() {
    let self: NoMatchComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: NoMatchComponent = this;
  }
  public componentWillReceiveProps (nextProps: INoMatchProps) {
    let self: NoMatchComponent = this;
    self.updateProps(nextProps);
  }
  private updateProps = (props: INoMatchProps) => {
    let self: NoMatchComponent = this;
  }
  render() {
    let self: NoMatchComponent = this;
    return (
      <div className={styles.wrapper}>
        Page Not Found...
      </div>
    );
  }
}
