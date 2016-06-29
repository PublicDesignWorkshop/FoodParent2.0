var en = require('./localization-en.json');
var ko = require('./localization-ko.json');

var cl = en;

export function setCurrentLocalization(language: string) {
  if (language == "KO" || language == "ko") {
    cl = ko;
  }
  // if (language == "EN" || language == "en" || language == "en-US") {
  //   cl = en;
  // }
}

export function localization(value: any) {
  if (value.toString() == "0") return cl.e0;
  if (value.toString() == "90") return cl.e90;
  if (value.toString() == "91") return cl.e91;
  if (value.toString() == "92") return cl.e92;
  if (value.toString() == "93") return cl.e93;

  if (value.toString() == "404") return cl.e404;

  if (value.toString() == "601") return cl.e601;
  if (value.toString() == "602") return cl.e602;
  if (value.toString() == "603") return cl.e603;
  if (value.toString() == "604") return cl.e604;
  if (value.toString() == "605") return cl.e605;
  if (value.toString() == "606") return cl.e606;
  if (value.toString() == "607") return cl.e607;
  if (value.toString() == "608") return cl.e608;
  if (value.toString() == "609") return cl.e609;
  if (value.toString() == "610") return cl.e610;
  if (value.toString() == "611") return cl.e611;
  if (value.toString() == "612") return cl.e612;
  if (value.toString() == "613") return cl.e613;

  if (value.toString() == "624") return cl.e624;
  if (value.toString() == "625") return cl.e625;
  if (value.toString() == "626") return cl.e626;
  if (value.toString() == "627") return cl.e627;
  if (value.toString() == "628") return cl.e628;
  if (value.toString() == "629") return cl.e629;
  if (value.toString() == "630") return cl.e630;
  if (value.toString() == "631") return cl.e631;
  if (value.toString() == "632") return cl.e632;

  if (value.toString() == "633") return cl.e633;
  if (value.toString() == "634") return cl.e634;
  if (value.toString() == "635") return cl.e635;
  if (value.toString() == "636") return cl.e636;
  if (value.toString() == "637") return cl.e637;
  if (value.toString() == "638") return cl.e638;
  if (value.toString() == "639") return cl.e639;

  if (value.toString() == "640") return cl.e640;
  if (value.toString() == "641") return cl.e641;
  if (value.toString() == "642") return cl.e642;
  if (value.toString() == "643") return cl.e643;

  if (value.toString() == "662") return cl.e662;
  if (value.toString() == "663") return cl.e663;
  if (value.toString() == "664") return cl.e664;
  if (value.toString() == "665") return cl.e665;
  if (value.toString() == "666") return cl.e666;
  if (value.toString() == "667") return cl.e667;
  if (value.toString() == "668") return cl.e668;
  if (value.toString() == "669") return cl.e669;
  if (value.toString() == "670") return cl.e670;
  if (value.toString() == "671") return cl.e671;
  if (value.toString() == "672") return cl.e672;
  if (value.toString() == "673") return cl.e673;
  if (value.toString() == "674") return cl.e674;

  if (value.toString() == "675") return cl.e675;

  if (value.toString() == "676") return cl.e676;
  if (value.toString() == "677") return cl.e677;
  if (value.toString() == "678") return cl.e678;
  if (value.toString() == "679") return cl.e679;
  if (value.toString() == "680") return cl.e680;
  if (value.toString() == "681") return cl.e681;
  if (value.toString() == "682") return cl.e682;
  if (value.toString() == "683") return cl.e683;
  if (value.toString() == "684") return cl.e684;
  if (value.toString() == "685") return cl.e685;
  if (value.toString() == "686") return cl.e686;
  if (value.toString() == "687") return cl.e687;
  if (value.toString() == "688") return cl.e688;
  if (value.toString() == "689") return cl.e689;
  if (value.toString() == "690") return cl.e690;
  if (value.toString() == "691") return cl.e691;
  if (value.toString() == "692") return cl.e692;
  if (value.toString() == "693") return cl.e693;

  if (value.toString() == "706") return cl.e706;

  if (value.toString() == "730") return cl.e730;

  if (value.toString() == "900") return cl.e900;
  if (value.toString() == "901") return cl.e901;
  if (value.toString() == "902") return cl.e902;
  if (value.toString() == "903") return cl.e903;
  if (value.toString() == "904") return cl.e904;
  if (value.toString() == "905") return cl.e905;
  if (value.toString() == "906") return cl.e906;

  if (value.toString() == "929") return cl.e929;
  if (value.toString() == "930") return cl.e930;
  if (value.toString() == "931") return cl.e931;
  if (value.toString() == "932") return cl.e932;
  if (value.toString() == "933") return cl.e933;
  if (value.toString() == "934") return cl.e934;
  if (value.toString() == "935") return cl.e935;

  if (value.toString() == "936") return cl.e936;
  if (value.toString() == "937") return cl.e937;
  if (value.toString() == "938") return cl.e938;
  if (value.toString() == "939") return cl.e939;
  if (value.toString() == "940") return cl.e940;
  if (value.toString() == "941") return cl.e941;

  if (value.toString() == "960") return cl.e960;
  if (value.toString() == "961") return cl.e961;
  if (value.toString() == "962") return cl.e962;
  if (value.toString() == "963") return cl.e963;
  if (value.toString() == "964") return cl.e964;
  if (value.toString() == "965") return cl.e965;
  if (value.toString() == "966") return cl.e966;
  if (value.toString() == "967") return cl.e967;
  if (value.toString() == "968") return cl.e968;
  if (value.toString() == "969") return cl.e969;
  if (value.toString() == "970") return cl.e970;
  if (value.toString() == "971") return cl.e971;
  if (value.toString() == "972") return cl.e972;
  if (value.toString() == "973") return cl.e973;
  if (value.toString() == "974") return cl.e974;
  if (value.toString() == "975") return cl.e975;
  if (value.toString() == "976") return cl.e976;
  if (value.toString() == "977") return cl.e977;
  if (value.toString() == "978") return cl.e978;
  if (value.toString() == "979") return cl.e979;
  if (value.toString() == "980") return cl.e980;

  if (value.toString() == "981") return cl.e981;
  if (value.toString() == "982") return cl.e982;
  if (value.toString() == "983") return cl.e983;
  if (value.toString() == "984") return cl.e984;
  if (value.toString() == "985") return cl.e985;
  if (value.toString() == "986") return cl.e986;
  if (value.toString() == "987") return cl.e987;

  if (value.toString() == "988") return cl.e988;
  if (value.toString() == "989") return cl.e989;
  if (value.toString() == "990") return cl.e990;
  if (value.toString() == "991") return cl.e991;
  if (value.toString() == "992") return cl.e992;

  if (value.toString() == "993") return cl.e993;
  if (value.toString() == "994") return cl.e994;

  if (value.toString() == "995") return cl.e995;
  if (value.toString() == "996") return cl.e996;
  if (value.toString() == "997") return cl.e997;
  if (value.toString() == "998") return cl.e998;
  if (value.toString() == "999") return cl.e999;


  if (value.toString() == "42S22") return cl.e42S22;



  return "";
}
