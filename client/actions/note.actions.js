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
  setSelected(id) {
    return (dispatch) => {
      dispatch(id);
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
  updateNote(note) {
    return (dispatch) => {
      dispatch();
      this.setCode(92);
      NoteSource.updateNote(note).then((response) => {
        displaySuccessMessage(localization(604));
        this.updatedNote(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        this.setCode(code);
      });
    }
  }
  updatedNote(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
}

module.exports = alt.createActions(NoteActions);
