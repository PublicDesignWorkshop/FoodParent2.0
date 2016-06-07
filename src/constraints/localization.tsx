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


  if (value.toString() == "42S22") return cl.e42S22;



  return "";
}
