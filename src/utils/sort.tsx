import * as $ from 'jquery';

var Settings = require('./../constraints/settings.json');
import * as moment from 'moment';
import {NoteModel} from './../stores/note.store';

export function sortNoteByDateDESC(a: NoteModel, b: NoteModel): number {
  if (a.getDate().valueOf() > b.getDate().valueOf()) {
    return -1;
  } else if (a.getDate().valueOf() < b.getDate().valueOf()) {
    return 1;
  } else {
    return 0;
  }
}
