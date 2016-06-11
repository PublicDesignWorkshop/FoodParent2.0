var en = require('./localization-en.json');


var cl = en;

export function setCurrentLocalization(language: string) {
  if (language == "EN" || language == "en") {
    cl = en;
  }
}

export function localization(value: any) {
  if (value.toString() == "0") return cl.e0;
  if (value.toString() == "90") return cl.e90;
  if (value.toString() == "91") return cl.e91;
  if (value.toString() == "92") return cl.e92;
  if (value.toString() == "93") return cl.e93;


  if (value.toString() == "602") return cl.e602;
  if (value.toString() == "603") return cl.e603;
  if (value.toString() == "604") return cl.e604;
  if (value.toString() == "605") return cl.e605;
  if (value.toString() == "606") return cl.e606;
  if (value.toString() == "607") return cl.e607;

  if (value.toString() == "634") return cl.e634;
  if (value.toString() == "635") return cl.e635;
  if (value.toString() == "636") return cl.e636;
  if (value.toString() == "637") return cl.e637;
  if (value.toString() == "638") return cl.e638;
  if (value.toString() == "639") return cl.e639;

  if (value.toString() == "664") return cl.e664;
  if (value.toString() == "665") return cl.e665;
  if (value.toString() == "666") return cl.e666;
  if (value.toString() == "667") return cl.e667;

  if (value.toString() == "706") return cl.e706;

  if (value.toString() == "900") return cl.e900;
  if (value.toString() == "901") return cl.e901;
  if (value.toString() == "902") return cl.e902;
  if (value.toString() == "903") return cl.e903;
  if (value.toString() == "904") return cl.e904;
  if (value.toString() == "905") return cl.e905;
  if (value.toString() == "906") return cl.e906;


  if (value.toString() == "42S22") return cl.e42S22;



  return "";
}
