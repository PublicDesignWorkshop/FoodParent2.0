export enum TileMode {
  GRAY, SATELLITE
}
export enum TreesMode {
  NONE, TREES, TREEDETAIL, TREEDELETE, TREEADDMARKER, TREEADDINFO, TREEADDSAVE, TREESFILTER, TREENOTEEDIT, TREENOTEDELETE, TREEGRAPH, NOTIFY
}
export enum DonationsMode {
  NONE, DONATIONS, LOCATIONDETAIL, LOCATIONADDMARKER, LOCATIONADDINFO, LOCATIONDELETE, DONATIONNOTEEDIT, DONATIONNOTEDELETE, DONATIONGRAPH
}
export enum PickupTime {
  NONE, EARLY, PROPER, LATE
}
export enum NoteType {
  NONE, CHANGE, POST, PICKUP
}
export enum AmountType {
  NONE, G, KG, LBS
}
export interface ISelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}
export enum NavSearchMode {
  NONE, TREES, DONATIONS
}
export interface IGraphOption {
  x: Date;
  y: number;
  r: number;
  amount?: number;
  year?: number;
  tooltip: any;
}
export enum MessageLineType {
  NONE, ERROR, SUCCESS, WAITING
}
