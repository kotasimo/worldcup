const countryToCode: Record<string, string> = {
  algeria: "DZ",
  argentina: "AR",
  australia: "AU",
  austria: "AT",
  belgium: "BE",
  "bosnia-herzegovina": "BA",
  "bosnia and herzegovina": "BA",
  bolivia: "BO",
  brazil: "BR",
  cameroon: "CM",
  canada: "CA",
  "cape verde islands": "CV",
  "cape verde": "CV",
  chile: "CL",
  colombia: "CO",
  "congo dr": "CD",
  "costa rica": "CR",
  croatia: "HR",
  "curaçao": "CW",
  curacao: "CW",
  czechia: "CZ",
  denmark: "DK",
  ecuador: "EC",
  egypt: "EG",
  england: "GB-ENG",
  france: "FR",
  germany: "DE",
  ghana: "GH",
  haiti: "HT",
  honduras: "HN",
  iran: "IR",
  iraq: "IQ",
  "ivory coast": "CI",
  jamaica: "JM",
  japan: "JP",
  jordan: "JO",
  mali: "ML",
  mexico: "MX",
  morocco: "MA",
  netherlands: "NL",
  "new zealand": "NZ",
  norway: "NO",
  panama: "PA",
  paraguay: "PY",
  peru: "PE",
  poland: "PL",
  portugal: "PT",
  qatar: "QA",
  "saudi arabia": "SA",
  scotland: "GB-SCT",
  senegal: "SN",
  serbia: "RS",
  "south africa": "ZA",
  "south korea": "KR",
  spain: "ES",
  sweden: "SE",
  switzerland: "CH",
  tunisia: "TN",
  turkey: "TR",
  "united states": "US",
  uruguay: "UY",
  uzbekistan: "UZ",
};

const tlaToCode: Record<string, string> = {
  ALG: "DZ",
  ARG: "AR",
  AUS: "AU",
  AUT: "AT",
  BEL: "BE",
  BIH: "BA",
  BOL: "BO",
  BRA: "BR",
  CAM: "CM",
  CAN: "CA",
  CHI: "CL",
  CIV: "CI",
  COD: "CD",
  COL: "CO",
  CPV: "CV",
  CRC: "CR",
  CRO: "HR",
  CUW: "CW",
  CZE: "CZ",
  DEN: "DK",
  ECU: "EC",
  EGY: "EG",
  ENG: "GB-ENG",
  ESP: "ES",
  FRA: "FR",
  GER: "DE",
  GHA: "GH",
  HAI: "HT",
  HON: "HN",
  IRN: "IR",
  IRQ: "IQ",
  JAM: "JM",
  JOR: "JO",
  JPN: "JP",
  KOR: "KR",
  KSA: "SA",
  MAR: "MA",
  MEX: "MX",
  MLI: "ML",
  NED: "NL",
  NOR: "NO",
  NZL: "NZ",
  PAN: "PA",
  PAR: "PY",
  PER: "PE",
  POL: "PL",
  POR: "PT",
  QAT: "QA",
  SCO: "GB-SCT",
  SEN: "SN",
  SRB: "RS",
  SUI: "CH",
  SWE: "SE",
  TUN: "TN",
  TUR: "TR",
  URU: "UY",
  USA: "US",
  UZB: "UZ",
};

export function getFlagCode(name: string, tla?: string) {
  return (tla ? tlaToCode[tla.toUpperCase()] : undefined) ?? countryToCode[normalize(name)];
}

export function getFlagEmoji(name: string, tla?: string) {
  const code = getFlagCode(name, tla);

  if (!code) {
    return "🏳️";
  }

  if (code.includes("-")) {
    return "🏴";
  }

  return code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
    .map((point) => String.fromCodePoint(point))
    .join("");
}

function normalize(value: string) {
  return value.toLowerCase().replace(/^the\s+/, "").trim();
}
