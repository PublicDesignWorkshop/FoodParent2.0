import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import { foodActions } from './../actions/food.actions';
import { foodStore, FoodModel, FoodState } from './../stores/food.store';


let FoodSource: AltJS.Source = {
  fetchFoods(): AltJS.SourceModel<Array<FoodModel>> {
    return {
      remote(state: FoodState) {
        return new Promise<Array<FoodModel>>((resolve, reject) => {
          $.ajax({
            url: Settings.uBaseName + Settings.uServer + "foods.php",
            data: {

            },
            success: function(response) {
              resolve($.parseJSON(response));
            },
            error: function(response) {
              console.log(response);
              reject(response);
            }
          });
        })
      },
      local(state: FoodState): Array<FoodModel> {
        //TODO : Figure out why local doesn't work =(
        return null;
      },
      success:foodActions.fetchFoods,
      error:foodActions.failed,
      loading:foodActions.loading,
      shouldFetch:() => true
    };
  }
};

export const foodSource = FoodSource;
