import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { FlagModel } from './../stores/flag.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';

interface IFlagActions {
  fetchFlags(foods: Array<FlagModel>): void;
  updateFlag(tree: FlagModel): void;
  failed(errorMessage: any);
  loading(): void;
}

class FlagActions extends AbstractActions implements IFlagActions {
  fetchFlags(trees: Array<FlagModel>) {
    let self: FlagActions = this;
    console.warn("Fetch Trees");
    removeLoading();
    return trees;
  }
  updateFlag(tree: FlagModel) {
    let self: FlagActions = this;
    console.warn("Update Flag");
    removeLoading();
    return tree;
  }
  failed(errorMessage:any) {
    let self: FlagActions = this;
    console.warn("Flag Failed");
    removeLoading();
    return errorMessage;
  }
  loading() {
    let self: FlagActions = this;
    addLoading();
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
    }
  }
}

export const flagActions = alt.createActions<IFlagActions>(FlagActions);
