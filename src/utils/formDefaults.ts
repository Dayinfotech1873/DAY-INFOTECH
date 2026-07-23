import {
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
  DeathCertificateDocs,
  RationCardAddNameDetails,
  RationCardAddNameDocs,
  RationCardRemoveNameDetails,
  RationCardRemoveNameDocs,
  RationCardCorrectionDetails,
  RationCardCorrectionDocs,
  PassportDetails,
  PassportDocs
} from '../types';
export const initialPanDetails: PanCardDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  mobile: '',
  email: '',
  fatherFirstName: '',
  fatherMiddleName: '',
  fatherLastName: '',
  gender: '',
};

export const initialPanDocs: PanCardDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  birthProofType: '',
  birthProofDoc: null,
  signature: null,
  passportPhoto: null,
  voterIdFront: null,
  voterIdBack: null,
};

export const initialVoterDetails: VoterIdDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  mobile: '',
  email: '',
  fatherFirstName: '',
  fatherMiddleName: '',
  fatherLastName: '',
  relativeEpicNumber: '',
  relativeType: '',
  gender: '',
};

export const initialVoterDocs: VoterIdDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  birthProofType: '',
  birthProofDoc: null,
  relativeEpicCardFront: null,
  relativeEpicCardBack: null,
  passportPhoto: null,
};

export const initialEShramDetails: EShramDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  mobile: '',
  email: '',
  bankAccountNum: '',
  bankIfsc: '',
  bankHolderName: '',
  occupation: '',
  gender: '',
};

export const initialEShramDocs: EShramDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  bankPassbook: null,
  passportPhoto: null,
  panCard: null,
};

export const initialFarmerDetails: FarmerSubsidyDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  mobile: '',
  email: '',
  villageName: '',
  district: '',
  subDistrict: '',
  surveyNumber: '',
  subsidyScheme: '',
  bankAccountNum: '',
  bankIfsc: '',
  bankHolderName: '',
  gender: '',
};

export const initialFarmerDocs: FarmerSubsidyDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  landDoc: null,
  bankPassbook: null,
  casteCertificate: null,
};

export const initialCastDetails: CastCertificateDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  mobile: '',
  email: '',
  purpose: '',
  fatherFirstName: '',
  fatherMiddleName: '',
  fatherLastName: '',
  caste: '',
  subCaste: '',
  fatherCaste: '',
  fatherSubCaste: '',
  gender: '',
};

export const initialCastDocs: CastCertificateDocs = {
  rationCardFront: null,
  rationCardBack: null,
  aadharCardFront: null,
  aadharCardBack: null,
  passportPhoto: null,
  schoolLeaving: null,
  fatherSchoolLeaving: null,
};

export const initialIncomeDetails: IncomeCertificateDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  mobile: '',
  email: '',
  purpose: '',
  rationCardNumber: '',
  rationCardMemberId: '',
  gender: '',
};

export const initialIncomeDocs: IncomeCertificateDocs = {
  passportPhoto: null,
  aadharCardFront: null,
  aadharCardBack: null,
  electricityBill: null,
  rationCardFront: null,
  rationCardBack: null,
  otherDoc: null,
};

export const initialAyushmanDetails: AyushmanCardDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  mobile: '',
  email: '',
  rationCardNumber: '',
  aadharCardNumber: '',
  gender: '',
};

export const initialAyushmanDocs: AyushmanCardDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  rationCardFront: null,
  rationCardBack: null,
  passportPhoto: null,
};

export const initialAabhaDetails: AabhaCardDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  mobile: '',
  email: '',
  aadharCardNumber: '',
  gender: '',
};

export const initialAabhaDocs: AabhaCardDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  passportPhoto: null,
};

export const initialOtherDetails: OtherServiceDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  serviceName: '',
  mobile: '',
  gender: '',
};

export const initialOtherDocs: OtherServiceDocs = {
  supportingDoc: null,
};

export const initialUdhyamDetails: UdhyamAadharDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  mobile: '',
  email: '',
  businessName: '',
  businessCategory: '',
  aadharCardNumber: '',
  panCardNumber: '',
  bankAccountNum: '',
  bankIfsc: '',
  bankHolderName: '',
  gender: '',
};

export const initialUdhyamDocs: UdhyamAadharDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  panCard: null,
  bankPassbook: null,
};

export const initialManavDetails: ManavKalyanDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  mobile: '',
  email: '',
  dob: '',
  caste: '',
  scheme: '',
  aadharCardNumber: '',
  rationCardNumber: '',
  rationCardMemberId: '',
  eshramCardNumber: '',
  gender: '',
};

export const initialManavDocs: ManavKalyanDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  eshramCardFront: null,
  eshramCardBack: null,
  rationCardFront: null,
  rationCardBack: null,
  casteCertificate: null,
  incomeCertificate: null,
  signature: null,
  passportPhoto: null,
  selfDeclaration: null,
};

