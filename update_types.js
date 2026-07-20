const fs = require('fs');

let content = fs.readFileSync('src/types.ts', 'utf8');

// Insert the new types after VoterIdDetails
const newDetails = `
export interface PanCardCorrectionDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  mobile: string;
  email: string;
  oldPanCardNumber: string;
  correctionDetails: string[];
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface PanCardCorrectionDocs {
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  signature: DocumentUpload | null;
  passportPhoto: DocumentUpload | null;
  birthProofType: 'VOTER_ID' | 'BIRTH_CERTIFICATE' | '';
  birthProofDoc: DocumentUpload | null;
  voterIdFront?: DocumentUpload | null;
  voterIdBack?: DocumentUpload | null;
}

export interface MinorPanCardDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  mobile: string;
  email: string;
  representative: 'FATHER' | 'MOTHER' | 'OTHER' | '';
  repFirstName: string;
  repMiddleName: string;
  repLastName: string;
  repDesignation: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface MinorPanCardDocs {
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  birthCertificate: DocumentUpload | null;
  passportPhoto: DocumentUpload | null;
  repSignature: DocumentUpload | null;
  repDocType: 'AADHAR_CARD' | 'PAN_CARD' | '';
  repAadharFront?: DocumentUpload | null;
  repAadharBack?: DocumentUpload | null;
  repPanCard?: DocumentUpload | null;
}

export interface VoterIdCorrectionDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  mobile: string;
  email: string;
  correctionDetails: string[];
  relativeType: 'FATHER' | 'MOTHER' | 'SPOUSE' | '';
  relativeFirstName: string;
  relativeMiddleName: string;
  relativeLastName: string;
  relativeEpicCardNumber: string;
  oldEpicCardNumber: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface VoterIdCorrectionDocs {
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  passportPhoto: DocumentUpload | null;
  birthProofType: 'BIRTH_CERTIFICATE' | 'SCHOOL_LEAVING' | '';
  birthProofDoc: DocumentUpload | null;
  oldEpicCardFront: DocumentUpload | null;
  oldEpicCardBack: DocumentUpload | null;
  relativeEpicCardFront: DocumentUpload | null;
  relativeEpicCardBack: DocumentUpload | null;
  addressProof: DocumentUpload | null;
}
`;

content = content.replace(/export interface PanCardDetails {/, newDetails + '\nexport interface PanCardDetails {');

// Update ApplicationEntry
content = content.replace(
  /details: PanCardDetails/,
  'details: PanCardDetails | PanCardCorrectionDetails | MinorPanCardDetails | VoterIdCorrectionDetails'
);
content = content.replace(
  /documents: PanCardDocs/,
  'documents: PanCardDocs | PanCardCorrectionDocs | MinorPanCardDocs | VoterIdCorrectionDocs'
);

fs.writeFileSync('src/types.ts', content);
