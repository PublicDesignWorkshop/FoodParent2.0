let alt = require('./../alt');
import moment from 'moment';

let FlagActions = require('./../actions/flag.actions');

export class FlagModel {
  constructor(props) {
    this.update(props);
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      classname: this.classname,
    }
  }
  update(props) {
    this.id = parseInt(props.id);
    this.name = props.name;
    this.classname = props.classname;
  }
}

class FlagStore {
  constructor() {
    this.flags = [];
    this.code = 200;
    // Bind action methods to store.
    this.bindListeners({
      handleFetchedFlags: FlagActions.FETCHED_FLAGS,
      handleSetCode: FlagActions.SET_CODE,
    });
    // Expose public methods.
    this.exportPublicMethods({
      getFlag: this.getFlag,
    });
  }

  getFlag(id): FlagModel {
    let flags = this.getState().flags.filter(flag => flag.id == id);
    if (flags.length == 1) {
      return flags[0];
    }
    return null;
  }
  handleFetchedFlags(props) {
    this.flags = [];
    props.forEach((prop) => {
      this.flags.push(new FlagModel(prop));
    });
    this.code = 200;
  }
  handleSetCode(code) {
    this.code = code;
  }
}

module.exports = alt.createStore(FlagStore, 'FlagStore');
