import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { FoodModel, IFoodProps } from './../stores/food.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { foodSource } from './../sources/food.source';
import { displaySuccessMessage, displayErrorMessage } from './../utils/message';
import { localization } from './../constraints/localization';

interface IFoodActions {
  fetchFoods();
  fetchedFoods(foodsProps: Array<IFoodProps>);
  updateFood(food: FoodModel);
  updatedFood(props: IFoodProps);
  setCode(code: number);
}

class FoodActions extends AbstractActions implements IFoodActions {
  setCode(code: number) {
    let self: FoodActions = this;
    return (dispatch) => {
      dispatch(code);
    }
  }
  fetchFoods() {
    let self: FoodActions = this;
    return (dispatch) => {
      addLoading();
      dispatch();
      self.setCode(90);
      foodSource.fetchFoods().then((response) => {
        self.fetchedFoods(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  fetchedFoods(foodsProps: Array<IFoodProps>) {
    let self: FoodActions = this;
    return (dispatch) => {
      dispatch(foodsProps);
    }
  }
  updateFood(food: FoodModel) {
    let self: FoodActions = this;
    return (dispatch) => {
      addLoading();
      dispatch();
      self.setCode(92);
      foodSource.updateFood(food).then((response) => {
        displaySuccessMessage(localization(634));
        self.updatedFood(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  updatedFood(props: IFoodProps) {
    let self: FoodActions = this;
    return (dispatch) => {
      dispatch(props);
    }
  }
  updateFoods(foodsProps: Array<IFoodProps>) {
    let self: FoodActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(foodsProps);
    }
  }
}

export const foodActions = alt.createActions<IFoodActions>(FoodActions);
