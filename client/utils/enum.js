import Enum from "es6-enum"

export const MAPTILE = Enum("FLAT", "SATELLITE");
export const MAPTYPE = Enum("TREE", "DONATION");

export const MESSAGETYPE = Enum("SUCCESS", "FAIL", "NORMAL");
export const TREEDETAILMODE = Enum("INFO", "POST", "PARENT", "HISTORY", "ALL");
