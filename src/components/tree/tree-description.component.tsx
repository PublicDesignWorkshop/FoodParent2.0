import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';

import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';
import * as styles from './tree-description.component.css';
var Settings = require('./../../constraints/settings.json');

import { TreeModel } from './../../stores/tree.store';
import { treeActions } from './../../actions/tree.actions';

import { localization } from './../../constraints/localization';

export interface ITreeDescriptionProps {
  tree: TreeModel;
  editable: boolean;
  async: boolean;
}
export interface ITreeDescriptionStatus {
  description?: string;
  editing?: boolean;
}

export default class TreeDescriptionComponent extends React.Component<ITreeDescriptionProps, ITreeDescriptionStatus> {
  constructor(props : ITreeDescriptionProps) {
    super(props);
    let self: TreeDescriptionComponent = this;
    this.state = {
      description: "",
      editing: false,
    };
  }
  public componentDidMount() {
    let self: TreeDescriptionComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: TreeDescriptionComponent = this;
  }
  public componentWillReceiveProps (nextProps: ITreeDescriptionProps) {
    let self: TreeDescriptionComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: ITreeDescriptionProps) {
    let self: TreeDescriptionComponent = this;
    if (props.tree) {
      if (props.tree.getDescription().trim() != "") {
        self.setState({description: props.tree.getDescription().trim(), editing: false});
      } else {
        self.setState({description: "", editing: false});
      }
    }
  }
  private updateAttribute = () => {
    let self: TreeDescriptionComponent = this;
    self.props.tree.setDescription(self.state.description);
    if (self.props.async) {
      treeActions.updateTree(self.props.tree);
    } else {
      self.setState({editing: false});
    }
  }

  render() {
    let self: TreeDescriptionComponent = this;
    if (self.state.editing) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {
            self.setState({description: self.state.description, editing: true});
          }}>
            <FontAwesome className='' name='sticky-note' /> {localization(968)}
          </div>
          <div className={styles.editname}>
            <input autoFocus type="text" className={styles.edit} key={self.props.tree.getId() + "description"} placeholder={localization(973)}
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
            <FontAwesome className='' name='sticky-note' /> {localization(968)}
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
