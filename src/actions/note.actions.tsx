import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { NoteModel, INoteProps } from './../stores/note.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { noteSource } from './../sources/note.source';
import { displaySuccessMessage, displayErrorMessage } from './../utils/message';

interface INoteActions {
  createNote(person: NoteModel, success: string, error: string);
  createdNote(props: INoteProps);
  updateNote(person: NoteModel, success: string, error: string);
  updatedNote(props: INoteProps);
  resetTempNote();
  fetchNotesFromTreeIds(treeIds: Array<number>);
  fetchedNotes(notesProps: Array<INoteProps>);
  deleteNote(note: NoteModel, success: string, error: string);
  deletedNote(props: INoteProps);
  failed(code: number);
}

class NoteActions extends AbstractActions implements INoteActions {
  updateNote(note: NoteModel, success: string, error: string) {
    let self: NoteActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      noteSource.updateNote(note).then((response) => {
        removeLoading();
        displaySuccessMessage(success);
        self.updatedNote(response);
      }).catch((code) => {
        removeLoading();
        displayErrorMessage(error);
        self.failed(parseInt(code));
      });
    }
  }
  updatedNote(props: INoteProps) {
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(props);
    }
  }
  createNote(note: NoteModel, success: string, error: string) {
    let self: NoteActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      noteSource.createNote(note).then((response) => {
        removeLoading();
        displaySuccessMessage(success);
        self.createdNote(response);
      }).catch((code) => {
        removeLoading();
        displayErrorMessage(error);
        self.failed(parseInt(code));
      });
    }
  }
  createdNote(props: INoteProps) {
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(props);
    }
  }


  resetTempNote() {
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch();
    }
  }
  fetchNotesFromTreeIds(treeIds: Array<number>) {
    let self: NoteActions = this;
    if (treeIds != null && treeIds.length > 0) {
      return (dispatch) => {
        // we dispatch an event here so we can have "loading" state.
        addLoading();
        dispatch();
        noteSource.fetchNotesFromTreeIds(treeIds).then((response) => {
          removeLoading();
          self.fetchedNotes(response);
        }).catch((code) => {
          removeLoading();
          self.failed(parseInt(code));
        });
      }
    }
    return null;
  }

  fetchedNotes(notesProps: Array<INoteProps>) {
    let self: NoteActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(notesProps);
    }
  }
  deleteNote(note: NoteModel, success: string, error: string) {
    let self: NoteActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      addLoading();
      dispatch();
      noteSource.deleteNote(note).then((response) => {
        removeLoading();
        displaySuccessMessage(success);
        self.deletedNote(note.toJSON());
      }).catch((code) => {
        removeLoading();
        displayErrorMessage(error);
        self.failed(parseInt(code));
      });
    }
  }
  deletedNote(props: INoteProps) {
    let self: NoteActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(props);
    }
  }
  failed(code: number) {
    let self: NoteActions = this;
    return (dispatch) => {
      // we dispatch an event here so we can have "loading" state.
      dispatch(code);
    }
  }
}

export const noteActions = alt.createActions<INoteActions>(NoteActions);
