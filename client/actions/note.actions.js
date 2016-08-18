let alt = require('../alt');

let NoteSource = require('./../sources/note.source');
import { displaySuccessMessage, displayFailMessage } from './../message/popup.component';
import { localization } from './../utils/localization';


class NoteActions {
  setCode(code) {
    return (dispatch) => {
      dispatch(code);
    }
  }
  createTempNote() {
    return (dispatch) => {
      dispatch();
    }
  }
  fetchNotesFromTreeIds(ids) {
    if (ids != null) {
      return (dispatch) => {
        dispatch();
        this.setCode(90);
        NoteSource.fetchNotesFromTreeIds(ids).then((response) => {
          this.fetchedNotes(response);
        }).catch((code) => {
          displayFailMessage(localization(code));
          if (__DEV__) {
            console.error(localization(code));
          }
          this.setCode(code);
        });
      }
    }
    return null;
  }
  fetchedNotes(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
}

module.exports = alt.createActions(NoteActions);
