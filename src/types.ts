export type FormType = 'PAN_CARD' | 'PAN_CARD_CORRECTION' | 'MINOR_PAN_CARD'  | 'VOTER_ID' | 'VOTER_ID_CORRECTION' | 'E_SHRAM' | 'FARMER_SUBSIDY' | 'CAST_CERTIFICATE' | 'INCOME_CERTIFICATE' | 'AYUSHYMAN_CARD' | 'AABHA_CARD' | 'UDHYAM_AADHAR' | 'MANAV_KALYAN' | 'KUVAR_BAI_MAMERU' | 'NEW_BIRTH_CERTIFICATE' | 'BIRTH_CERTIFICATE_CORRECTION' | 'DEATH_CERTIFICATE' | 'OTHER_SERVICE';

export interface DocumentUpload {
  fileName: string;
  fileSize: string;
  fileType: string;
  dataUrl: string; // Base64 data URL for offline storage & display
}


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

export interface PanCardDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  mobile: string;
  email: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface VoterIdDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  mobile: string;
  email: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  relativeEpicNumber: string; // Relative EPIC Number
  relativeType: 'FATHER' | 'MOTHER' | 'SPOUSE' | ''; // Relative Type
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface EShramDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  mobile: string;
  email: string;
  bankAccountNum: string;
  bankIfsc: string;
  bankHolderName: string;
  occupation: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface FarmerSubsidyDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  mobile: string;
  email: string;
  villageName: string;
  district: string;
  subDistrict: string;
  surveyNumber: string; // Khata number / survey number
  subsidyScheme: string; // dynamic typing
  bankAccountNum: string;
  bankIfsc: string;
  bankHolderName: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface CastCertificateDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  mobile: string;
  email: string;
  purpose: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  caste: 'ST' | 'SC' | 'OBC' | 'GENERAL' | 'OTHER' | '';
  subCaste: string;
  fatherCaste: string;
  fatherSubCaste: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface IncomeCertificateDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  mobile: string;
  email: string;
  purpose: string;
  rationCardNumber: string;
  rationCardMemberId: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface AyushmanCardDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  mobile: string;
  email: string;
  rationCardNumber: string;
  aadharCardNumber: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface AabhaCardDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  mobile: string;
  email: string;
  aadharCardNumber: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface OtherServiceDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  serviceName: string;
  mobile: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface UdhyamAadharDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  mobile: string;
  email: string;
  businessName: string;
  businessCategory: 'SERVICE' | 'TRADING' | '';
  aadharCardNumber: string;
  panCardNumber: string;
  bankAccountNum: string;
  bankIfsc: string;
  bankHolderName: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface PanCardDocs {
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  birthProofType: 'VOTER_ID' | 'BIRTH_CERTIFICATE' | '';
  birthProofDoc: DocumentUpload | null;
  signature: DocumentUpload | null;
  passportPhoto: DocumentUpload | null;
  voterIdFront?: DocumentUpload | null;
  voterIdBack?: DocumentUpload | null;
}

export interface VoterIdDocs {
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  birthProofType: 'BIRTH_CERTIFICATE' | 'SCHOOL_LEAVING' | '';
  birthProofDoc: DocumentUpload | null;
  relativeEpicCardFront: DocumentUpload | null;
  relativeEpicCardBack: DocumentUpload | null;
  passportPhoto: DocumentUpload | null;
}

export interface EShramDocs {
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  bankPassbook: DocumentUpload | null;
  passportPhoto: DocumentUpload | null;
  panCard: DocumentUpload | null; // not mandatory
}

export interface FarmerSubsidyDocs {
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  landDoc: DocumentUpload | null; // 7/12-8A
  bankPassbook: DocumentUpload | null;
  casteCertificate: DocumentUpload | null; // not mandatory
}

export interface CastCertificateDocs {
  rationCardFront: DocumentUpload | null;
  rationCardBack: DocumentUpload | null;
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  passportPhoto: DocumentUpload | null;
  schoolLeaving: DocumentUpload | null;
  fatherSchoolLeaving: DocumentUpload | null;
}

export interface IncomeCertificateDocs {
  passportPhoto: DocumentUpload | null;
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  electricityBill: DocumentUpload | null;
  rationCardFront: DocumentUpload | null;
  rationCardBack: DocumentUpload | null;
  otherDoc: DocumentUpload | null; // voter or pan
}

export interface AyushmanCardDocs {
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  rationCardFront: DocumentUpload | null;
  rationCardBack: DocumentUpload | null;
  passportPhoto: DocumentUpload | null;
}

export interface AabhaCardDocs {
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  passportPhoto: DocumentUpload | null;
}

export interface OtherServiceDocs {
  supportingDoc?: DocumentUpload | null; // optional
}

export interface UdhyamAadharDocs {
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  panCard: DocumentUpload | null;
  bankPassbook: DocumentUpload | null;
}

