import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';
import * as moment from 'moment';
import { PinchView } from 'react-pinch-zoom-pan';

var Settings = require('./../../constraints/settings.json');
import * as styles from './image-zoom.component.css';
import { NoteModel, noteStore } from './../../stores/note.store';

export interface IImageZoomProps {
  title: string;
  image: string;
  onClose: Function;
}
export interface IImageZoomStatus {
  open?: boolean;
  width?: number;
  height?: number;
}
export default class ImageZoomComponent extends React.Component<IImageZoomProps, IImageZoomStatus> {
  constructor(props : IImageZoomProps) {
    super(props);
    let self: ImageZoomComponent = this;
    self.state = {
      open: false,
    };
  }
  public componentDidMount() {
    let self: ImageZoomComponent = this;
    self.updateProps(self.props);
    let container = ReactDOM.findDOMNode(self.refs['container']);
    self.setState({width: container.clientWidth, height: container.clientHeight - 68});
  }
  public componentWillUnmount() {
    let self: ImageZoomComponent = this;
  }
  public componentWillReceiveProps (nextProps: IImageZoomProps) {
    let self: ImageZoomComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: IImageZoomProps) => {
    let self: ImageZoomComponent = this;
  }

  render() {
    let self: ImageZoomComponent = this;
    let defaultScale: number = 1;
    if (self.state.width < self.state.height) {
      defaultScale = 2;
    }
    if (self.state.width && self.state.height) {
      return(
        <div className={styles.wrapper}>
          <div className={styles.inner} ref="container">
            <div className={styles.header}>
              <div className={styles.title}>
                {self.props.title}
              </div>
              <div className={styles.close}><FontAwesome className='' name='close' onClick={()=> {
                self.props.onClose();
              }}/></div>
            </div>
            <div className={styles.image}>
              <PinchView debug defaultScale={defaultScale} maxScale={4} containerRatio={((self.state.height / self.state.width) * 100)}>
                <img src={Settings.uBaseName + Settings.uContentImage + self.props.image} style={{
                  margin: 'auto',
                  width: '100%',
                  height: 'auto'
                }} />
              </PinchView>
            </div>
          </div>
        </div>
      );
    } else {
      return(
        <div className={styles.wrapper}>
          <div className={styles.inner} ref="container">
          </div>
        </div>
      );
    }
  }
}
