import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import { personActions } from './../actions/person.actions';
import { personStore, PersonModel, PersonState } from './../stores/person.store';


let PersonSource = {
  fetchPersons(ids: Array<number>): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "persons.php",
        type: 'GET',
        data: {
          ids: ids.toString(),
        },
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.persons);
          } else {
            console.log(response.message);
            reject(response.code);
          }
        },
        error: function(response) {
          console.log(response.statusText);
          reject(response.status);
        }
      });
    })
  },
  createPerson(person: PersonModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      $.ajax({
        url: Settings.uBaseName + Settings.uServer + "person.php",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(person.toJSON()),
        dataType: "json",
        success: function(response) {
          if (response.code == 200) {
            resolve(response.person);
          } else {
            console.log(response.message);
            reject(response.code);
          }
        },
        error: function(response) {
          console.log(response.statusText);
          reject(response.status);
        }
      });
    })
  },






  //
  //
  // fetchPersons(): AltJS.SourceModel<Array<PersonModel>> {
  //   return {
  //     remote(state: PersonState, ids?: Array<number>) {
  //       return new Promise<Array<PersonModel>>((resolve, reject) => {
  //         $.ajax({
  //           url: Settings.uBaseName + Settings.uServer + "persons.php",
  //           type: 'GET',
  //           data: {
  //             ids: ids.toString(),
  //           },
  //           success: function(response) {
  //             resolve($.parseJSON(response));
  //           },
  //           error: function(response) {
  //             console.log(response);
  //             reject(response);
  //           }
  //         });
  //       })
  //     },
  //     local(state: PersonState): Array<PersonModel> {
  //       //TODO : Figure out why local doesn't work =(
  //       return null;
  //     },
  //     success: personActions.fetchPersons,
  //     error: personActions.failed,
  //     loading: personActions.loading,
  //     shouldFetch:() => true
  //   };
  // },
  updatePerson(): AltJS.SourceModel<PersonModel> {
    return {
      remote(state: PersonState, update?: PersonModel) {
        return new Promise<PersonModel>((resolve, reject) => {
          //console.log(tree.toJSON());
          $.ajax({
            url: Settings.uBaseName + Settings.uServer + "person.php",
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(update.toJSON()),
            dataType: "json",
            success: function(response) {
              resolve(response[0]);
            },
            error: function(response) {
              console.log(response);
              reject(response);
            }
          });
        })
      },
      local(state: PersonState): PersonModel {
        //TODO : Figure out why local doesn't work =(
        return null;
      },
      success: personActions.updatePerson,
      error: personActions.failed,
      loading: personActions.loading,
      shouldFetch:() => true
    };
  },

  deletePerson(): AltJS.SourceModel<PersonModel> {
    return {
      remote(state: PersonState, remove?: PersonModel) {
        return new Promise<PersonModel>((resolve, reject) => {
          //console.log(tree.toJSON());
          $.ajax({
            url: Settings.uBaseName + Settings.uServer + "person.php",
            type: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify(remove.toJSON()),
            dataType: "json",
            success: function(response) {
              resolve(remove.toJSON());
            },
            error: function(response) {
              console.log(response);
              reject(response);
            }
          });
        })
      },
      local(state: PersonState): PersonModel {
        //TODO : Figure out why local doesn't work =(
        return null;
      },
      success: personActions.deletePerson,
      error: personActions.failed,
      loading: personActions.loading,
      shouldFetch:() => true
    };
  }
};

export const personSource = PersonSource;
