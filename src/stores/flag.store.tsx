import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';

var Settings = require('./../constraints/settings.json');
import { flagActions } from './../actions/flag.actions';
import { AbstractStore } from './../stores/abstract.store';
import { treeStore } from './../stores/tree.store';

export interface IFlagProps {
  id: string;
  name: string;
}

export class FlagModel {
  id: number;
  name: string;

  constructor(props: IFlagProps) {
    let self: FlagModel = this;
    self.id = parseInt(props.id);
    self.name = props.name;
  }
  private toJSON(): any {
    let self: FlagModel = this;
    return {
      id: self.id,
      name: self.name,
    }
  }
  public getId(): number {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
}

export interface FlagState {
  flags: Array<FlagModel>;
  errorMessage: string;
}

interface FlagExtendedStore extends AltJS.AltStore<FlagState> {
  getFlag(id: number): FlagModel;
}

class FlagStore extends AbstractStore<FlagState> {
  private flags: Array<FlagModel>;
  private errorMessage: string
  constructor() {
    super();
    let self: FlagStore = this;
    self.flags = new Array<FlagModel>();
    self.errorMessage = null;
    //TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleUpdateFlags: flagActions.updateFlags,
    });
    self.exportPublicMethods({
      getFlag: self.getFlag
    });
  }
  handleUpdateFlags(flagsProps: Array<IFlagProps>) {
    let self: FlagStore = this;
    self.flags = new Array<FlagModel>();
    flagsProps.forEach((props: IFlagProps) => {
      self.flags.push(new FlagModel(props));
    });
    self.errorMessage = null;
  }
  handleFailed(code: number) {
    let self: FlagStore = this;
    // this.errorMessage = errorMessage;
  }
  getFlag(id: number): FlagModel {
    let self: FlagStore = this;
    let flags = self.getState().flags;
    for(var i = 0; i < flags.length; i++) {
      if(flags[i].id === id) {
        return flags[i];
      }
    }
    return null;
  }
}

export const flagStore: FlagExtendedStore = alt.createStore<FlagState>(FlagStore) as FlagExtendedStore;