export interface ManavKalyanDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  mobile: string;
  email: string;
  dob: string;
  caste: 'ST' | 'SC' | 'GENERAL' | 'OTHER' | '';
  scheme: 'dudh dahi vechnar' | 'bharatkam' | 'beauty parlor' | 'papad banavat' | 'vahan Services and repairing' | 'plumber' | 'senting kam' | 'electrical implosion and repairing' | 'athana banavat' | 'puncher kit' | '';
  aadharCardNumber: string;
  rationCardNumber: string;
  rationCardMemberId: string;
  eshramCardNumber: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface ManavKalyanDocs {
  aadharCardFront: DocumentUpload | null;
  aadharCardBack: DocumentUpload | null;
  eshramCardFront: DocumentUpload | null;
  eshramCardBack: DocumentUpload | null;
  rationCardFront: DocumentUpload | null;
  rationCardBack: DocumentUpload | null;
  casteCertificate: DocumentUpload | null;
  incomeCertificate: DocumentUpload | null;
  signature: DocumentUpload | null;
  passportPhoto: DocumentUpload | null;
  selfDeclaration: DocumentUpload | null;
}

export interface KuvarBaiMameruDetails {
  kanyaFirstName: string;
  kanyaMiddleName: string;
  kanyaLastName: string;
  kanyaPitaFirstName: string;
  kanyaPitaMiddleName: string;
  kanyaPitaLastName: string;
  kanyaMataFirstName: string;
  kanyaMataMiddleName: string;
  kanyaMataLastName: string;
  kanyaPatiFirstName: string;
  kanyaPatiMiddleName: string;
  kanyaPatiLastName: string;
  kanyaDob: string;
  marriageDate: string;
  kanyaCaste: 'OBC' | 'ST' | 'SC' | 'GENERAL' | 'OTHER' | '';
  kanyaPitaIncome: string;
  yuvakDob: string;
  yuvakPitaFirstName: string;
  yuvakPitaMiddleName: string;
  yuvakPitaLastName: string;
  yuvakMataFirstName: string;
  yuvakMataMiddleName: string;
  yuvakMataLastName: string;
  kanyaRationCardNumber: string;
  yuvakRationCardNumber: string;
  kanyaPitaAadharNumber: string;
  yuvakPitaAadharNumber: string;
  yuvakCaste: 'OBC' | 'SC' | 'ST' | 'GENERAL' | 'OTHER' | '';
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
}

export interface KuvarBaiMameruDocs {
  kanyaPassportPhoto: DocumentUpload | null;
  yuvakPassportPhoto: DocumentUpload | null;
  kanyaAadharCardFront: DocumentUpload | null;
  kanyaAadharCardBack: DocumentUpload | null;
  yuvakAadharCardFront: DocumentUpload | null;
  yuvakAadharCardBack: DocumentUpload | null;
  kanyaPitaAadharCardFront: DocumentUpload | null;
  kanyaPitaAadharCardBack: DocumentUpload | null;
  yuvakPitaAadharCardFront: DocumentUpload | null;
  yuvakPitaAadharCardBack: DocumentUpload | null;
  kanyaSchoolLeaving: DocumentUpload | null;
  casteCertificate: DocumentUpload | null; // not mandatory
  kanyaPitaIncomeCertificate: DocumentUpload | null;
  kanyaBankPassbook: DocumentUpload | null;
  marriageCertificate: DocumentUpload | null;
  selfDeclaration: DocumentUpload | null;
}


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

export interface ApplicationEntry {
  id: string;
  formType: FormType;
  details: PanCardDetails | PanCardCorrectionDetails | MinorPanCardDetails | VoterIdCorrectionDetails | VoterIdDetails | EShramDetails | FarmerSubsidyDetails | CastCertificateDetails | IncomeCertificateDetails | AyushmanCardDetails | AabhaCardDetails | UdhyamAadharDetails | ManavKalyanDetails | KuvarBaiMameruDetails | NewBirthCertificateDetails | BirthCertificateCorrectionDetails | DeathCertificateDetails | OtherServiceDetails;
  documents: PanCardDocs | PanCardCorrectionDocs | MinorPanCardDocs | VoterIdCorrectionDocs | VoterIdDocs | EShramDocs | FarmerSubsidyDocs | CastCertificateDocs | IncomeCertificateDocs | AyushmanCardDocs | AabhaCardDocs | UdhyamAadharDocs | ManavKalyanDocs | KuvarBaiMameruDocs | NewBirthCertificateDocs | BirthCertificateCorrectionDocs | DeathCertificateDocs | OtherServiceDocs;
  status: 'DRAFT' | 'COMPLETED' | 'CORRECTION_REQUIRED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  userId?: string;
  adminFeedback?: string;
  rejectionReason?: string;
  allowApplicantEdit?: boolean;
  paymentMode?: 'CASH' | 'ONLINE' | 'FREE' | 'WALLET' | null;
  paymentAmount?: number;
  paymentStatus?: 'PENDING' | 'PAID' | 'COMPLETED' | null;
  isWalletRefunded?: boolean;
}

export interface Wallet {
  id: string; // same as userId
  userId: string;
  balance: number;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  amount: number;
  type: 'DEPOSIT_REQUEST' | 'DEPOSIT_APPROVED' | 'DEPOSIT_REJECTED' | 'PAYMENT' | 'REFUND_REQUEST' | 'REFUND_APPROVED' | 'REFUND_REJECTED';
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  paymentMethod: 'UPI_QR' | 'WALLET_DEDUCTION' | 'REFUND';
  referenceId?: string; // UTR / Tx ID for deposit request
  refundMethod?: 'CASH' | 'UPI';
  upiId?: string;
  createdAt: string;
  approvedAt?: string;
  notes?: string;
}

export interface OfflineForm {
  id: string;
  title: string;
  description: string;
  price: number;
  pdfName: string;
  pdfDataUrl: string; // Base64 or general URL
  downloadCount: number;
  createdAt: string;
}


