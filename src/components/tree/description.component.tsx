import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import * as FontAwesome from 'react-fontawesome';
import './../../../node_modules/font-awesome/css/font-awesome.css';

var Settings = require('./../../constraints/settings.json');
import * as styles from './description.component.css';
import { TreeModel, treeStore } from './../../stores/tree.store';
import { addLoading, removeLoading } from './../../utils/loadingtracker';
import { FoodModel, foodStore } from './../../stores/food.store';
import { treeActions } from './../../actions/tree.actions';

export interface IDescriptionProps {
  tree: TreeModel;
  editable: boolean;
  async: boolean;
}
export interface IDescriptionStatus {
  description?: string;
  editing?: boolean;
}
export default class DescriptionComponent extends React.Component<IDescriptionProps, IDescriptionStatus> {
  constructor(props : IDescriptionProps) {
    super(props);
    let self: DescriptionComponent = this;
    this.state = {
      description: "",
      editing: false,
    };
  }
  public componentDidMount() {
    let self: DescriptionComponent = this;
    self.updateProps(self.props);
  }
  public componentWillUnmount() {
    let self: DescriptionComponent = this;
  }
  public componentWillReceiveProps (nextProps: IDescriptionProps) {
    let self: DescriptionComponent = this;
    self.updateProps(nextProps);
  }

  private updateProps(props: IDescriptionProps) {
    let self: DescriptionComponent = this;
    if (props.tree) {
      if (props.tree.getDescription().trim() != "") {
        self.setState({description: props.tree.getDescription().trim(), editing: false});
      } else {
        self.setState({description: "", editing: false});
      }
    }
  }
  private updateAttribute = () => {
    let self: DescriptionComponent = this;
    self.props.tree.setDescription(self.state.description);
    if (self.props.async) {
      let food: FoodModel = foodStore.getFood(self.props.tree.getFoodId());
      treeActions.updateTree(self.props.tree, "Successfully updated the description of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.", "Failed to update the description of <strong>" + food.getName() + self.props.tree.getName() + "</strong>.");
    } else {
      self.setState({editing: false});
    }
  }

  render() {
    let self: DescriptionComponent = this;
    if (self.state.editing) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.label} onClick={()=> {
            self.setState({description: self.state.description, editing: true});
          }}>
            <FontAwesome className='' name='sticky-note' /> Description
          </div>
          <div className={styles.editname}>
            <input autoFocus type="text" className={styles.edit} key={self.props.tree.getId() + "description"} placeholder="enter description of tree..."
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
            <FontAwesome className='' name='sticky-note' /> Description
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
