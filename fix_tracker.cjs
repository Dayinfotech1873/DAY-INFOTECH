const fs = require('fs');
let code = fs.readFileSync('src/components/ApplicationTracker.tsx', 'utf8');

// I'll use regex to fix the syntax error.
code = code.replace(/\{\s*\{/, '{'); 
// wait, the previous code was:
/*
  {
    type: 'MANAV_KALYAN',
    ...
  },
  {
    {
    type: 'NEW_BIRTH_CERTIFICATE',
    ...
  },
  {
    ...
  },
  {
    type: 'KUVAR_BAI_MAMERU',
*/
// It's probably easier to just overwrite the whole file or fetch the snippet to see.
