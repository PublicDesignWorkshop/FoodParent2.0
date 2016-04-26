import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { FoodModel } from './../stores/food.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';

interface IFoodActions {
  fetchFoods(foods: Array<FoodModel>): void;
  updateFood(tree: FoodModel): void;
  failed(errorMessage: any);
  loading(): void;
}

class FoodActions extends AbstractActions implements IFoodActions {
  fetchFoods(trees: Array<FoodModel>) {
    let self: FoodActions = this;
    console.warn("Fetch Foods");
    removeLoading();
    return trees;
  }
  updateFood(tree: FoodModel) {
    let self: FoodActions = this;
    console.warn("Update Food");
    removeLoading();
    return tree;
  }
  failed(errorMessage:any) {
    let self: FoodActions = this;
    console.warn("Food Failed");
    removeLoading();
    return errorMessage;
  }
  loading() {
    let self: FoodActions = this;
    addLoading();
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
    }
  }
}

export const foodActions = alt.createActions<IFoodActions>(FoodActions);
