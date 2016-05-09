import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as AltContainer from 'alt-container';

var Settings = require('./../../constraints/settings.json');
import * as styles from './note-add.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { LogInStatus } from './../app.component';
import { uploadImage } from './../../utils/upload';

export interface INoteAddProps {
  trees: Array<TreeModel>;
  treeId: number;
  login: LogInStatus;
  userId: number;
}
export interface INoteAddStatus {
  editable: boolean;
}
export default class NoteAddComponent extends React.Component<INoteAddProps, INoteAddStatus> {
  static contextTypes: any;
  constructor(props : INoteAddProps) {
    super(props);
    let self: NoteAddComponent = this;
    this.state = {
      editable: false,
    };
  }
  public componentDidMount() {
    let self: NoteAddComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: NoteAddComponent = this;
  }
  public componentWillReceiveProps (nextProps: INoteAddProps) {
    let self: NoteAddComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps = (props: INoteAddProps) => {
    let self: NoteAddComponent = this;
  }

  render() {
    let self: NoteAddComponent = this;
    if (self.props.treeId) {
      var tree: TreeModel = treeStore.getTree(self.props.treeId);
      return (
        <div className={styles.wrapper}>
          <input className={styles.upload} type="file" accept="image/*" capture="camera" onChange={(event: any)=> {
            console.log('Selected file:', event.target.files[0]);
            uploadImage(event.target.files[0], tree.getId().toString(), function(filename: string) {  // success
              console.log(filename);
            }, function() { // fail

            });
          }} />
          <div className={styles.inner}>

          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.wrapper}>
        </div>
      );
    }
  }
}

NoteAddComponent.contextTypes = {
  router: function () {
    return React.PropTypes.func.isRequired;
  }
};
