import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import { flagActions } from './../actions/flag.actions';
import { flagStore, FlagModel, FlagState } from './../stores/flag.store';


let FlagSource: AltJS.Source = {
  fetchFlags(): AltJS.SourceModel<Array<FlagModel>> {
    return {
      remote(state: FlagState) {
        return new Promise<Array<FlagModel>>((resolve, reject) => {
          $.ajax({
            url: Settings.uBaseName + Settings.uServer + "flags.php",
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
      local(state: FlagState): Array<FlagModel> {
        //TODO : Figure out why local doesn't work =(
        return null;
      },
      success: flagActions.fetchFlags,
      error: flagActions.failed,
      loading: flagActions.loading,
      shouldFetch: () => true
    };
  }
};

export const flagSource = FlagSource;
