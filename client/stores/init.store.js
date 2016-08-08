let alt = require('./../alt');

let InitActions = require('./../actions/init.actions');

class InitStore {
  constructor() {
    this.message = "Initializing Application..."
    this.loaded = false;
    this.hide = false;
    this.code = 200;
    // Bind action methods to store.
    this.bindListeners({
      handleHideSplashPage: InitActions.HIDE_SPLASH_PAGE,
      handleSetMessage: InitActions.SET_MESSAGE,
      handleLoaded: InitActions.LOADED,
      handleSetCode: InitActions.SET_CODE,
    });
  }
  handleSetMessage(message) {
    this.message = message;
  }
  handleLoaded() {
    this.loaded = true;
    this.code = 200;
  }
  handleHideSplashPage() {
    this.hide = true;
    this.code = 200;
  }
  handleSetCode(code) {
    this.code = code;
  }
}

module.exports = alt.createStore(InitStore, 'InitStore');
