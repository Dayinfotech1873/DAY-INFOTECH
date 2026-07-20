const fs = require('fs');
let code = fs.readFileSync('src/utils/formDefaults.ts', 'utf8');

const newDefaults = `
import {
  NewBirthCertificateDetails,
  NewBirthCertificateDocs,
  BirthCertificateCorrectionDetails,
  BirthCertificateCorrectionDocs,
  DeathCertificateDetails,
  DeathCertificateDocs
} from '../types';

export const initialNewBirthCertificateDetails: NewBirthCertificateDetails = {
  childFullNameGu: '',
  childFullNameEn: '',
  dob: '',
  birthTime: '',
  gender: '',
  formFillDate: '',
  birthPlace: '',
  hospitalName: '',
  hospitalAddress: '',
  bornTimeAddress: '',
  permanentAddress: '',
  fatherFirstNameGu: '',
  fatherMiddleNameGu: '',
  fatherLastNameGu: '',
  fatherFirstNameEn: '',
  fatherMiddleNameEn: '',
  fatherLastNameEn: '',
  fatherMobile: '',
  fatherEmail: '',
  fatherAadhar: '',
  motherFirstNameGu: '',
  motherMiddleNameGu: '',
  motherLastNameGu: '',
  motherFirstNameEn: '',
  motherMiddleNameEn: '',
  motherLastNameEn: '',
  motherMobile: '',
  motherEmail: '',
  motherAadhar: '',
  informerFirstNameGu: '',
  informerMiddleNameGu: '',
  informerLastNameGu: '',
  informerFirstNameEn: '',
  informerMiddleNameEn: '',
  informerLastNameEn: '',
  informerMobile: '',
  informerEmail: '',
  informerRelationship: '',
  informerAadhar: '',
  informerAddress: ''
};

export const initialNewBirthCertificateDocs: NewBirthCertificateDocs = {
  fatherAadharFront: null,
  fatherAadharBack: null,
  motherAadharFront: null,
  motherAadharBack: null,
  rationCardFront: null,
  rationCardBack: null,
  marriageCertificate: null,
  hospitalReceipt: null,
  informerAadharFront: null,
  informerAadharBack: null,
  informerSignature: null
};

export const initialBirthCertificateCorrectionDetails: BirthCertificateCorrectionDetails = {
  childFullNameGu: '',
  childFullNameEn: '',
  dob: '',
  gender: '',
  childAadhar: '',
  registrationNumber: '',
  birthPlace: '',
  hospitalName: '',
  hospitalAddress: '',
  bornTimeAddress: '',
  permanentAddress: '',
  fatherFirstNameGu: '',
  fatherMiddleNameGu: '',
  fatherLastNameGu: '',
  fatherFirstNameEn: '',
  fatherMiddleNameEn: '',
  fatherLastNameEn: '',
  fatherAadhar: '',
  fatherMobile: '',
  fatherEmail: '',
  motherFirstNameGu: '',
  motherMiddleNameGu: '',
  motherLastNameGu: '',
  motherFirstNameEn: '',
  motherMiddleNameEn: '',
  motherLastNameEn: '',
  motherAadhar: '',
  motherMobile: '',
  motherEmail: '',
  informerFirstNameGu: '',
  informerMiddleNameGu: '',
  informerLastNameGu: '',
  informerFirstNameEn: '',
  informerMiddleNameEn: '',
  informerLastNameEn: '',
  informerMobile: '',
  informerEmail: '',
  informerRelationship: '',
  informerAadhar: '',
  informerAddress: ''
};

export const initialBirthCertificateCorrectionDocs: BirthCertificateCorrectionDocs = {
  oldBirthCertificate: null,
  fatherAadharFront: null,
  fatherAadharBack: null,
  motherAadharFront: null,
  motherAadharBack: null,
  informerAadharFront: null,
  informerAadharBack: null,
  informerSignature: null
};

export const initialDeathCertificateDetails: DeathCertificateDetails = {
  informerFirstNameGu: '',
  informerMiddleNameGu: '',
  informerLastNameGu: '',
  informerFirstNameEn: '',
  informerMiddleNameEn: '',
  informerLastNameEn: '',
  informerRelationship: '',
  deathDate: '',
  deathTime: '',
  deathPlace: '',
  hospitalName: '',
  hospitalAddress: '',
  informerMobile: '',
  informerEmail: '',
  informerAadhar: '',
  deathReason: '',
  deathPersonFirstNameGu: '',
  deathPersonMiddleNameGu: '',
  deathPersonLastNameGu: '',
  deathPersonFirstNameEn: '',
  deathPersonMiddleNameEn: '',
  deathPersonLastNameEn: '',
  deathPersonAadhar: '',
  rationCardNumber: '',
  rationMemberId: '',
  deathTimeAddress: '',
  permanentAddress: '',
  nomineeFirstNameGu: '',
  nomineeMiddleNameGu: '',
  nomineeLastNameGu: '',
  nomineeFirstNameEn: '',
  nomineeMiddleNameEn: '',
  nomineeLastNameEn: '',
  nomineeRelationship: '',
  nomineeAadhar: '',
  nomineeMobile: '',
  nomineeEmail: '',
  gender: ''
};

export const initialDeathCertificateDocs: DeathCertificateDocs = {
  deathPersonPhoto: null,
  deathPersonAadharFront: null,
  deathPersonAadharBack: null,
  deathPersonRationFront: null,
  deathPersonRationBack: null,
  informerPhoto: null,
  informerAadharFront: null,
  informerAadharBack: null,
  hospitalReceipt: null,
  crematoriumReceipt: null,
  informerSignature: null,
  nomineePhoto: null,
  nomineeAadharFront: null,
  nomineeAadharBack: null,
  nomineeSignature: null
};

`;

code = code.replace(
  "import {",
  "import {\n  NewBirthCertificateDetails,\n  NewBirthCertificateDocs,\n  BirthCertificateCorrectionDetails,\n  BirthCertificateCorrectionDocs,\n  DeathCertificateDetails,\n  DeathCertificateDocs,"
);

code = code + '\n' + newDefaults;

fs.writeFileSync('src/utils/formDefaults.ts', code);
