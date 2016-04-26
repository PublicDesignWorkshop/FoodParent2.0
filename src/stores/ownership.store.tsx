import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';

import { ownershipActions } from './../actions/ownership.actions';
import { AbstractStore } from './../stores/abstract.store';
import { ownershipSource } from './../sources/ownership.source';
import { treeStore } from './../stores/tree.store';

export interface IOwnershipProps {
  id: string;
  name: string;
}

export class OwnershipModel {
  id: number;
  name: string;

  constructor(props: IOwnershipProps) {
    let self: OwnershipModel = this;
    self.id = parseInt(props.id);
    self.name = props.name;
  }
  private toJSON(): any {
    let self: OwnershipModel = this;
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

export interface OwnershipState {
  ownerships: Array<OwnershipModel>;
  errorMessage: string;
}

interface OwnershipExtendedStore extends AltJS.AltStore<OwnershipState> {
  getOwnership(id: number): OwnershipModel;
  fetchOwnerships(): void;
  isLoading(): boolean;
}

class OwnershipStore extends AbstractStore<OwnershipState> {
  private ownerships: Array<OwnershipModel>;
  private errorMessage: string
  constructor() {
    super();
    let self: OwnershipStore = this;
    self.ownerships = new Array<OwnershipModel>();
    self.errorMessage = null;
    //TODO: pass state generics to make sure methods/actions expect the same type
    self.bindListeners({
      handleFetchOwnerships: ownershipActions.fetchOwnerships,
      handleFailed: ownershipActions.failed
    });
    self.exportPublicMethods({
      getOwnership: self.getOwnership
    });
    self.exportAsync(ownershipSource);
  }
  handleFetchOwnerships(ownershipsProps: Array<IOwnershipProps>) {
    let self: OwnershipStore = this;
    console.warn("Handle Fetch Ownerships");
    self.ownerships = new Array<OwnershipModel>();
    ownershipsProps.forEach((props: IOwnershipProps) => {
      self.ownerships.push(new OwnershipModel(props));
    });
    self.errorMessage = null;
  }
  handleFailed(errorMessage: string) {
    console.warn("Handle Ownership Failed");
    this.errorMessage = errorMessage;
  }
  getOwnership(id: number): OwnershipModel {
    let self: OwnershipStore = this;
    let ownerships = self.getState().ownerships;
    for(var i = 0; i < ownerships.length; i++) {
      if(ownerships[i].id === id) {
        return ownerships[i];
      }
    }
    return null;
  }
}

export const ownershipStore: OwnershipExtendedStore = alt.createStore<OwnershipState>(OwnershipStore) as OwnershipExtendedStore;
