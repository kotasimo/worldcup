const countryToCode: Record<string, string> = {
  algeria: "DZ",
  argentina: "AR",
  australia: "AU",
  belgium: "BE",
  bolivia: "BO",
  brazil: "BR",
  cameroon: "CM",
  canada: "CA",
  chile: "CL",
  colombia: "CO",
  "costa rica": "CR",
  croatia: "HR",
  denmark: "DK",
  ecuador: "EC",
  egypt: "EG",
  england: "GB",
  france: "FR",
  germany: "DE",
  ghana: "GH",
  haiti: "HT",
  honduras: "HN",
  iran: "IR",
  iraq: "IQ",
  jamaica: "JM",
  japan: "JP",
  mali: "ML",
  mexico: "MX",
  morocco: "MA",
  netherlands: "NL",
  "new zealand": "NZ",
  norway: "NO",
  panama: "PA",
  peru: "PE",
  poland: "PL",
  portugal: "PT",
  qatar: "QA",
  "saudi arabia": "SA",
  scotland: "GB",
  senegal: "SN",
  serbia: "RS",
  "south africa": "ZA",
  "south korea": "KR",
  spain: "ES",
  switzerland: "CH",
  tunisia: "TN",
  "united states": "US",
  uruguay: "UY",
  uzbekistan: "UZ",
};

const tlaToCode: Record<string, string> = {
  ALG: "DZ",
  ARG: "AR",
  AUS: "AU",
  BEL: "BE",
  BOL: "BO",
  BRA: "BR",
  CAM: "CM",
  CAN: "CA",
  CHI: "CL",
  COL: "CO",
  CRC: "CR",
  CRO: "HR",
  DEN: "DK",
  ECU: "EC",
  EGY: "EG",
  ENG: "GB",
  ESP: "ES",
  FRA: "FR",
  GER: "DE",
  GHA: "GH",
  HAI: "HT",
  HON: "HN",
  IRN: "IR",
  IRQ: "IQ",
  JAM: "JM",
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
  PER: "PE",
  POL: "PL",
  POR: "PT",
  QAT: "QA",
  SCO: "GB",
  SEN: "SN",
  SRB: "RS",
  SUI: "CH",
  TUN: "TN",
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