export const initialKuvarDetails: KuvarBaiMameruDetails = {
  kanyaFirstName: '',
  kanyaMiddleName: '',
  kanyaLastName: '',
  kanyaPitaFirstName: '',
  kanyaPitaMiddleName: '',
  kanyaPitaLastName: '',
  kanyaMataFirstName: '',
  kanyaMataMiddleName: '',
  kanyaMataLastName: '',
  kanyaPatiFirstName: '',
  kanyaPatiMiddleName: '',
  kanyaPatiLastName: '',
  kanyaDob: '',
  marriageDate: '',
  kanyaCaste: '',
  kanyaPitaIncome: '',
  yuvakDob: '',
  yuvakPitaFirstName: '',
  yuvakPitaMiddleName: '',
  yuvakPitaLastName: '',
  yuvakMataFirstName: '',
  yuvakMataMiddleName: '',
  yuvakMataLastName: '',
  kanyaRationCardNumber: '',
  yuvakRationCardNumber: '',
  kanyaPitaAadharNumber: '',
  yuvakPitaAadharNumber: '',
  yuvakCaste: '',
  gender: '',
};

export const initialKuvarDocs: KuvarBaiMameruDocs = {
  kanyaPassportPhoto: null,
  yuvakPassportPhoto: null,
  kanyaAadharCardFront: null,
  kanyaAadharCardBack: null,
  yuvakAadharCardFront: null,
  yuvakAadharCardBack: null,
  kanyaPitaAadharCardFront: null,
  kanyaPitaAadharCardBack: null,
  yuvakPitaAadharCardFront: null,
  yuvakPitaAadharCardBack: null,
  kanyaSchoolLeaving: null,
  casteCertificate: null,
  kanyaPitaIncomeCertificate: null,
  kanyaBankPassbook: null,
  marriageCertificate: null,
  selfDeclaration: null,
};


export const initialPanCorrectionDetails: PanCardCorrectionDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  mobile: '',
  email: '',
  oldPanCardNumber: '',
  correctionDetails: [],
  gender: '',
};

export const initialPanCorrectionDocs: PanCardCorrectionDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  signature: null,
  passportPhoto: null,
  birthProofType: '',
  birthProofDoc: null,
  voterIdFront: null,
  voterIdBack: null,
};

export const initialMinorPanDetails: MinorPanCardDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  mobile: '',
  email: '',
  representative: '',
  repFirstName: '',
  repMiddleName: '',
  repLastName: '',
  repDesignation: '',
  gender: '',
};

export const initialMinorPanDocs: MinorPanCardDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  birthCertificate: null,
  passportPhoto: null,
  repSignature: null,
  repDocType: '',
  repAadharFront: null,
  repAadharBack: null,
  repPanCard: null,
};

export const initialVoterCorrectionDetails: VoterIdCorrectionDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  mobile: '',
  email: '',
  correctionDetails: [],
  relativeType: '',
  relativeFirstName: '',
  relativeMiddleName: '',
  relativeLastName: '',
  relativeEpicCardNumber: '',
  oldEpicCardNumber: '',
  gender: '',
};

export const initialVoterCorrectionDocs: VoterIdCorrectionDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  passportPhoto: null,
  birthProofType: '',
  birthProofDoc: null,
  oldEpicCardFront: null,
  oldEpicCardBack: null,
  relativeEpicCardFront: null,
  relativeEpicCardBack: null,
  addressProof: null,
};


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

export const initialRationCardAddNameDetails: RationCardAddNameDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  gender: '',
  fatherFirstName: '',
  fatherMiddleName: '',
  fatherLastName: '',
  motherFirstName: '',
  motherMiddleName: '',
  motherLastName: '',
  address: '',
  rationCardNumber: '',
  relationshipWithHead: '',
  rationCategory: '',
  caste: '',
  mobile: ''
};

export const initialRationCardAddNameDocs: RationCardAddNameDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  rationCardFront: null,
  rationCardBack: null,
  deletionCertificate: null,
  birthCertificate: null,
  headAadharFront: null,
  headAadharBack: null,
  headVoterFront: null,
  headVoterBack: null
};

export const initialRationCardRemoveNameDetails: RationCardRemoveNameDetails = {
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  rationCardNumber: '',
  address: '',
  removeReason: '',
  mobile: ''
};

export const initialRationCardRemoveNameDocs: RationCardRemoveNameDocs = {
  aadharCardFront: null,
  aadharCardBack: null,
  rationCardFront: null,
  rationCardBack: null,
  deathCertificate: null,
  addressProof: null,
  marriageCertificate: null
};

export const initialRationCardCorrectionDetails: RationCardCorrectionDetails = {
  contactAdminMessage: 'Please contact admin and visit DAY INFOTECH',
  firstName: '',
  rationCardNumber: '',
  contactNumber: '',
  correctionEnquiry: ''
};

export const initialRationCardCorrectionDocs: RationCardCorrectionDocs = {
  supportingDoc: null
};

export const initialPassportDetails: PassportDetails = {
  passportCategory: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  caste: '',
  dob: '',
  address: '',
  mobile: '',
  email: '',
  maritalStatus: '',
  spouseName: '',
  passportType: '',
  passportIssueDate: '',
  passportExpiryDate: '',
  passportNumber: '',
  fatherFirstName: '',
  fatherMiddleName: '',
  fatherLastName: '',
  motherFirstName: '',
  motherMiddleName: '',
  motherLastName: '',
};

export const initialPassportDocs: PassportDocs = {
  passportPhoto: null,
  signature: null,
  aadharCardFront: null,
  aadharCardBack: null,
  schoolLeaving: null,
  birthCertificate: null,
  rationCardFront: null,
  rationCardBack: null,
  studyResult: null,
  voterIdFront: null,
  voterIdBack: null,
  oldPassportFront: null,
  oldPassportBack: null,
};


