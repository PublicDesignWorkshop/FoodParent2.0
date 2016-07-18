import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';

import { foodActions } from './../actions/food.actions';
import { AbstractStore } from './../stores/abstract.store';

export interface IFoodProps {
  id: string;
  name: string;
  icon: string;
  description: string;
  adopt: string;
  farm: string;
  updated: string;
}

export class FoodModel {
  id: number;
  name: string;
  icon: string;
  description: string;
  adopt: boolean;
  farm: boolean;
  updated: moment.Moment;

  constructor(props: IFoodProps) {
    let self: FoodModel = this;
    self.id = parseInt(props.id);
    self.name = props.name;
    self.icon = props.icon;
    self.description = props.description;
    self.updated = moment(props.updated);
    if (props.adopt == "1") {
      self.adopt = true;
    } else {
      self.adopt = false;
    }
    if (props.farm == "1") {
      self.farm = true;
    } else {
      self.farm = false;
    }
  }
  public toJSON(): any {
    let self: FoodModel = this;
    let adopt: string;
    let farm: string;
    if (self.adopt) {
      adopt = "1";
    } else {
      adopt = "0";
    }
    if (self.farm) {
      farm = "1";
    } else {
      farm = "0";
    }
    return {
      id: self.id,
      name: self.name,
      icon: self.icon,
      description: self.description,
      adopt: adopt,
      farm: farm
    }
  }
  public update(props: IFoodProps) {
    let self: FoodModel = this;
    self.id = parseInt(props.id);
    self.name = props.name;
    self.icon = props.icon;
    self.description = props.description;
    self.updated = moment(props.updated);
    if (props.adopt == "1") {
      self.adopt = true;
    } else {
      self.adopt = false;
    }
    if (props.farm == "1") {
      self.farm = true;
    } else {
      self.farm = false;
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
  public getAdaptability(): boolean {
    return this.adopt;
  }
  public setAdaptability(adopt: boolean) {
    this.adopt = adopt;
  }
  public getIsFarm(): boolean {
    return this.farm;
  }
}

export interface FoodState {
  foods: Array<FoodModel>;
  errorMessage: string;
}

interface FoodExtendedStore extends AltJS.AltStore<FoodState> {
  getFood(id: number): FoodModel;
}

class FoodStore extends AbstractStore<FoodState> {
  private foods: Array<FoodModel>;
  private code: any;
  constructor() {
    super();
    let self: FoodStore = this;
    self.foods = new Array<FoodModel>();
    self.code = 200;
    self.bindListeners({
      handleFetchedFoods: foodActions.fetchedFoods,
      handleUpdatedFood: foodActions.updatedFood,
      handleSetCode: foodActions.setCode,
    });
    self.exportPublicMethods({
      getFood: self.getFood,
    });
  }
  getFood(id: number): FoodModel {
    let self: FoodStore = this;
    let foods = self.getState().foods.filter(food => food.getId() == id);
    if (foods.length == 1) {
      return foods[0];
    }
    return null;
  }
  handleFetchedFoods(foodsProps: Array<IFoodProps>) {
    let self: FoodStore = this;
    self.foods = new Array<FoodModel>();
    foodsProps.forEach((props: IFoodProps) => {
      self.foods.push(new FoodModel(props));
    });
    self.code = 200;
  }
  handleUpdatedFood(foodProps: IFoodProps) {
    let self: FoodStore = this;
    let foods = self.foods.filter(food => food.getId() == parseInt(foodProps.id));
    if (foods.length == 1) {
      foods[0].update(foodProps);
    }
  }
  handleSetCode(code: number) {
    let self: FoodStore = this;
    self.code = code;
  }
}

export const foodStore: FoodExtendedStore = alt.createStore<FoodState>(FoodStore) as FoodExtendedStore;
