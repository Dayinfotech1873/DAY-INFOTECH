const fs = require('fs');
let code = fs.readFileSync('src/utils/formDefaults.ts', 'utf8');

// I will prepend the export types from types.ts
const imports = `import {
  PanCardDetails,
  PanCardDocs,
  VoterIdDetails,
  VoterIdDocs,
  EShramDetails,
  EShramDocs,
  FarmerSubsidyDetails,
  FarmerSubsidyDocs,
  CastCertificateDetails,
  CastCertificateDocs,
  IncomeCertificateDetails,
  IncomeCertificateDocs,
  AyushmanCardDetails,
  AyushmanCardDocs,
  AabhaCardDetails,
  AabhaCardDocs,
  OtherServiceDetails,
  OtherServiceDocs,
  UdhyamAadharDetails,
  UdhyamAadharDocs,
  ManavKalyanDetails,
  ManavKalyanDocs,
  KuvarBaiMameruDetails,
  KuvarBaiMameruDocs,
  PanCardCorrectionDetails,
  PanCardCorrectionDocs,
  MinorPanCardDetails,
  MinorPanCardDocs,
  VoterIdCorrectionDetails,
  VoterIdCorrectionDocs,
  NewBirthCertificateDetails,
  NewBirthCertificateDocs,
  BirthCertificateCorrectionDetails,
  BirthCertificateCorrectionDocs,
  DeathCertificateDetails,
  DeathCertificateDocs
} from '../types';
`;

code = imports + code;
fs.writeFileSync('src/utils/formDefaults.ts', code);
