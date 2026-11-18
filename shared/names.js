/* Invented demo names. The repo is public and the prototype is used for marketing, so no real name from the CLTDEMO
   demo data is ever stored here. scripts/make-whistler-data.py replaces people (matched by name fingerprint), the company
   and the made-up station names BEFORE writing shared/whistler-data.js. Real public geography (Whistler BC, Alpine Meadows,
   Nesters, Pine Ridge, Sea-to-Sky) stays, because the map shows the real valley.
   scripts/check.mjs fails if a real demo person's name appears in any file of the repo. */
const COMPANY = { name: 'Alder Ridge Energy', short: 'Alder Ridge' };
// Every person the prototype may show. Add invented people here (and to PEOPLE in whistler-command.js).
const INVENTED_PEOPLE = ['Hollis Grant', 'Mara Delgado', 'Owen Fitch', 'Ravi Banerjee', 'Kenji Mori', 'Theo Marsh', 'Priyanka Iyer',
  'Luca Ferri', 'Noah Lindgren', 'Tara Quinn'];
