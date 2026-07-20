const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  "| 'KUVAR_BAI_MAMERU' | 'OTHER_SERVICE'",
  "| 'KUVAR_BAI_MAMERU' | 'NEW_BIRTH_CERTIFICATE' | 'BIRTH_CERTIFICATE_CORRECTION' | 'DEATH_CERTIFICATE' | 'OTHER_SERVICE'"
);

const newTypes = `
export interface NewBirthCertificateDetails {
  childFullNameGu: string;
  childFullNameEn: string;
  dob: string;
  birthTime: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
  formFillDate: string;
  birthPlace: 'HOME' | 'HOSPITAL' | 'SANSTHA' | '';
  hospitalName: string;
  hospitalAddress: string;
  bornTimeAddress: string;
  permanentAddress: string;
  fatherFirstNameGu: string;
  fatherMiddleNameGu: string;
  fatherLastNameGu: string;
  fatherFirstNameEn: string;
  fatherMiddleNameEn: string;
  fatherLastNameEn: string;
  fatherMobile: string;
  fatherEmail: string;
  fatherAadhar: string;
  motherFirstNameGu: string;
  motherMiddleNameGu: string;
  motherLastNameGu: string;
  motherFirstNameEn: string;
  motherMiddleNameEn: string;
  motherLastNameEn: string;
  motherMobile: string;
  motherEmail: string;
  motherAadhar: string;
  informerFirstNameGu: string;
  informerMiddleNameGu: string;
  informerLastNameGu: string;
  informerFirstNameEn: string;
  informerMiddleNameEn: string;
  informerLastNameEn: string;
  informerMobile: string;
  informerEmail: string;
  informerRelationship: string;
  informerAadhar: string;
  informerAddress: string;
}

export interface NewBirthCertificateDocs {
  fatherAadharFront: DocumentUpload | null;
  fatherAadharBack: DocumentUpload | null;
  motherAadharFront: DocumentUpload | null;
  motherAadharBack: DocumentUpload | null;
  rationCardFront: DocumentUpload | null;
  rationCardBack: DocumentUpload | null;
  marriageCertificate: DocumentUpload | null;
  hospitalReceipt: DocumentUpload | null;
  informerAadharFront: DocumentUpload | null;
  informerAadharBack: DocumentUpload | null;
  informerSignature: DocumentUpload | null;
}

export interface BirthCertificateCorrectionDetails {
  childFullNameGu: string;
  childFullNameEn: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
  childAadhar: string;
  registrationNumber: string;
  birthPlace: 'HOME' | 'HOSPITAL' | 'SANSTHA' | '';
  hospitalName: string;
  hospitalAddress: string;
  bornTimeAddress: string;
  permanentAddress: string;
  fatherFirstNameGu: string;
  fatherMiddleNameGu: string;
  fatherLastNameGu: string;
  fatherFirstNameEn: string;
  fatherMiddleNameEn: string;
  fatherLastNameEn: string;
  fatherAadhar: string;
  fatherMobile: string;
  fatherEmail: string;
  motherFirstNameGu: string;
  motherMiddleNameGu: string;
  motherLastNameGu: string;
  motherFirstNameEn: string;
  motherMiddleNameEn: string;
  motherLastNameEn: string;
  motherAadhar: string;
  motherMobile: string;
  motherEmail: string;
  informerFirstNameGu: string;
  informerMiddleNameGu: string;
  informerLastNameGu: string;
  informerFirstNameEn: string;
  informerMiddleNameEn: string;
  informerLastNameEn: string;
  informerMobile: string;
  informerEmail: string;
  informerRelationship: string;
  informerAadhar: string;
  informerAddress: string;
}

export interface BirthCertificateCorrectionDocs {
  oldBirthCertificate: DocumentUpload | null;
  fatherAadharFront: DocumentUpload | null;
  fatherAadharBack: DocumentUpload | null;
  motherAadharFront: DocumentUpload | null;
  motherAadharBack: DocumentUpload | null;
  informerAadharFront: DocumentUpload | null;
  informerAadharBack: DocumentUpload | null;
  informerSignature: DocumentUpload | null;
}

export interface DeathCertificateDetails {
  informerFirstNameGu: string;
  informerMiddleNameGu: string;
  informerLastNameGu: string;
  informerFirstNameEn: string;
  informerMiddleNameEn: string;
  informerLastNameEn: string;
  informerRelationship: string;
  deathDate: string;
  deathTime: string;
  deathPlace: 'HOME' | 'HOSPITAL' | 'OTHER' | '';
  hospitalName: string;
  hospitalAddress: string;
  informerMobile: string;
  informerEmail: string;
  informerAadhar: string;
  deathReason: 'NATURAL' | 'ACCIDENTAL' | 'OTHER' | '';
  deathPersonFirstNameGu: string;
  deathPersonMiddleNameGu: string;
  deathPersonLastNameGu: string;
  deathPersonFirstNameEn: string;
  deathPersonMiddleNameEn: string;
  deathPersonLastNameEn: string;
  deathPersonAadhar: string;
  rationCardNumber: string;
  rationMemberId: string;
  deathTimeAddress: string;
  permanentAddress: string;
  nomineeFirstNameGu: string;
  nomineeMiddleNameGu: string;
  nomineeLastNameGu: string;
  nomineeFirstNameEn: string;
  nomineeMiddleNameEn: string;
  nomineeLastNameEn: string;
  nomineeRelationship: string;
  nomineeAadhar: string;
  nomineeMobile: string;
  nomineeEmail: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | ''; // Adding for consistency
}

export interface DeathCertificateDocs {
  deathPersonPhoto: DocumentUpload | null;
  deathPersonAadharFront: DocumentUpload | null;
  deathPersonAadharBack: DocumentUpload | null;
  deathPersonRationFront: DocumentUpload | null;
  deathPersonRationBack: DocumentUpload | null;
  informerPhoto: DocumentUpload | null;
  informerAadharFront: DocumentUpload | null;
  informerAadharBack: DocumentUpload | null;
  hospitalReceipt: DocumentUpload | null;
  crematoriumReceipt: DocumentUpload | null;
  informerSignature: DocumentUpload | null;
  nomineePhoto: DocumentUpload | null;
  nomineeAadharFront: DocumentUpload | null;
  nomineeAadharBack: DocumentUpload | null;
  nomineeSignature: DocumentUpload | null;
}

`;

code = code.replace('export interface ApplicationEntry {', newTypes + 'export interface ApplicationEntry {');

code = code.replace(
  '| KuvarBaiMameruDetails | OtherServiceDetails;',
  '| KuvarBaiMameruDetails | NewBirthCertificateDetails | BirthCertificateCorrectionDetails | DeathCertificateDetails | OtherServiceDetails;'
);

code = code.replace(
  '| KuvarBaiMameruDocs | OtherServiceDocs;',
  '| KuvarBaiMameruDocs | NewBirthCertificateDocs | BirthCertificateCorrectionDocs | DeathCertificateDocs | OtherServiceDocs;'
);

fs.writeFileSync('src/types.ts', code);
