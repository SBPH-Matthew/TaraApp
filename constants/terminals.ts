export type Terminal = {
  id: string;
  name: string;
  /** Compact label for the header (falls back to name if omitted) */
  shortName: string;
  code: string;
  city: string;
};

export const terminals: Terminal[] = [
  { id: "mnl-t3", name: "NAIA Terminal 3", shortName: "NAIA Terminal 3", code: "MNL", city: "Manila" },
  { id: "mnl-t1", name: "NAIA Terminal 1", shortName: "NAIA Terminal 1", code: "MNL", city: "Manila" },
  { id: "mnl-t2", name: "NAIA Terminal 2", shortName: "NAIA Terminal 2", code: "MNL", city: "Manila" },
  { id: "ceb", name: "Mactan-Cebu International Airport", shortName: "Mactan-Cebu (CEB)", code: "CEB", city: "Cebu" },
  { id: "crk", name: "Clark International Airport", shortName: "Clark (CRK)", code: "CRK", city: "Clark" },
  { id: "dvo", name: "Francisco Bangoy International Airport", shortName: "Davao (DVO)", code: "DVO", city: "Davao" },
];

export const currencies = [
  { id: "php", label: "PHP (₱)" },
  { id: "usd", label: "USD ($)" },
] as const;

export const languages = [
  { id: "ph", flag: "🇵🇭", label: "English" },
  { id: "us", flag: "🇺🇸", label: "English" },
  { id: "ja", flag: "🇯🇵", label: "日本語" },
] as const;
