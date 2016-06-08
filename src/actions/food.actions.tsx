import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { FoodModel, IFoodProps } from './../stores/food.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { foodSource } from './../sources/food.source';

interface IFoodActions {
  fetchFoods();
  updateFoods(foodsProps: Array<IFoodProps>);
  failed(code: number);
  // updateFood(tree: FoodModel): void;
  // failed(errorMessage: any);
  // loading(): void;
}

class FoodActions extends AbstractActions implements IFoodActions {
  fetchFoods() {
    let self: FoodActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      foodSource.fetchFoods().then((foodsProps) => {
        self.updateFoods(foodsProps);
      }).catch((code) => {
        self.failed(parseInt(code));
      });
    }
  }
  updateFoods(foodsProps: Array<IFoodProps>) {
    let self: FoodActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(foodsProps);
    }
  }
  failed(code: number) {
    let self: FoodActions = this;
  }
  //
  // fetchFoods(trees: Array<FoodModel>) {
  //   let self: FoodActions = this;
  //   console.warn("Fetch Foods");
  //   removeLoading();
  //   return trees;
  // }
  // updateFood(tree: FoodModel) {
  //   let self: FoodActions = this;
  //   console.warn("Update Food");
  //   removeLoading();
  //   return tree;
  // }
  // failed(errorMessage:any) {
  //   let self: FoodActions = this;
  //   console.warn("Food Failed");
  //   removeLoading();
  //   return errorMessage;
  // }
  // loading() {
  //   let self: FoodActions = this;
  //   addLoading();
  //   return (dispatch) => {
  //     // we dispatch an event here so we can have "loading" state.
  //     dispatch();
  //   }
  // }
}

export const foodActions = alt.createActions<IFoodActions>(FoodActions);
