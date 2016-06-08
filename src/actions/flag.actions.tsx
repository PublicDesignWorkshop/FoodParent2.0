import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { FlagModel, IFlagProps } from './../stores/flag.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { flagSource } from './../sources/flag.source';

interface IFlagActions {
  // fetchFlags(foods: Array<FlagModel>): void;
  // updateFlag(tree: FlagModel): void;
  // failed(errorMessage: any);
  // loading(): void;
  fetchFlags();
  updateFlags(foodsProps: Array<IFlagProps>);
  failed(code: number);
}

class FlagActions extends AbstractActions implements IFlagActions {
  fetchFlags() {
    let self: FlagActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      flagSource.fetchFlags().then((flagsProps) => {
        self.updateFlags(flagsProps);
      }).catch((code) => {
        self.failed(parseInt(code));
      });
    }
  }
  updateFlags(flagsProps: Array<IFlagProps>) {
    let self: FlagActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(flagsProps);
    }
  }
  failed(code: number) {
    let self: FlagActions = this;
  }
  // fetchFlags(trees: Array<FlagModel>) {
  //   let self: FlagActions = this;
  //   console.warn("Fetch Trees");
  //   removeLoading();
  //   return trees;
  // }
  // updateFlag(tree: FlagModel) {
  //   let self: FlagActions = this;
  //   console.warn("Update Flag");
  //   removeLoading();
  //   return tree;
  // }
  // failed(errorMessage:any) {
  //   let self: FlagActions = this;
  //   console.warn("Flag Failed");
  //   removeLoading();
  //   return errorMessage;
  // }
  // loading() {
  //   let self: FlagActions = this;
  //   addLoading();
  //   return (dispatch) => {
  //     // we dispatch an event here so we can have "loading" state.
  //     dispatch();
  //   }
  // }
}

export const flagActions = alt.createActions<IFlagActions>(FlagActions);
