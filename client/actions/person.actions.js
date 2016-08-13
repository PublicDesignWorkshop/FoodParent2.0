let alt = require('../alt');
import { browserHistory } from 'react-router';

let ServerSetting = require('./../../setting/server.json');
let PersonSource = require('./../sources/person.source');


class PersonActions {
  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }
  fetchUser(id) {
    return (dispatch) => {
      dispatch();
      PersonSource.fetchPersons([id]).then((response) => {
        this.fetchedUser(response);
      }).catch((code) => {
        this.setCode(code);
      });
    }
  }
  fetchedUser(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  fetchPersons(ids) {
    return (dispatch) => {
      dispatch();
      PersonSource.fetchPersons(ids).then((response) => {
        this.fetchedPersons(response);
      }).catch((code) => {
        this.setCode(code);
      });
    }
  }
  fetchedPersons(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
}

module.exports = alt.createActions(PersonActions);
