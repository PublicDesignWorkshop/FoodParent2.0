import Enum from "es6-enum"

export const MAPTILE = Enum("FLAT", "SATELLITE");
export const MAPTYPE = Enum("TREE", "DONATION");

export const MESSAGETYPE = Enum("SUCCESS", "FAIL", "NORMAL");
export const TREEDETAILMODE = Enum("INFO", "POST", "PARENT", "HISTORY", "ALL");
export const DONATIONDETAILMODE = Enum("INFO", "POST", "HISTORY");
export const TREEADDMODE = Enum("MARKER", "INFO");
export const DONATIONADDMODE = Enum("MARKER", "INFO");


export const AUTHTYPE = Enum("ADMIN", "MANAGER", "PARENT", "GUEST");
export const LOGINMODE = Enum("PARENT", "MANAGER");

export const FITERMODE = Enum("FOOD", "DEAD", "OWNERSHIP", "ADOPT", "RATE");
export const AMOUNTTYPE = Enum("LBS", "KG", "G");
export const NOTETYPE = Enum("CHANGE", "UPDATE", "PICKUP", "DONATE");
export const PICKUPTIME = Enum("EARLY", "PROPER", "LATE");
