import { alt } from './../alt';
import * as Alt from 'alt';
import { browserHistory } from 'react-router';
import { AbstractActions } from "./abstract.actions";

var Settings = require('./../constraints/settings.json');
import { DonateModel, IDonateProps, IDonateSourceProps, IDonateSourcesProps } from './../stores/donate.store';
import { TreeModel } from './../stores/tree.store';
import { addLoading, removeLoading } from './../utils/loadingtracker';
import { donateSource } from './../sources/donate.source';
import { displaySuccessMessage, displayErrorMessage } from './../utils/message';
import { localization } from './../constraints/localization';

interface IDonateActions {
  createDonate(person: DonateModel);
  createdDonate(props: IDonateProps);
  updateDonate(person: DonateModel);
  updatedDonate(props: IDonateProps);
  resetTempDonate();
  fetchDonatesFromLocationIds(locationIds: Array<number>);
  fetchedDonates(donatesProps: Array<IDonateProps>);
  deleteDonate(donate: DonateModel);
  deletedDonate(props: IDonateProps);
  setCode(code: number);
  setTempDonateSource(trees: Array<number>);
  addTempDonateSource(tree: number);
  setDonateSource(id: number, trees: Array<number>): IDonateSourcesProps;
  addDonateSource(id: number, tree: number): IDonateSourceProps;
}

class DonateActions extends AbstractActions implements IDonateActions {
  updateDonate(donate: DonateModel) {
    let self: DonateActions = this;
    return (dispatch) => {
      addLoading();
      dispatch();
      self.setCode(92);
      donateSource.updateDonate(donate).then((response) => {
        displaySuccessMessage(localization(604));
        self.updatedDonate(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  updatedDonate(props: IDonateProps) {
    return (dispatch) => {
      dispatch(props);
    }
  }
  createDonate(donate: DonateModel) {
    let self: DonateActions = this;
    return (dispatch) => {
      addLoading();
      dispatch();
      self.setCode(93);
      donateSource.createDonate(donate).then((response) => {
        displaySuccessMessage(localization(605));
        self.createdDonate(response);
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  createdDonate(props: IDonateProps) {
    return (dispatch) => {
      browserHistory.push({pathname: window.location.pathname, query: { donate: props.id }});
      dispatch(props);
    }
  }
  resetTempDonate() {
    return (dispatch) => {
      dispatch();
    }
  }
  fetchDonatesFromLocationIds(locationIds: Array<number>) {
    let self: DonateActions = this;
    if (locationIds != null && locationIds.length > 0) {
      return (dispatch) => {
        addLoading();
        dispatch();
        self.setCode(90);
        donateSource.fetchDonatesFromLocationIds(locationIds).then((response) => {
          self.fetchedDonates(response);
          removeLoading();
        }).catch((code) => {
          displayErrorMessage(localization(code));
          self.setCode(code);
          removeLoading();
        });
      }
    }
    return null;
  }
  fetchedDonates(donatesProps: Array<IDonateProps>) {
    let self: DonateActions = this;
    return (dispatch) => {
      dispatch(donatesProps);
    }
  }
  deleteDonate(donate: DonateModel) {
    let self: DonateActions = this;
    return (dispatch) => {
      addLoading();
      dispatch();
      self.setCode(91);
      donateSource.deleteDonate(donate).then((response) => {
        displayErrorMessage(localization(607));
        self.deletedDonate(donate.toJSON());
        removeLoading();
      }).catch((code) => {
        displayErrorMessage(localization(code));
        self.setCode(code);
        removeLoading();
      });
    }
  }
  deletedDonate(props: IDonateProps) {
    let self: DonateActions = this;
    return (dispatch) => {
      browserHistory.replace({pathname: window.location.pathname});
      dispatch(props);
    }
  }
  setCode(code: number) {
    let self: DonateActions = this;
    return (dispatch) => {
      dispatch(code);
    }
  }
  setTempDonateSource(trees: Array<number>) {
    let self: DonateActions = this;
    return (dispatch) => {
      dispatch(trees);
    }
  }
  addTempDonateSource(tree: number) {
    let self: DonateActions = this;
    return tree;
  }
  setDonateSource(id: number, trees: Array<number>): IDonateSourcesProps {
    let self: DonateActions = this;
    return {id: id, trees: trees};
  }
  addDonateSource(id: number, tree: number): IDonateSourceProps {
    let self: DonateActions = this;
    return {id: id, tree: tree};
  }
}

export const donateActions = alt.createActions<IDonateActions>(DonateActions);
