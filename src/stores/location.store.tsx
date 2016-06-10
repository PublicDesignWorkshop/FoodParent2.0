import { alt } from './../alt';
import * as Alt from 'alt';
import * as moment from 'moment';
import * as L from 'leaflet';
import { browserHistory } from 'react-router';
import * as _ from 'underscore';

var Settings = require('./../constraints/settings.json');
import { locationActions } from './../actions/location.actions';
import { AbstractStore } from './../stores/abstract.store';

export interface ILocationProps {
  id: string;
  name: string;
  lat: string;
  lng: string;
  description: string;
  address: string;
  updated: string;
}

export class LocationModel {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
  address: string;
  updated: moment.Moment;

  constructor(props: ILocationProps) {
    let self: LocationModel = this;
    self.update(props);
  }
  public update(props: ILocationProps) {
    let self: LocationModel = this;
    self.id = parseInt(props.id);
    self.name = props.name;
    self.lat = parseFloat(parseFloat(props.lat).toFixed(Settings.iMarkerPrecision));
    self.lng = parseFloat(parseFloat(props.lng).toFixed(Settings.iMarkerPrecision));
    self.description = props.description;
    self.address = props.address;
    self.updated = moment(props.updated);
  }
  public toJSON(): any {
    let self: LocationModel = this;
    return {
      id: self.id,
      name: self.name,
      lat: self.lat,
      lng: self.lng,
      description: self.description,
      address: self.address,
    }
  }
  public getId(): number {
    return this.id
  }
  public getLat(): number {
    return this.lat;
  }
  public getLng(): number {
    return this.lng;
  }
  public setLat(lat: number): void {
    this.lat = lat;
  }
  public setLng(lng: number): void {
    this.lng = lng;
  }
  public getLocation(): L.LatLng {
    return new L.LatLng(this.getLat(), this.getLng());
  }
  public getName(): string {
    return this.name;
  }
  public setName(name: string) {
    this.name = name;
  }
  public getAddress(): string {
    return this.address;
  }
  public setAddress(address: string): void {
    this.address = address;
  }
  public getDescription(): string {
    return this.description;
  }
  public setDescription(description: string): void {
    this.description = description;
  }
}

export interface LocationState {
  temp: LocationModel;
  locations: Array<LocationModel>;
  code: any;
}

interface LocationExtendedStore extends AltJS.AltStore<LocationState> {
  getLocation(id: number): LocationModel;
  // addTree(tree: TreeModel): void;
  // updateTree(update: TreeModel): void;
  // createTree(create: TreeModel): void;
}

class LocationStore extends AbstractStore<LocationState> {
  private temp: LocationModel;
  private locations: Array<LocationModel>;
  private code: any;
  constructor() {
    super();
    let self: LocationStore = this;
    self.locations = new Array<LocationModel>();
    self.code = 200;
    self.bindListeners({
      handleResetTempLocation: locationActions.resetTempLocation,
      handleFetchedLocations: locationActions.fetchedLocations,
      handleUpdatedLocation: locationActions.updatedLocation,
      handleCreatedLocation: locationActions.createdLocation,
      handleRefresh: locationActions.refresh,
      handleDeletedLocation: locationActions.deletedLocation,
      handleSetCode: locationActions.setCode,
    });
    self.exportPublicMethods({
      getLocation: self.getLocation,
    });
  }
  getLocation(id: number): LocationModel {
    let self: LocationStore = this;
    let locations = self.getState().locations.filter(location => location.getId() == id);
    if (locations.length == 1) {
      return locations[0];
    }
    return null;
  }
  handleFetchedLocations(locationsProps: Array<ILocationProps>) {
    let self: LocationStore = this;
    self.locations = new Array<LocationModel>();
    locationsProps.forEach((props: ILocationProps) => {
      self.locations.push(new LocationModel(props));
    });
    self.code = 200;
  }
  handleUpdatedLocation(locationProps: ILocationProps) {
    let self: LocationStore = this;
    let locations = self.locations.filter(location => location.getId() == parseInt(locationProps.id));
    if (locations.length == 1) {
      locations[0].update(locationProps);
    }
  }
  handleResetTempLocation() {
    let self: LocationStore = this;
    self.temp = new LocationModel({
      id: "0",
      name: "",
      lat: Settings.vPosition.x,
      lng: Settings.vPosition.y,
      description: "",
      address: "",
      updated: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.code = 200;
  }
  handleSetCode(code: number) {
    let self: LocationStore = this;
    self.code = code;
  }
  handleRefresh() {
    let self: LocationStore = this;
  }
  handleCreatedLocation(props: ILocationProps) {
    let self: LocationStore = this;
    self.locations.push(new LocationModel(props));
    self.temp = new LocationModel({
      id: "0",
      name: "",
      lat: Settings.vPosition.x,
      lng: Settings.vPosition.y,
      description: "",
      address: "",
      updated: moment(new Date()).format(Settings.sServerDateFormat),
    });
    self.code = 200;
  }
  handleDeletedLocation(props: ILocationProps) {
    let self: LocationStore = this;
    let i = -1;
    for(let j = 0; j < self.locations.length; j++) {
      if(self.locations[j].getId() === parseInt(props.id)) {
        i = j;
      }
    }
    if (i > -1) {
      self.locations.splice(i, 1);
    }
    self.code = 200;
  }
}

export const locationStore: LocationExtendedStore = alt.createStore<LocationState>(LocationStore) as LocationExtendedStore;
