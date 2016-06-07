var en = require('./localization-en.json');


var cl = en;

export function setCurrentLocalization(language: string) {
  if (language == "EN" || language == "en") {
    cl = en;
  }
}

export function localization(value: string) {
  if (value == "602") return cl.e602;
  if (value == "603") return cl.e603;
}
