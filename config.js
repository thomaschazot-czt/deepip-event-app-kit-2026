/* DeepIP Event App Kit — configuration for IP Service World 2026.
   Generated from the build brief (Notion, "Sales app build brief", 17 Nov 2026).
   See config.template.js for what every key means.

   Nothing in here is data: no contact names, no account names, no notes.
   The only people named are the DeepIP team in USERS (CLAUDE.md section 2).

   This repo is served public on GitHub Pages until writes freeze on 28 Nov
   (decided 17 Nov, open question 1 of the brief), then made private. This file
   must therefore never carry a Sheet ID, an export or anything read from the
   Sheet. */

/* ---- Backend ---------------------------------------------------------- */

// Filled at deployment (CLAUDE.md section 6, step 7). Remember: editing Code.gs
// is not deploying it. Manage deployments > pencil > New version > Deploy.
// Its own Apps Script project, bound to the IPSW 2026 lead list. Never the URL
// of another event: that would send this event's captures to another Sheet.
const APPS_SCRIPT_URL = "";

// Shared DeepIP client. Must be byte-identical to CLIENT_ID in Code.gs. Its
// authorised origins must include https://thomaschazot-czt.github.io.
const GOOGLE_CLIENT_ID = "810262336028-7a92202r99cp09pv0s8gf5g5idsrer3u.apps.googleusercontent.com";

/* ---- The event -------------------------------------------------------- */

const EVENT = {
  name: "IP Service World 2026",
  // Derives the IndexedDB name and the offline cache.
  slug: "ipsw-2026",
  // Bump on every deployment.
  shellVersion: 1,
  // Must equal timeZone in appsscript.json and the Sheet's File > Settings > Time zone.
  timezone: "Europe/Berlin",

  // No second list: the Sheet is the full delegate list (DIRECTORY_COLUMNS = {}).
  directoryLabel: "",
  engagementTrack: "",

  // From the brief. Narrow before wide: the first match wins. List on top in
  // every phase: the Sheet is the full delegate list. Flip rule (not a date): if
  // more than half of a day's captures are "Typed on site", the next day's home
  // becomes capture. Tool Check and the Lounge Room have no phase of their own.
  // The pre-evening time is unreadable on the event page: 17:00 assumed.
  phases: [
    { id: "evening",     label: "Evening reception",     from: "2026-11-23T18:30", to: "2026-11-24T03:00", home: "list", tonight: false },
    { id: "pre-evening", label: "Pre-evening reception", from: "2026-11-22T17:00", to: "2026-11-23T03:00", home: "list", tonight: false },
    { id: "day-1",       label: "Congress, day 1",       from: "2026-11-23T03:00", to: "2026-11-23T18:30", home: "list", tonight: false },
    { id: "day-2",       label: "Congress, day 2",       from: "2026-11-24T03:00", to: "2026-11-24T23:59", home: "list", tonight: false }
  ],

  // Last day + 4 (kit default, brief).
  freezeWritesFrom: "2026-11-28T00:00"
};

/* ---- Who is who ------------------------------------------------------- */
/*
  Everyone sees and writes every record. Nobody opens on a filtered list
  (hasList: false). "Assigned to me" matches Company Owner, for Michael,
  Frédéric and Andreas only. Nobody is a tutor.

  Owner-name traps: Company Owner holds another "Edouard" (not on the floor),
  so Edouard d'Archimbaud is matched on his surname only, never "edouard". Company
  Owner spells "Frederic Von Barczy" without accents; matching is accent-blind.
*/
const USERS = {
  "michael.schmidt@deepip.ai":     { name: "Michael",   fullName: "Michael Schmidt",      role: "Sales", hasList: false, isTutor: false, ownerNames: ["michael schmidt"] },
  "frederic.von-barczy@deepip.ai": { name: "Frédéric",  fullName: "Frédéric Von Bárczy",  role: "Sales", hasList: false, isTutor: false, ownerNames: ["barczy"] },
  "andreas.andersson@deepip.ai":   { name: "Andreas",   fullName: "Andreas Andersson",    role: "Sales", hasList: false, isTutor: false, ownerNames: ["andreas andersson"] },
  "celia.wei@deepip.ai":           { name: "Celia",     fullName: "Celia Wei",            role: "Sales", hasList: false, isTutor: false, ownerNames: [] },
  "matthias.hofmann@deepip.ai":    { name: "Matthias",  fullName: "Matthias Hofmann",     role: "Sales", hasList: false, isTutor: false, ownerNames: [] },
  "edouard.darchimbaud@deepip.ai": { name: "Edouard",   fullName: "Edouard d'Archimbaud", role: "Sales", hasList: false, isTutor: false, ownerNames: ["archimbaud"] }
};

// "Assigned to me" reads Company Owner (HubSpot). No Ownership column here.
const OWNER_KEYS = ["crmOwner"];

