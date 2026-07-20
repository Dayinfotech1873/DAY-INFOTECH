const fs = require('fs');
let code = fs.readFileSync('src/components/ApplicationTracker.tsx', 'utf8');

const newItems = `
  {
    type: 'NEW_BIRTH_CERTIFICATE',
    labelGu: 'નવું જન્મ પ્રમાણપત્ર',
    labelEn: 'New Birth Certificate',
    icon: FileText,
    colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
    bgClass: 'bg-indigo-600 hover:bg-indigo-700'
  },
  {
    type: 'BIRTH_CERTIFICATE_CORRECTION',
    labelGu: 'જન્મ પ્રમાણપત્ર સુધારો',
    labelEn: 'Birth Certificate Correction',
    icon: FileText,
    colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100',
    bgClass: 'bg-indigo-600 hover:bg-indigo-700'
  },
  {
    type: 'DEATH_CERTIFICATE',
    labelGu: 'મરણ પ્રમાણપત્ર',
    labelEn: 'Death Certificate',
    icon: FileText,
    colorClass: 'text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100',
    bgClass: 'bg-rose-600 hover:bg-rose-700'
  },
`;

code = code.replace("type: 'KUVAR_BAI_MAMERU'", newItems.trim() + ",\n  {\n    type: 'KUVAR_BAI_MAMERU'");

fs.writeFileSync('src/components/ApplicationTracker.tsx', code);
