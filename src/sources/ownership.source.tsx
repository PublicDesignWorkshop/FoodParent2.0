import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import { ownershipActions } from './../actions/ownership.actions';
import { ownershipStore, OwnershipModel, OwnershipState } from './../stores/ownership.store';


let OwnershipSource: AltJS.Source = {
  fetchOwnerships(): AltJS.SourceModel<Array<OwnershipModel>> {
    return {
      remote(state: OwnershipState) {
        return new Promise<Array<OwnershipModel>>((resolve, reject) => {
          $.ajax({
            url: Settings.uBaseName + Settings.uServer + "ownerships.php",
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
      local(state: OwnershipState): Array<OwnershipModel> {
        //TODO : Figure out why local doesn't work =(
        return null;
      },
      success: ownershipActions.fetchOwnerships,
      error: ownershipActions.failed,
      loading: ownershipActions.loading,
      shouldFetch: () => true
    };
  }
};

export const ownershipSource = OwnershipSource;
