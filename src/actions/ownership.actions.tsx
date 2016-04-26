import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { OwnershipModel } from './../stores/ownership.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';

interface IOwnershipActions {
  fetchOwnerships(foods: Array<OwnershipModel>): void;
  updateOwnership(tree: OwnershipModel): void;
  failed(errorMessage: any);
  loading(): void;
}

class OwnershipActions extends AbstractActions implements IOwnershipActions {
  fetchOwnerships(trees: Array<OwnershipModel>) {
    let self: OwnershipActions = this;
    console.warn("Fetch Trees");
    removeLoading();
    return trees;
  }
  updateOwnership(tree: OwnershipModel) {
    let self: OwnershipActions = this;
    console.warn("Update Ownership");
    removeLoading();
    return tree;
  }
  failed(errorMessage:any) {
    let self: OwnershipActions = this;
    console.warn("Ownership Failed");
    removeLoading();
    return errorMessage;
  }
  loading() {
    let self: OwnershipActions = this;
    addLoading();
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
    }
  }
}

export const ownershipActions = alt.createActions<IOwnershipActions>(OwnershipActions);
