const fs = require('fs');
let code = fs.readFileSync('src/components/FormRenderer.tsx', 'utf8');

// 1. Add imports from types.ts
code = code.replace(
  "KuvarBaiMameruDocs,",
  "KuvarBaiMameruDocs,\n  NewBirthCertificateDetails,\n  NewBirthCertificateDocs,\n  BirthCertificateCorrectionDetails,\n  BirthCertificateCorrectionDocs,\n  DeathCertificateDetails,\n  DeathCertificateDocs,"
);

// 2. Add initial variables from formDefaults.ts
code = code.replace(
  "initialKuvarDocs",
  "initialKuvarDocs,\n  initialNewBirthCertificateDetails,\n  initialNewBirthCertificateDocs,\n  initialBirthCertificateCorrectionDetails,\n  initialBirthCertificateCorrectionDocs,\n  initialDeathCertificateDetails,\n  initialDeathCertificateDocs"
);

// 3. Add to SERVICE_PRICES
code = code.replace(
  "OTHER_SERVICE: 0",
  "NEW_BIRTH_CERTIFICATE: 150,\n  BIRTH_CERTIFICATE_CORRECTION: 150,\n  DEATH_CERTIFICATE: 180,\n  OTHER_SERVICE: 0"
);

// 4. Update getServiceLabel
code = code.replace(
  "case 'OTHER_SERVICE': return 'OTHER SERVICES (અન્ય સેવાઓ)';",
  "case 'NEW_BIRTH_CERTIFICATE': return 'NEW BIRTH CERTIFICATE (નવું જન્મ પ્રમાણપત્ર)';\n      case 'BIRTH_CERTIFICATE_CORRECTION': return 'BIRTH CERTIFICATE CORRECTION (જન્મ પ્રમાણપત્ર સુધારો)';\n      case 'DEATH_CERTIFICATE': return 'DEATH CERTIFICATE (મરણ પ્રમાણપત્ર)';\n      case 'OTHER_SERVICE': return 'OTHER SERVICES (અન્ય સેવાઓ)';"
);

// 5. Add useStates
const newStates = `
  const [newBirthDetails, setNewBirthDetails] = useState<NewBirthCertificateDetails>({ ...initialNewBirthCertificateDetails });
  const [newBirthDocs, setNewBirthDocs] = useState<NewBirthCertificateDocs>({ ...initialNewBirthCertificateDocs });
  const [birthCorrectionDetails, setBirthCorrectionDetails] = useState<BirthCertificateCorrectionDetails>({ ...initialBirthCertificateCorrectionDetails });
  const [birthCorrectionDocs, setBirthCorrectionDocs] = useState<BirthCertificateCorrectionDocs>({ ...initialBirthCertificateCorrectionDocs });
  const [deathDetails, setDeathDetails] = useState<DeathCertificateDetails>({ ...initialDeathCertificateDetails });
  const [deathDocs, setDeathDocs] = useState<DeathCertificateDocs>({ ...initialDeathCertificateDocs });
`;
code = code.replace(
  "const [otherDetails, setOtherDetails] = useState<OtherServiceDetails>({ ...initialOtherDetails });",
  "const [otherDetails, setOtherDetails] = useState<OtherServiceDetails>({ ...initialOtherDetails });\n" + newStates
);

// 6. Load editing entry
const loadEditing = `
      } else if (editingEntry.formType === 'NEW_BIRTH_CERTIFICATE') {
        setNewBirthDetails(editingEntry.details as NewBirthCertificateDetails);
        setNewBirthDocs(editingEntry.documents as NewBirthCertificateDocs);
      } else if (editingEntry.formType === 'BIRTH_CERTIFICATE_CORRECTION') {
        setBirthCorrectionDetails(editingEntry.details as BirthCertificateCorrectionDetails);
        setBirthCorrectionDocs(editingEntry.documents as BirthCertificateCorrectionDocs);
      } else if (editingEntry.formType === 'DEATH_CERTIFICATE') {
        setDeathDetails(editingEntry.details as DeathCertificateDetails);
        setDeathDocs(editingEntry.documents as DeathCertificateDocs);
`;
code = code.replace(
  "} else if (editingEntry.formType === 'OTHER_SERVICE') {",
  loadEditing + "} else if (editingEntry.formType === 'OTHER_SERVICE') {"
);

// 7. Clear forms
const clearForms = `
      setNewBirthDetails({ ...initialNewBirthCertificateDetails });
      setNewBirthDocs({ ...initialNewBirthCertificateDocs });
      setBirthCorrectionDetails({ ...initialBirthCertificateCorrectionDetails });
      setBirthCorrectionDocs({ ...initialBirthCertificateCorrectionDocs });
      setDeathDetails({ ...initialDeathCertificateDetails });
      setDeathDocs({ ...initialDeathCertificateDocs });
`;
code = code.replace(
  "setOtherDetails({ ...initialOtherDetails });",
  "setOtherDetails({ ...initialOtherDetails });\n" + clearForms
);

fs.writeFileSync('src/components/FormRenderer.tsx', code);
