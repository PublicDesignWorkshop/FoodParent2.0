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
  createTempNote(treeId) {
    return (dispatch) => {
      dispatch(treeId);
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
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  updatedNote(props) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  createNote(note) {
    return (dispatch) => {
      dispatch();
      this.setCode(93);
      NoteSource.createNote(note).then((response) => {
        displaySuccessMessage(localization(605));
        this.createdNote(response);
      }).catch((code) => {
        displayFailMessage(localization(code));
        if (__DEV__) {
          console.error(localization(code));
        }
        this.setCode(code);
      });
    }
  }
  createdNote(props) {
    return (dispatch) => {
      // browserHistory.push({pathname: window.location.pathname, query: { note: props.id }});
      dispatch(props);
    }
  }
  deleteNote(note) {
    return (dispatch) => {
      dispatch();
      this.setCode(91);
      NoteSource.deleteNote(note).then((response) => {
        displayFailMessage(localization(607));
        this.deletedNote(note.toJSON());
      }).catch((code) => {
        displayFailMessage(localization(code));
        this.setCode(code);
      });
    }
  }
  deletedNote(props) {
    return (dispatch) => {
      // browserHistory.replace({pathname: window.location.pathname});
      dispatch(props);
    }
  }
}

module.exports = alt.createActions(NoteActions);