/* ---- Capture form ----------------------------------------------------- */
/*
  Core fields, write-tab headers: met -> `Met status`, temperature ->
  `Temperature`, toolToday -> `Tool today`, nextStep -> `Next step`, hook ->
  `Observation` (no Hook column on the write tab; VPP precedent).
*/
const CAPTURE_OPTIONS = {
  met:         ["Yes", "No", "Not seen"],
  temperature: ["Hot", "Warm", "Cold", "Not a fit"],
  toolToday:   ["Nothing", "Built in-house", "Other", "Unknown"], // + COMPETITORS below
  nextStep:    ["Demo", "Intro", "Send content", "Nothing"],
  observation: ["Engaged", "Asked a good question", "Already using a tool", "Stuck on something"]
};

/* Extra fields, confirmed 17 Nov. All optional. Each header is frozen and has
   its entry in ENCOUNTER_COLUMNS in Code.gs. */
const CAPTURE_EXTRA = [
  { key: "practitioners",   label: "How many patent practitioners?", header: "Number of Practitioners", type: "number" },
  { key: "technicalField",  label: "Technical field", header: "Technical field", type: "choice",
    options: ["Life sciences", "Chemistry", "Electrical / software", "Mechanical", "Mixed / unknown"] },
  { key: "draftingModel",   label: "Drafting model", header: "Drafting model", type: "choice",
    options: ["In-house only", "Outsourced", "Mixed"] },
  { key: "purchaseSignOff", label: "Who signs off a tool purchase?", header: "Tool purchase sign-off", type: "choice",
    options: ["Head of IP", "IT or procurement", "Partners", "Unknown"] },
  { key: "otherTools",      label: "Other tools in use", header: "Other tools", type: "text" },
  // Follow-up input: only when the person is not on the list.
  { key: "email",           label: "Email (if not in the list)", header: "Work Email", type: "text" }
];

// Names only.
const COMPETITORS = ["Ankar", "Solve", "Patlytics", "Questel", "Tradespace"];

/* ---- Follow-up -------------------------------------------------------- */
/*
  One opening line per moment, keyed on phase id (`Session / moment`).
  Generated on Wed 25 Nov by followup.html, run locally. It writes nothing.

  Signer: a patent attorney chosen by `Technical field`, account owner in Cc.
  The attorney names are still to come (brief, open question 5); until then
  every draft falls back to the person who had the conversation (`Met by`).
*/
const FOLLOW_UP = {
  sender: "technicalField",
  fallbackSender: "metBy",
  cc: "crmOwner",
  sendWithinHours: 72,
  signers: {
    // "Life sciences": "",
    // "Chemistry": "",
    // "Electrical / software": "",
    // "Mechanical": ""
  },
  moments: {
    "pre-evening": "It was a pleasure to meet you on the eve of IP Service World in Munich.",
    "day-1":       "Thank you for stopping by our booth at IP Service World in Munich.",
    "evening":     "It was a pleasure to talk at the IP Service World evening reception at the Augustiner Stammhaus.",
    "day-2":       "Thank you for stopping by our booth at IP Service World in Munich."
  }
};

/* ---- Contact card ----------------------------------------------------- */
const CARD_FIELDS = [
  { key: "crmOwner",         label: "Company owner" },
  { key: "sdr",              label: "Prospecting SDR" },
  { key: "accountStatus",    label: "Lifecycle stage" },
  { key: "priority",         label: "Tier" },
  { key: "targetAccount",    label: "Target account" },
  { key: "openOrWonDeal",    label: "Open or won deal" },
  { key: "organizationType", label: "Organization type" },
  { key: "country",          label: "Country" }
];

const LIST_FIELDS = [
  { key: "accountStatus" },
  { key: "targetAccount", flag: "Target account" },
  { key: "openOrWonDeal", flag: "Open or won deal" }
];

/* Chips. Tier 1/2/3 is read as priority (the engine takes the digit), so the
   P1/P2/P3 chips and the sort follow the Tiering column. TRUE matches "yes". */
const LIST_FILTERS = [
  "mine",
  "notmet",
  "p1",
  "p2",
  "p3",
  { id: "target", label: "Target account", key: "targetAccount", match: "yes" },
  { id: "deal",   label: "Open or won deal", key: "openOrWonDeal", match: "yes" },
  "customers",
  "multifirm"
];

/* ---- Sync and freshness ----------------------------------------------- */

const SYNC = {
  autoIntervalMs: 60000,
  requestTimeoutMs: 20000,
  snapshotStaleAfterMs: 15 * 60000,
  promptRefreshAfterMs: 30 * 60000
};

/* ---- Modules ---------------------------------------------------------- */
/* dinner off (decided 17 Nov), rsvp off (third-party event), follow-up on. */
const MODULES = {
  dinner: false,
  rsvp: false,
  followUp: true
};
