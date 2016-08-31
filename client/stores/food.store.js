let alt = require('./../alt');
import moment from 'moment';

let FoodActions = require('./../actions/food.actions');
let FlagStore = require('./../stores/flag.store');

let ServerSetting = require('./../../setting/server.json');
let MapSetting = require('./../../setting/map.json');


export class FoodModel {
  constructor(props) {
    this.update(props);
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      description: this.description,
      adopt: this.adopt == true ? "1" : "0",
      farm: this.farm == true ? "1" : "0"
    }
  }
  update(props) {
    this.id = parseInt(props.id);
    this.name = props.name;
    this.icon = props.icon;
    this.description = props.description;
    this.updated = moment(props.updated);
    if (!this.updated.isValid()) {
      this.updated = moment(new Date());
    }
    this.adopt = props.adopt == "1" ? true : false;
    this.farm = props.farm == "1" ? true : false;
  }
}

class FoodStore {
  constructor() {
    this.foods = [];
    this.shadowImage = null;
    this.checkImage = null;
    this.farmImage = null;
    this.tempImage = null;
    this.code = 200;
    // Bind action methods to store.
    this.bindListeners({
      handleFetchedFoods: FoodActions.FETCHED_FOODS,
      handleSetCode: FoodActions.SET_CODE,
      handleRegisterIcons: FoodActions.REGISTER_ICONS,
    });
    // Expose public methods.
    this.exportPublicMethods({
      getFood: this.getFood,
      getFoodIcons: this.getFoodIcons,
    });
  }

  getFood(id) {
    let foods = this.getState().foods.filter(food => food.id == id);
    if (foods.length == 1) {
      return foods[0];
    }
    return null;
  }
  getFoodIcons() {
    let result = [ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uShadowMarker, ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uCheckMarkerIcon, ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uFarmMarkerIcon, ServerSetting.uBase + ServerSetting.uStaticImage + MapSetting.uTemporaryMarkerIcon];
    this.getState().foods.forEach((food) => {
      result.push(ServerSetting.uBase + ServerSetting.uStaticImage + food.icon);
    });
    return result;
  }
  handleFetchedFoods(props) {
    this.foods = [];
    props.forEach((prop) => {
      this.foods.push(new FoodModel(prop));
    });
    this.code = 200;
  }
  handleSetCode(code) {
    this.code = code;
  }
  handleRegisterIcons(props) {
    if (props[0].state == "fulfilled") {  // image[0]: marker shadow image
      this.shadowImage = props[0].value;
    }
    if (props[1].state == "fulfilled") {  // image[1]: marker check image
      this.checkImage = props[1].value;
    }
    if (props[2].state == "fulfilled") {  // image[2]: farm image
      this.farmImage = props[2].value;
    }
    if (props[3].state == "fulfilled") {  // image[3]: temp marker
      this.tempImage = props[3].value;
    }
    for (let i = 0; i < this.foods.length; i++) {
      this.foods[i].image = props[i + 4].value;
    }
    this.code = 200;
  }
}

module.exports = alt.createStore(FoodStore, 'FoodStore');
