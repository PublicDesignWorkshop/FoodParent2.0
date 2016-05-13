import { alt } from './../alt';
import * as Alt from 'alt';
import { AbstractActions } from "./abstract.actions";
import { NoteModel } from './../stores/note.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';

interface INoteActions {
  fetchNotes(notes: Array<NoteModel>);
  updateNote(note: NoteModel): void;
  createNote(note: NoteModel): void;
  failed(errorMessage: any);
  loading(): void;
}

class NoteActions extends AbstractActions implements INoteActions {
  fetchNotes(notes: Array<NoteModel>) {
    let self: NoteActions = this;
    console.warn("Fetch Notes");
    removeLoading();
    return notes;
  }
  updateNote(note: NoteModel) {
    let self: NoteActions = this;
    console.warn("Update Note");
    removeLoading();
    return note;
    //return (dispatch) => {
    //  // we dispatch an event here so we can have "loading" state.
    //  dispatch({tree: tree, updatedTree: updatedTree});
    //}
  }
  createNote(note: NoteModel) {
    let self: NoteActions = this;
    console.warn("Create Note");
    removeLoading();
    return note;
    //return (dispatch) => {
    //  // we dispatch an event here so we can have "loading" state.
    //  dispatch({tree: tree, updatedTree: updatedTree});
    //}
  }
  failed(errorMessage:any) {
    let self: NoteActions = this;
    console.warn("Note Failed");
    removeLoading();
    return errorMessage;
  }
  loading() {
    let self: NoteActions = this;
    addLoading();
    return "e300";
    // return (dispatch) => {
    //   // we dispatch an event here so we can have "loading" state.
    //   dispatch();
    // }
  }
}

export const noteActions = alt.createActions<INoteActions>(NoteActions);
