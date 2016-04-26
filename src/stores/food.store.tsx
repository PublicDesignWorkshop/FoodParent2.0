import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';

import { foodActions } from './../actions/food.actions';
import { AbstractStore } from './../stores/abstract.store';
import { foodSource } from './../sources/food.source';

export interface IFoodProps {
  id: string;
  name: string;
  icon: string;
  description: string;
  updated: string;
}

export class FoodModel {
  id: number;
  name: string;
  icon: string;
  description: string;
  updated: moment.Moment;

  constructor(props: IFoodProps) {
    let self: FoodModel = this;
    self.id = parseInt(props.id);
    self.name = props.name;
    self.icon = props.icon;
    self.description = props.description;
    self.updated = moment(props.updated);
  }
  private toJSON(): any {
    let self: FoodModel = this;
    return {
      id: self.id,
      name: self.name,
      icon: self.icon,
      description: self.description
    }
  }
  public getId(): number {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getIcon(): string {
    return this.icon;
  }
  public getDescription(): string {
    return this.description;
  }
}

export interface FoodState {
  foods: Array<FoodModel>;
  errorMessage: string;
}

interface FoodExtendedStore extends AltJS.AltStore<FoodState> {
  getFood(id: number): FoodModel;
  fetchFoods(): void;
  isLoading(): boolean;
}

class FoodStore extends AbstractStore<FoodState> {
  private foods: Array<FoodModel>;
  private errorMessage: string
  constructor() {
    super();
    let self: FoodStore = this;
    self.foods = new Array<FoodModel>();
    self.errorMessage = null;
    //TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleFetchFoods: foodActions.fetchFoods,
      handleFailed: foodActions.failed
    });
    self.exportPublicMethods({
      getFood: self.getFood
    });
    self.exportAsync(foodSource);
  }
  handleFetchFoods(foodsProps: Array<IFoodProps>) {
    let self: FoodStore = this;
    console.warn("Handle Fetch Foods");
    self.foods = new Array<FoodModel>();
    foodsProps.forEach((props: IFoodProps) => {
      self.foods.push(new FoodModel(props));
    });
    self.errorMessage = null;
  }
  handleFailed(errorMessage: string) {
    console.warn("Handle Food Failed");
    this.errorMessage = errorMessage;
  }
  getFood(id: number): FoodModel {
    let self: FoodStore = this;
    let foods = self.getState().foods;
    for(var i = 0; i < foods.length; i++) {
      if(foods[i].id === id) {
        return foods[i];
      }
    }
    return null;
  }
}

export const foodStore: FoodExtendedStore = alt.createStore<FoodState>(FoodStore) as FoodExtendedStore;
